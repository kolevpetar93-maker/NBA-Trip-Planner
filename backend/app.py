"""Preprost Flask API. Zagon iz glavne mape: python -m backend.app."""

import json
import os
from pathlib import Path

from flask import Flask, jsonify, request
from pydantic import ValidationError

from backend.llm import GuideError, GuideRequest, ask_gemini

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024

# .env ni potreben. Lokalna datoteka s ključem se ne objavi na GitHub.
config_file = Path(__file__).with_name("config.local.json")
settings = json.loads(config_file.read_text(encoding="utf-8")) if config_file.exists() else {}
if not isinstance(settings, dict):
    raise ValueError("config.local.json must contain a JSON object.")

app.config["GEMINI_API_KEY"] = settings.get("gemini_api_key") or os.getenv("GEMINI_API_KEY", "")
app.config["GEMINI_MODEL"] = settings.get("gemini_model") or "gemini-3.5-flash-lite"
if not all(isinstance(app.config[name], str) for name in ("GEMINI_API_KEY", "GEMINI_MODEL")):
    raise ValueError("The Gemini API key and model must be text values.")
app.config["GEMINI_API_KEY"] = app.config["GEMINI_API_KEY"].strip()
app.config["GEMINI_MODEL"] = app.config["GEMINI_MODEL"].strip() or "gemini-3.5-flash-lite"


@app.get("/api/health")
def health():
    return jsonify(status="ok", provider="Gemini", configured=bool(app.config["GEMINI_API_KEY"]))


@app.post("/api/chat")
def chat():
    if not request.is_json:
        return jsonify(error="Please send the question as JSON."), 415
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify(error="Please send a valid JSON object."), 400

    try:
        user_input = GuideRequest.model_validate(payload)
    except ValidationError:
        return jsonify(error="Enter a question of 3–2000 characters and check the form values."), 400

    try:
        answer = ask_gemini(user_input, app.config["GEMINI_API_KEY"], app.config["GEMINI_MODEL"])
        return jsonify(answer.model_dump())
    except GuideError as error:
        return jsonify(error=str(error)), error.status


@app.errorhandler(413)
def too_large(error):
    return jsonify(error="The question is too long. Please shorten it."), 413


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
