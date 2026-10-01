# Dynamic Portfolio Dashboard

A full-stack, real-time stock portfolio dashboard designed to track investments, view current market prices, calculate gain/loss, and display fundamental metrics like P/E ratios and latest earnings.

## Features
- **Real-Time Price Updates**: Fetches the Current Market Price (CMP) of Indian Stocks (NSE/BSE) every 60 seconds.
- **Fundamental Data**: Integrates with Google Finance via SerpApi to display P/E ratios and latest earnings.
- **Smart Caching**: Built-in backend caching mechanism to prevent API rate limits, ensuring snappy performance and avoiding ban thresholds.
- **Dynamic UI**: A responsive, modern dashboard built with React and Tailwind CSS.


## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express, TypeScript, `yahoo-finance2`
- **External APIs**: Yahoo Finance (for live prices), SerpApi (for Google Finance fundamentals)

## Prerequisites
- [Node.js](https://nodejs.org/) installed (v16 or higher)
- A free [SerpApi](https://serpapi.com/) account and API key

## Setup & Installation

### 1. Install Dependencies
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

### 2. Environment Variables
Create a `.env` file in the root of the `backend/` directory. Add your SerpApi key as follows:
```env
SERPAPI_KEY="your_api_key_here"
```
*(Note: Do not share or commit this key to public repositories).*

### 3. Run the Application locally
Start the Backend Server (Runs on port 3001):
```bash
cd backend
npm run dev
```

Start the Frontend Server (Runs on port 5173):
```bash
cd frontend
npm run dev
```

## Usage
Once both servers are running successfully, open `http://localhost:5173` (or the port provided by Vite) in your web browser. 
The frontend automatically requests data every 15 seconds to keep the UI snappy, while the backend serves cached data to optimize external API limits.


