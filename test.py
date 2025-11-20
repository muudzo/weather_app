import os
from dotenv import load_dotenv
import httpx

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY")
print("Loaded API_KEY:", API_KEY)  # This should print your key

city = "Taipei"
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"
params = {"q": city, "appid": API_KEY, "units": "metric"}

response = httpx.get(BASE_URL, params=params)
print("Status code:", response.status_code)
print("Response JSON:", response.json())
