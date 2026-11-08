# NBA Trip Planner

Spletna aplikacija za načrtovanje obiskov NBA tekem. Trenutno sta izdelani strani **Home** in **AI Guide** z Gemini; drugi API-ji bodo povezani pozneje.

## Opravljene naloge

| Naloga          | Vsebina                                                                                                            | Datoteke                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| 0 – Zasnova     | Ideja projekta in predvidene storitve.                                                                             | `docs/`                                                  |
| 1 – XML in JSON | Povezovanje ekip, dvoran in tekem prek ID-jev, filtriranje po mestu ter izvoz v JSON in XML.                       | `main.py`, `data/*.xml`                                  |
| 2 – Web parser  | Pridobivanje podatkov o NBA dvoranah s strani [HomeAway](https://homeaway.app/sport/nba/) in shranjevanje v JSON.  | `scraper/arena_parser.py`, `data/nba_arenas.json`        |
| 3 – PC-Axis     | Obdelava turističnih podatkov [SURS](https://podatki.gov.si/dataset/surs2170202s), Flask API in grafikon s filtri. | `statistics/pcaxis_parser.py`, `data/tourisam.PX`        |
| 4 – LLM         | **Zaključena:** Gemini, dinamični prompt in strukturiran JSON odgovor s Python razredom.                           | `backend/llm.py`, `frontend/src/components/ai-guide.tsx` |

## Struktura

```text
backend/             # Flask API in Gemini integracija
frontend/            # React, TypeScript, Home in AI Guide
data/                # XML, JSON in PC-Axis podatki prejšnjih nalog
scraper/             # Web parser za dvorane
statistics/          # Obdelava statističnih podatkov
templates/, static/  # Vmesnik statistične naloge
docs/                # Zasnova projekta
main.py              # Konzolna XML aplikacija
docker-compose.yml   # Zagon frontend in backend servisov
```

## Zagon spletne aplikacije

````
```bash
docker compose up --build
````

Odpri [http://localhost:5173](http://localhost:5173). Po spremembi ključa uporabi `docker compose restart backend`; za ustavitev `docker compose down`.

## Naloga 4

AI Guide sestavi prompt iz uporabnikovega vprašanja, izbrane ekipe, mesta, datuma in jezika. Gemini vrne JSON s polji `summary`, `facts` in `recommendations`. Python razred `GuideResponse` odgovor deserializira in preveri, React pa posamezna polja prikaže na strani.

JSON lahko preveriš v brskalniku: **F12 → Network → chat → Response**. API naslova sta `GET /api/health` in `POST /api/chat`.

Home nima vzorčnih tekem ali ekip. Games, Teams in My Trip so za zdaj samo neaktivne postavke v glavi. Živi NBA podatki, vreme, poti in povezovanje prejšnjih nalog s spletnim vmesnikom sledijo pozneje.

## Zagon prejšnjih nalog

Potreben je Python 3. Za parser in statistiko namesti knjižnice:

```bash
python -m pip install requests beautifulsoup4 flask pandas pyaxis
```

| Naloga     | Ukaz iz glavne mape                  |
| ---------- | ------------------------------------ |
| XML        | `python main.py`                     |
| Web parser | `python scraper/arena_parser.py`     |
| Statistika | `python statistics/pcaxis_parser.py` |

XML aplikacija ustvari `filtrirano.json` in `filtrirano.xml`. Za statistiko prej ustavi Docker aplikacijo, ker obe uporabljata port 5000; stran je na [http://localhost:5000/statistics](http://localhost:5000/statistics).
