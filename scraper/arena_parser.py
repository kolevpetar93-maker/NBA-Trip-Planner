
import json
import re
from pathlib import Path

import requests
from bs4 import BeautifulSoup


# Web-stranicata od koja ke gi izvlekuvame podatocite
URL = "https://homeaway.app/sport/nba/"

# Ja odreduvame lokacijata kade sto ke se zacuva JSON datotekata
BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_FILE = BASE_DIR / "data" / "nba_arenas.json"

# HTTP zaglavie za identifikacija na nasata programa
HEADERS = {
    "User-Agent": "NBA-Trip-Planner-Student-Project/1.0"
}


def clean_text(text):
    # Gi otstranuva nepotrebnite prazni mesta od tekstot
    return re.sub(r"\s+", " ", text).strip()


def get_page():
    # Isprakame HTTP GET baranje do web-stranicata
    response = requests.get(
        URL,
        headers=HEADERS,
        timeout=20
    )

    # Proveruvame dali baranjeto e uspesno
    response.raise_for_status()

    # HTML sodrzinata ja pretvorame vo BeautifulSoup objekt
    return BeautifulSoup(response.text, "html.parser")


def extract_arenas(soup):
    # Lista vo koja ke gi cuvame site NBA areni
    arenas = []

    # Gi pronajduvame kartickite za arenite
    cards = soup.select("#stadium-grid a.archive-stadium-card")

    print(f"Najdenih kartic aren: {len(cards)}")

    # Ja obrabotuvame sekoja karticka posebno
    for card in cards:

        # Ime na arenata i NBA timot
        arena_name = card.get("data-name")
        team_name = card.get("data-team")

        # Link do detalnata stranica na arenata
        arena_url = card.get("href")

        # Go citame tekstot od kartickata
        card_text = card.get_text(" ", strip=True)

        # Gi izvlekuvame godinata i kapacitetot
        opened_match = re.search(
            r"Opened\s+(\d{4})",
            card_text,
            re.IGNORECASE
        )

        capacity_match = re.search(
            r"Capacity\s+([\d,]+)",
            card_text,
            re.IGNORECASE
        )

        opened = (
            int(opened_match.group(1))
            if opened_match else None
        )

        capacity = (
            int(capacity_match.group(1).replace(",", ""))
            if capacity_match else None
        )

        # Gi organizirame podatocite za arenata
        arena = {
            "arena": arena_name,
            "team": team_name,
            "opened": opened,
            "capacity": capacity,
            "url": arena_url
        }

        arenas.append(arena)

    return arenas


def save_json(arenas):
    # Ako folderot data ne postoi, avtomatski go kreirame
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    # Gi zacuvuvame podatocite vo JSON format
    with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
        json.dump(
            arenas,
            file,
            indent=4,
            ensure_ascii=False
        )

    print(f"Datoteka JSON je bila uspešno shranjena: {OUTPUT_FILE}")


def main():
    # Pocetna poraka pri startuvanje na parserot
    print("Začenjam pridobivanje podatkov s spletne strani HomeAway...")

    try:
        # Ja prezemame HTML sodrzinata
        soup = get_page()

        print("Spletna stran je bila uspešno prebrana.")

        # Gi izvlekuvame podatocite za NBA arenite
        arenas = extract_arenas(soup)

        # Ako ne se pronajdeni podatoci, ja prekinuvame programata
        if not arenas:
            print(
                "Podatkov o arenah ni bilo mogoče najti v tabelah HTML. "
                "Preveriti je treba strukturo spletne strani HomeAway."
            )
            return

        # Gi zacuvuvame izvlecenite podatoci vo JSON
        save_json(arenas)

        # Go prikazuvame brojot na pronajdeni areni
        print(f"Uspešno pridobljenih aren: {len(arenas)}")

        # Gi prikazuvame iminjata na site pronajdeni areni
        for arena in arenas:
            print(f"- {arena['arena']}")

    # Obrabotka na greski pri HTTP baranje
    except requests.RequestException as error:
        print(f"Napaka pri branju spletne strani: {error}")

    # Obrabotka na drugi neocekuvani greski
    except Exception as error:
        print(f"Prišlo je do napake: {error}")


# Programata se startuva samo koga direktno go izvrsuvame ovoj fajl
if __name__ == "__main__":
    main()
