
from pathlib import Path

import pandas as pd
from flask import Flask, jsonify, request, render_template
from pyaxis import pyaxis


# Glavna mapa projekta
BASE_DIR = Path(__file__).resolve().parent.parent

# Pot do PC-Axis datoteke
PX_FILE = BASE_DIR / "data" / "tourisam.PX"

# Flask aplikacija
app = Flask(
    __name__,
    template_folder=str(BASE_DIR / "templates"),
    static_folder=str(BASE_DIR / "static")
)


def load_data():
    """
    Prebere PC-Axis datoteko in pripravi podatke.
    """

    parsed = pyaxis.parse(
        str(PX_FILE),
        encoding="windows-1250"
    )

    data = parsed["DATA"].copy()

    # Pretvorba statističnih vrednosti v številke
    data["DATA"] = pd.to_numeric(
        data["DATA"],
        errors="coerce"
    )

    # Pretvorba let v številke
    data["LETO"] = pd.to_numeric(
        data["LETO"],
        errors="coerce"
    )

    return data


def filter_data(
    data,
    destination="Tujina",
    age="Starost - SKUPAJ",
    trip_type="Turistična potovanja - SKUPAJ",
    measure="Potovanja (v 1000)"
):
    """
    Filtrira podatke glede na izbrane parametre.
    """

    filtered = data[
        (data["DESTINACIJA"] == destination)
        & (data["STAROST"] == age)
        & (
            data["VRSTA TURISTIČNEGA POTOVANJA"]
            == trip_type
        )
        & (data["MERITVE"] == measure)
    ].copy()

    # Odstranimo vrstice brez številskih vrednosti
    filtered = filtered.dropna(
        subset=["LETO", "DATA"]
    )

    # Razvrstimo podatke po letih
    filtered = filtered.sort_values("LETO")

    return filtered


@app.route("/")
def home():
    """
    Osnovna stran API-ja.
    """

    return jsonify({
        "application": "NBA Trip Planner",
        "module": "Tourism Statistics",
        "status": "running",
        "endpoints": [
            "/api/statistics",
            "/api/options"
        ]
    })


@app.route("/api/statistics")
def get_statistics():
    """
    Vrne filtrirane statistične podatke.
    """

    try:
        # Parametri iz URL-ja
        destination = request.args.get(
            "destination", "Tujina"
        )

        age = request.args.get(
            "age", "Starost - SKUPAJ"
        )

        trip_type = request.args.get(
            "trip_type",
            "Turistična potovanja - SKUPAJ"
        )

        measure = request.args.get(
            "measure", "Potovanja (v 1000)"
        )

        # Preberemo podatke iz PC-Axis datoteke
        data = load_data()

        # Filtriranje podatkov
        filtered = filter_data(
            data,
            destination,
            age,
            trip_type,
            measure
        )

        # Pripravimo podatke za grafikon
        results = []

        for _, row in filtered.iterrows():
            results.append({
                "year": int(row["LETO"]),
                "value": float(row["DATA"])
            })

        return jsonify({
            "destination": destination,
            "age": age,
            "trip_type": trip_type,
            "measure": measure,
            "data": results
        })

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


@app.route("/api/options")
def get_options():
    """
    Vrne možnosti za filtre na spletni strani.
    """

    try:
        data = load_data()

        return jsonify({
            "destinations": data[
                "DESTINACIJA"
            ].dropna().unique().tolist(),

            "ages": data[
                "STAROST"
            ].dropna().unique().tolist(),

            "trip_types": data[
                "VRSTA TURISTIČNEGA POTOVANJA"
            ].dropna().unique().tolist(),

            "measures": data[
                "MERITVE"
            ].dropna().unique().tolist()
        })

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


# Prikaz HTML strani s statistiko
@app.route("/statistics")
def statistics_page():
    return render_template("statistics.html")


if __name__ == "__main__":

    print("NBA TRIP PLANNER")
    print("Tourism Statistics API")
    print("Server: http://127.0.0.1:5000")

    app.run(debug=True)
