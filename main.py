from fastapi import FastAPI, HTTPException
import httpx
from dotenv import load_dotenv
import os

load_dotenv()  # Load variables from .env

API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

app = FastAPI()

@app.get("/")
def root():
    return {"message": "tate is the goat!"}

@app.get("/weather")
async def get_weather(city: str):
    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(BASE_URL, params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="City not found or API error."
        )

    data = response.json()

    cleaned = {
        "city": data["name"],
        "temperature": data["main"]["temp"],
        "condition": data["weather"][0]["description"].title(),
        "humidity": data["main"]["humidity"],
        "wind_speed": data["wind"]["speed"]
    }

    return cleaned
