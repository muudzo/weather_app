from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
from dotenv import load_dotenv
import os
from typing import Optional
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('weather_api.log'),
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

# Allow the frontend dev server(s) to access this API during development
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Weather API starting up...")
    if not API_KEY:
        logger.error("❌ OPENWEATHER_API_KEY not found in environment variables")
    else:
        logger.info("✅ API key loaded successfully")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("👋 Weather API shutting down...")

@app.get("/")
def root():
    logger.info("Root endpoint accessed")
    return {
        "message": "tate is the goat!",
        "endpoints": {
            "/weather": "Get current weather for a city",
            "/forecast": "Get 5-day weather forecast for a city"
        }
    }

@app.get("/weather")
async def get_weather(city: Optional[str] = "Taipei"):
    logger.info(f"Weather request received for city: {city}")
    
    # Validate API key
    if not API_KEY:
        logger.error("API key not configured")
        raise HTTPException(
            status_code=500,
            detail="API key not loaded from .env file"
        )
    
    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            logger.debug(f"Sending request to OpenWeather API for {city}")
            response = await client.get(BASE_URL, params=params)
    except httpx.RequestError as e:
        logger.error(f"Network error when fetching weather for {city}: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Network error — could not reach OpenWeather"
        )
    
    # Handle API HTTP status errors
    if response.status_code != 200:
        logger.warning(f"OpenWeather API returned status {response.status_code} for city: {city}")
        raise HTTPException(
            status_code=response.status_code,
            detail=f"OpenWeather API error: {response.text}"
        )
    
    data = response.json()
    logger.info(f"✅ Successfully fetched weather for {city}: {data['main']['temp']}°C")
    
    return {
        "city": data["name"],
        "country": data["sys"]["country"],
        "temperature": data["main"]["temp"],
        "feels_like": data["main"]["feels_like"],
        "description": data["weather"][0]["description"],
        "humidity": data["main"]["humidity"],
        "wind_speed": data["wind"]["speed"],
        "timestamp": datetime.fromtimestamp(data["dt"]).isoformat()
    }

@app.get("/forecast")
async def get_forecast(city: Optional[str] = "Taipei"):
    logger.info(f"Forecast request received for city: {city}")
    
    # Validate API key
    if not API_KEY:
        logger.error("API key not configured")
        raise HTTPException(
            status_code=500,
            detail="API key not loaded from .env file"
        )
    
    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            logger.debug(f"Sending forecast request to OpenWeather API for {city}")
            response = await client.get(FORECAST_URL, params=params)
    except httpx.RequestError as e:
        logger.error(f"Network error when fetching forecast for {city}: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Network error — could not reach OpenWeather"
        )
    
    # Handle API HTTP status errors
    if response.status_code != 200:
        logger.warning(f"OpenWeather API returned status {response.status_code} for city: {city}")
        raise HTTPException(
            status_code=response.status_code,
            detail=f"OpenWeather API error: {response.text}"
        )
    
    data = response.json()
    logger.info(f"✅ Successfully fetched 5-day forecast for {city}")
    
    # Process forecast data - group by day
    forecasts = []
    for item in data["list"]:
        forecasts.append({
            "datetime": datetime.fromtimestamp(item["dt"]).isoformat(),
            "temperature": item["main"]["temp"],
            "feels_like": item["main"]["feels_like"],
            "description": item["weather"][0]["description"],
            "humidity": item["main"]["humidity"],
            "wind_speed": item["wind"]["speed"],
            "pop": item.get("pop", 0) * 100  # Probability of precipitation
        })
    
    return {
        "city": data["city"]["name"],
        "country": data["city"]["country"],
        "forecast_count": len(forecasts),
        "forecasts": forecasts
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    logger.debug("Health check endpoint accessed")
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }