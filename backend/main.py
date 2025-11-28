from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
from dotenv import load_dotenv
import os
from typing import Optional, Dict, Any, Tuple
import logging
from datetime import datetime, timedelta
from pydantic import BaseModel


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("weather_api.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"

app = FastAPI(
    title="Weather API",
    description="A professional weather API with current weather and 5-day forecast",
    version="1.0.0"
)

# For development allow all origins so the static frontend can fetch without CORS issues.
# In production restrict this to your deployed frontend origin(s).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for responses
class WeatherData(BaseModel):
    city: str
    country: str
    temperature: float
    feels_like: float
    description: str
    humidity: int
    wind_speed: float
    timestamp: datetime


class ForecastItem(BaseModel):
    datetime: datetime
    temperature: float
    feels_like: float
    description: str
    humidity: int
    wind_speed: float
    pop: float


class ForecastResponse(BaseModel):
    city: str
    country: str
    forecast_count: int
    forecasts: list[ForecastItem]


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None


# Simple in-memory cache to avoid repeated failed requests and reduce API usage
# cache: city_lower -> (data_dict, expiry_datetime)
CACHE: Dict[str, Tuple[Dict[str, Any], datetime]] = {}
# Cache TTL in seconds for successful responses
CACHE_TTL = int(os.getenv("WEATHER_CACHE_TTL", "60"))
# On repeated failure, store a short negative cache to prevent rapid retries
NEGATIVE_CACHE_TTL = int(os.getenv("NEGATIVE_CACHE_TTL", "20"))

# HTTPX settings
HTTPX_TIMEOUT = float(os.getenv("HTTPX_TIMEOUT", "10.0"))
RETRY_COUNT = int(os.getenv("HTTP_RETRY_COUNT", "2"))


@app.on_event("startup")
async def startup_event():
    # create one AsyncClient for all requests (connection pooling)
    app.state.http_client = httpx.AsyncClient(timeout=HTTPX_TIMEOUT)
    logger.info("🚀 Weather API starting up...")
    if not API_KEY:
        logger.warning("OPENWEATHER_API_KEY not found in environment variables")
    else:
        logger.info("✅ API key loaded successfully")


@app.on_event("shutdown")
async def shutdown_event():
    client: httpx.AsyncClient = getattr(app.state, "http_client", None)
    if client:
        await client.aclose()
    logger.info("👋 Weather API shutting down...")


def _cache_get(city: str) -> Optional[Dict[str, Any]]:
    key = city.lower()
    entry = CACHE.get(key)
    if not entry:
        return None
    data, expiry = entry
    if datetime.utcnow() > expiry:
        CACHE.pop(key, None)
        return None
    return data


def _cache_set(city: str, data: Dict[str, Any], ttl: int = CACHE_TTL) -> None:
    key = city.lower()
    expiry = datetime.utcnow() + timedelta(seconds=ttl)
    CACHE[key] = (data, expiry)


import asyncio


@app.get("/weather", response_model=WeatherData, responses={400: {"model": ErrorResponse}, 404: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def get_weather(request: Request, city: Optional[str] = "Taipei"):
    """Get current weather for a city."""
    logger.info(f"Weather request received for city: {city}")

    # Validate input
    if not city or not city.strip():
        logger.debug("Invalid or empty city provided")
        return JSONResponse(status_code=400, content=ErrorResponse(error="invalid_city", detail="City parameter is required").dict())
    city = city.strip()
    if len(city) > 100:
        return JSONResponse(status_code=400, content=ErrorResponse(error="invalid_city", detail="City name too long").dict())

    # Return cached response if fresh
    cached = _cache_get(city)
    if cached:
        logger.debug(f"Returning cached weather for city: {city}")
        return cached

    if not API_KEY:
        logger.error("API key not configured")
        return JSONResponse(status_code=500, content=ErrorResponse(error="no_api_key", detail="Server misconfiguration: OPENWEATHER_API_KEY not set").dict())

    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    try:
        # perform request with retries
        client: httpx.AsyncClient = app.state.http_client
        last_exc = None
        for attempt in range(RETRY_COUNT + 1):
            try:
                resp = await client.get(BASE_URL, params=params)
                break
            except Exception as e:
                last_exc = e
                logger.warning(f"Attempt {attempt + 1} failed for city {city}: {e}")
                await asyncio.sleep(0.5 * (attempt + 1))
        else:
            # exhausted retries
            logger.error(f"All attempts failed fetching weather for {city}: {last_exc}")
            _cache_set(city, ErrorResponse(error="fetch_failed", detail=str(last_exc)).dict(), ttl=NEGATIVE_CACHE_TTL)
            return JSONResponse(status_code=503, content=ErrorResponse(error="fetch_failed", detail=str(last_exc)).dict())

    except Exception as e:
        logger.exception("Unexpected error during weather fetch")
        return JSONResponse(status_code=500, content=ErrorResponse(error="internal_error", detail=str(e)).dict())

    # Handle non-200 from OpenWeather
    if resp.status_code == 404:
        logger.info(f"City not found in OpenWeather: {city}")
        _cache_set(city, ErrorResponse(error="not_found", detail="City not found").dict(), ttl=NEGATIVE_CACHE_TTL)
        return JSONResponse(status_code=404, content=ErrorResponse(error="not_found", detail="City not found").dict())

    if resp.status_code != 200:
        logger.warning(f"OpenWeather returned status {resp.status_code} for {city}: {resp.text}")
        _cache_set(city, ErrorResponse(error="upstream_error", detail=f"Status {resp.status_code}").dict(), ttl=NEGATIVE_CACHE_TTL)
        return JSONResponse(status_code=502, content=ErrorResponse(error="upstream_error", detail=f"OpenWeather status {resp.status_code}").dict())

    try:
        data = resp.json()
    except Exception as e:
        logger.exception("Failed to parse JSON from OpenWeather")
        return JSONResponse(status_code=502, content=ErrorResponse(error="invalid_response", detail=str(e)).dict())

    try:
        weather = {
            "city": data.get("name", city),
            "country": data.get("sys", {}).get("country", ""),
            "temperature": float(data["main"]["temp"]),
            "feels_like": float(data["main"].get("feels_like", data["main"]["temp"])),
            "description": data.get("weather", [{}])[0].get("description", ""),
            "humidity": int(data["main"].get("humidity", 0)),
            "wind_speed": float(data.get("wind", {}).get("speed", 0.0)),
            "timestamp": datetime.fromtimestamp(int(data.get("dt", datetime.utcnow().timestamp())))
        }
    except Exception as e:
        logger.exception("Error normalizing OpenWeather data")
        return JSONResponse(status_code=502, content=ErrorResponse(error="invalid_data", detail=str(e)).dict())

    # Cache successful response
    _cache_set(city, weather, ttl=CACHE_TTL)

    logger.info(f"✅ Successfully fetched weather for {city}: {weather['temperature']}°C")
    return weather


@app.get("/forecast", response_model=ForecastResponse, responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def get_forecast(city: Optional[str] = "Taipei"):
    logger.info(f"Forecast request received for city: {city}")

    if not city or not city.strip():
        return JSONResponse(status_code=400, content=ErrorResponse(error="invalid_city", detail="City parameter is required").dict())
    city = city.strip()

    # small cache check
    cached = _cache_get(f"forecast:{city}")
    if cached:
        return cached

    if not API_KEY:
        logger.error("API key not configured")
        return JSONResponse(status_code=500, content=ErrorResponse(error="no_api_key", detail="Server misconfiguration: OPENWEATHER_API_KEY not set").dict())

    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    client: httpx.AsyncClient = app.state.http_client
    try:
        resp = await client.get(FORECAST_URL, params=params)
    except Exception as e:
        logger.exception("Network error when fetching forecast")
        return JSONResponse(status_code=503, content=ErrorResponse(error="fetch_failed", detail=str(e)).dict())

    if resp.status_code != 200:
        logger.warning(f"OpenWeather forecast returned status {resp.status_code} for city: {city}")
        return JSONResponse(status_code=502, content=ErrorResponse(error="upstream_error", detail=f"Status {resp.status_code}").dict())

    try:
        data = resp.json()
    except Exception as e:
        logger.exception("Failed to parse forecast JSON")
        return JSONResponse(status_code=502, content=ErrorResponse(error="invalid_response", detail=str(e)).dict())

    forecasts = []
    for item in data.get("list", []):
        try:
            forecasts.append({
                "datetime": datetime.fromtimestamp(int(item.get("dt", datetime.utcnow().timestamp()))),
                "temperature": float(item["main"].get("temp", 0.0)),
                "feels_like": float(item["main"].get("feels_like", 0.0)),
                "description": item.get("weather", [{}])[0].get("description", ""),
                "humidity": int(item["main"].get("humidity", 0)),
                "wind_speed": float(item.get("wind", {}).get("speed", 0.0)),
                "pop": float(item.get("pop", 0.0)) * 100.0
            })
        except Exception:
            logger.exception("Skipping malformed forecast item")

    result = {
        "city": data.get("city", {}).get("name", city),
        "country": data.get("city", {}).get("country", ""),
        "forecast_count": len(forecasts),
        "forecasts": forecasts
    }

    _cache_set(f"forecast:{city}", result, ttl=CACHE_TTL)
    logger.info(f"✅ Successfully fetched forecast for {city} ({len(forecasts)} items)")
    return result


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    logger.debug("Health check endpoint accessed")
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}