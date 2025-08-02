#!/usr/bin/env python3
"""
Startup script for the AI Document Summarizer Backend
"""
import os
import sys
import uvicorn
from dotenv import load_dotenv

def main():
    """Main startup function"""
    # Load environment variables
    load_dotenv()
    
    # Check for required environment variables
    if not os.getenv("GOOGLE_API_KEY"):
        print("❌ Error: GOOGLE_API_KEY environment variable is not set!")
        print("Please create a .env file with your Google AI API key.")
        print("You can copy .env.example to .env and fill in your API key.")
        sys.exit(1)
    
    # Create summaries directory if it doesn't exist
    summaries_dir = os.getenv("SUMMARIES_DIR", "summaries")
    os.makedirs(summaries_dir, exist_ok=True)
    
    # Get configuration from environment
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    print("🚀 Starting AI Document Summarizer Backend...")
    print(f"📡 Server will run on: http://{host}:{port}")
    print(f"📁 Summaries will be saved to: {summaries_dir}")
    print(f"🔑 Google AI API Key: {'✅ Set' if os.getenv('GOOGLE_API_KEY') else '❌ Not Set'}")
    print("-" * 50)
    
    # Start the server
    try:
        uvicorn.run(
            "app:app",
            host=host,
            port=port,
            reload=debug,
            log_level="info" if debug else "warning",
            access_log=debug
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()