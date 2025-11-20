from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "tate is the goat!"}

@app.get("/weather")
def get_weather(city: str):
    
    # Placeholder response
    return {
        "city": "Taipei",
        "temperature": None,
        "condition": None,
        "humidity": None,
        "wind_speed": None
    }
