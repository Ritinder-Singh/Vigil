import asyncio
import json
import os
from fastapi import FastAPI, Response, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models import PublicMetrics, PrivateMetrics
from metrics import get_public_metrics, get_private_metrics
from auth import verify_password, create_token, require_auth

load_dotenv()

app = FastAPI(title="vigil")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------Auth------------------------------------------------


@app.post("/auth/login")
def login(body: dict, response: Response):
    password = body.get("password", "")
    if not verify_password(password):
        raise HTTPException(status_code=401, detail="Invalid Password")
    token = create_token()
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        max_age=60 * 60 * 24,
    )
    return {"ok": True}


@app.post("/auth/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"ok": True}


@app.post("/auth/me")
def me(payload=Depends(require_auth)):
    return {"user": payload.get("sub")}


# -------Public Endpoints------------------------------------------------


@app.get("/metrics/snapshot", response_model=PublicMetrics)
def snapshot():
    return get_public_metrics()


async def public_stream():
    while True:
        data = get_public_metrics().model_dump()
        yield f"data: {json.dumps(data)}\n\n"
        await asyncio.sleep(2)


@app.get("/metrics/stream")
def stream():
    return StreamingResponse(public_stream(), media_type="text/event-stream")


# --------- Private Endpoints------------------------------------------------


@app.get("/metrics/private/snapshot", response_model=PrivateMetrics)
def private_snapshot(payload=Depends(require_auth)):
    return get_private_metrics()


async def private_stream(payload: dict):
    while True:
        data = get_private_metrics().model_dump()
        yield f"data: {json.dumps(data)}\n\n"
        await asyncio.sleep(2)


@app.get("/metrics/private/stream")
def private_stream_endpoint(payload=Depends(require_auth)):
    return StreamingResponse(private_stream(payload), media_type="text/event-stream")
