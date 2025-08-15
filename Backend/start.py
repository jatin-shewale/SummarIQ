import uvicorn

if __name__ == "__main__":
    print("Starting SummarIQ Backend Server...")
    print("API will be available at: http://localhost:8000")
    print("API Documentation at: http://localhost:8000/docs")
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True) 