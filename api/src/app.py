from datetime import datetime
from datetime import timedelta
from typing import TypedDict

from fastapi import FastAPI, Form, status
from fastapi.responses import RedirectResponse

from services.database import JSONDatabase

app = FastAPI()


class Quote(TypedDict):
    name: str
    message: str
    time: str


database: JSONDatabase[list[Quote]] = JSONDatabase("data/database.json")


@app.on_event("startup")
def on_startup() -> None:
    """Initialize database when starting API server."""
    if "quotes" not in database:
        print("Adding quotes entry to database")
        database["quotes"] = []


@app.on_event("shutdown")
def on_shutdown() -> None:
    """Close database when stopping API server."""
    database.close()


@app.post("/quote")
def post_message(name: str = Form(), message: str = Form()) -> RedirectResponse:
    """
    Process a user submitting a new quote.
    You should not modify this function except for the return value.
    """
    now = datetime.now().replace(microsecond=0)

    quote = Quote(name=name, message=message, time=now.isoformat())
    database["quotes"].append(quote)

    # You may modify the return value as needed to support other functionality
    return RedirectResponse("/", status.HTTP_303_SEE_OTHER)


# TODO: add another API route with a query parameter to retrieve quotes based on max age
@app.get("/quote/get")
def get_message(time: str) -> list[dict]:
    '''
    returns quotes in a specified time range, as noted by the
    time parameter
    '''
    quotes = database["quotes"]
    quote_times = []
    time_now = datetime.now()
    
    if(time == "past_hour"):
        time_now = datetime.now() - timedelta(hours=1)
    elif(time == "past_day"):
        time_now = datetime.now() - timedelta(days=1)
    elif(time == "past_week"):
        time_now = datetime.now() - timedelta(days=7)
    elif(time == "past_two_weeks"):
        time_now = datetime.now() - timedelta(days=14)
    elif(time == "past_month"):
        time_now = datetime.now() - timedelta(days=30)
    elif(time == "past_year"):
        time_now = datetime.now() - timedelta(days=365)

    for quote in quotes:
        if(time == "all" or datetime.strptime(quote["time"], "%Y-%m-%dT%H:%M:%S") >= time_now):
            quote_times.append(quote.copy())

    for quote in quote_times:
        quote["time"] = datetime.strptime(quote["time"], "%Y-%m-%dT%H:%M:%S").strftime("%a - %b %d, %Y at %I:%M %p")
        
    return quote_times