from fastapi import FastAPI, HTTPException
import httpx
from dotenv import load_dotenv
import os
from typing import Optional

# Load environment variables
load_dotenv()
API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

app = FastAPI()

@app.get("/")
def root():
    return {"message": "tate is the goat!"}

@app.get("/weather")
async def get_weather(city: Optional[str] = "Taipei"):
    # Validate API key
    if not API_KEY:
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
            response = await client.get(BASE_URL, params=params)
    except httpx.RequestError:
        raise HTTPException(
            status_code=503,
            detail="Network error — could not reach OpenWeather"
        )
    
    # Handle API HTTP status errors
    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"OpenWeather API error: {response.text}"
        )
    
    data = response.json()
    
    return {
        "city": data["name"],
        "temperature": data["main"]["temp"],
        "feels_like": data["main"]["feels_like"],
        "description": data["weather"][0]["description"],
        "humidity": data["main"]["humidity"],
        "wind_speed": data["wind"]["speed"]
    }