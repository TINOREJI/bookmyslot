from fastapi import FastAPI

app = FastAPI(title="BookMySlot API")

@app.get("/")
async def root():
    return {"message": "BookMySlot API"}