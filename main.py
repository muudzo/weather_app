from fastapi import FastAPI

app = FastAPI()
@app.get("/")
def root():
    return {"message": "tate is the goat!"}