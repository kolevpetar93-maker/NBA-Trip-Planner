# NBA Trip Planner – XML, JSON, Web Parser in PC-Axis

## 1. Opis projekta

NBA Trip Planner je konzolna aplikacija, razvita v programskem jeziku Python, ki omogoča pregled in filtriranje NBA tekem glede na mesto njihovega izvajanja.

Namen projekta je prikazati delo s strukturiranimi podatki XML, povezovanje različnih entitet prek identifikatorjev (ID), deserializacijo podatkov ter izvoz filtriranih rezultatov v formata JSON in XML.

Projekt vključuje tudi spletni razčlenjevalnik (Web Parser), ki samodejno pridobiva podatke o NBA dvoranah s spletne strani HomeAway in jih shranjuje v datoteko JSON.

Projekt sem dodatno razširil z uporabo odprtih statističnih podatkov v formatu PC-Axis ter spletno vizualizacijo turističnih podatkov z uporabo Flask, HTML, CSS, JavaScript in Chart.js.

Podatki o tekmah so demonstracijski in ne predstavljajo uradnega razporeda NBA tekem.

## 2. Struktura projekta

```text
NBA Planner Trip/
├── data/
│   ├── ekipe.xml
│   ├── dvorane.xml
│   ├── tekme.xml
│   ├── nba_arenas.json
│   └── tourisam.PX
├── docs/
├── scraper/
│   └── arena_parser.py
├── statistics/
│   └── pcaxis_parser.py
├── templates/
│   └── statistics.html
├── static/
│   ├── css/
│   │   └── statistics.css
│   └── js/
│       └── statistics.js
├── main.py
├── filtrirano.json
├── filtrirano.xml
└── README.md
```

## 3. Opis XML datotek

Projekt vsebuje tri povezane XML datoteke, vsaka s 15 zapisi.

**ekipe.xml**

Vsebuje podatke o NBA ekipah. Vsaka ekipa ima unikaten atribut `id` ter podatke o imenu, kratici, mestu in konferenci.

**dvorane.xml**

Vsebuje podatke o športnih dvoranah. Vsaka dvorana ima unikaten atribut `id`, ime, mesto, naslov, kapaciteto in geografske koordinate.

**tekme.xml**

Vsebuje podatke o NBA tekmah. Vsaka tekma ima unikaten atribut `id`, datum, čas, status in rezultat. Povezave z drugimi datotekami so določene z elementi:

- `domacaEkipaId` – identifikator domače ekipe.
- `gostujocaEkipaId` – identifikator gostujoče ekipe.
- `dvoranaId` – identifikator dvorane.

Element `rezultat` je prazen, kar predstavlja primer manjkajoče vrednosti.

## 4. Funkcionalnosti aplikacije

Aplikacija omogoča branje vseh treh XML datotek, deserializacijo podatkov v Pythonove slovarje in povezovanje ekip, dvoran ter tekem prek ID-jev.

Uporabniku je na voljo interaktivni meni s tremi možnostmi:

| Možnost                          | Funkcionalnost                                                            |
| -------------------------------- | ------------------------------------------------------------------------- |
| **1 – Filtriraj tekme po mestu** | Uporabnik vnese mesto, aplikacija pa prikaže samo tekme v izbranem mestu. |
| **2 – Prikaži vse tekme**        | Aplikacija prikaže vseh 15 tekem, ne glede na mesto.                      |
| **0 – Izhod**                    | Zaključi izvajanje programa.                                              |

Po izbiri možnosti 1 ali 2 se rezultati izpišejo v konzoli in samodejno izvozijo v datoteki `filtrirano.json` in `filtrirano.xml`.

Meni omogoča večkratno izvajanje različnih poizvedb brez ponovnega zagona programa.

## 5. Zagon aplikacije

Za izvajanje je potreben Python 3. Za konzolno aplikacijo dodatne knjižnice niso potrebne, saj uporablja standardni knjižnici `json` in `xml.etree.ElementTree`.

V terminalu odpremo glavno mapo projekta in izvedemo:

```bash
python main.py
```

Ob zagonu se prikaže meni:

```text
--- MENI ---
1 - Filtriraj tekme po mestu
2 - Prikaži vse tekme
0 - Izhod

Izberite možnost (0/1/2):
```

## 6. Primeri uporabe

### Primer 1 – Prikaz vseh tekem

Uporabnik izbere možnost `2`.

Aplikacija prikaže vseh 15 tekem v pregledni tabeli z ID-jem, datumom, domačo ekipo, gostujočo ekipo in dvorano.

```text
Izberite možnost (0/1/2): 2

ID      Datum        Domača ekipa              Gostujoča ekipa           Dvorana
1001    2026-10-22   Los Angeles Lakers        Golden State Warriors    Crypto.com Arena
1002    2026-10-23   Boston Celtics            New York Knicks          TD Garden
...

Najdenih tekem: 15
```

### Primer 2 – Filtriranje tekem po mestu

Uporabnik izbere možnost `1` in vnese `Boston`.

```text
Izberite možnost (0/1/2): 1
Vnesite mesto: Boston

ID      Datum        Domača ekipa              Gostujoča ekipa           Dvorana
1002    2026-10-23   Boston Celtics            New York Knicks          TD Garden

Najdenih tekem: 1
Rezultati so shranjeni v filtrirano.json in filtrirano.xml.
```

Aplikacija nato ponovno prikaže meni, kjer lahko uporabnik izbere novo možnost.

### Primer 3 – Izhod iz programa

Uporabnik izbere možnost `0`.

```text
Izberite možnost (0/1/2): 0
Program se je zaključil.
```

## 7. Izvoz podatkov

**filtrirano.json**

Vsebuje seznam objektov s podatki o tekmah, ki ustrezajo zadnji izbiri uporabnika.

**filtrirano.xml**

Vsebuje iste rezultate v obliki XML, s korenskim elementom `filtriraneTekme` in posameznimi elementi `tekma`.

Ob vsaki novi izbiri možnosti 1 ali 2 se obe izhodni datoteki posodobita. Tako vedno vsebujeta rezultate zadnje poizvedbe.

## 8. Namen naloge

Projekt prikazuje uporabo XML dokumentov za shranjevanje strukturiranih podatkov, povezovanje entitet prek identifikatorjev, deserializacijo v Pythonove podatkovne strukture, filtriranje ter izvoz rezultatov v JSON in XML.

Dodatno vključuje samodejno pridobivanje podatkov s spletnih strani in njihovo shranjevanje za nadaljnjo uporabo.

## 9. Spletni razčlenjevalnik (Web Parser)

Projekt vključuje spletni razčlenjevalnik, razvit v programskem jeziku Python, ki samodejno pridobiva podatke o NBA dvoranah.

Za vir podatkov je bila izbrana spletna stran **HomeAway – NBA Arenas**:

https://homeaway.app/sport/nba/

Spletna stran vsebuje podatke o 30 NBA dvoranah. Izbrana je bila, ker so informacije neposredno povezane s projektom NBA Trip Planner in bodo uporabne pri nadaljnjem razvoju aplikacije.

Razčlenjevalnik uporablja knjižnici `requests` za pridobivanje vsebine spletne strani in `BeautifulSoup` za razčlenjevanje dokumenta HTML.

Program poišče kartice posameznih dvoran in iz njih pridobi naslednje podatke:

- Ime dvorane.
- NBA ekipo.
- Leto odprtja.
- Kapaciteto.
- Povezavo do podrobnejših informacij.

Pridobljeni podatki se samodejno shranijo v datoteko `data/nba_arenas.json`.

### Primer pridobljenih podatkov

```json
{
  "arena": "Madison Square Garden",
  "team": "New York Knicks",
  "opened": 1968,
  "capacity": 19812,
  "url": "https://homeaway.app/stadiums/madison-square-garden-nba/"
}
```

### Zagon razčlenjevalnika

Najprej namestimo potrebni knjižnici:

```bash
python -m pip install requests beautifulsoup4
```

Nato v glavni mapi projekta izvedemo:

```bash
python scraper/arena_parser.py
```

Program samodejno prebere spletno stran, pridobi podatke o NBA dvoranah in jih shrani v datoteko `nba_arenas.json`.

Če datoteka še ne obstaja, jo program samodejno ustvari. Ob ponovnem zagonu razčlenjevalnik ponovno pridobi podatke in posodobi datoteko.

Spletni razčlenjevalnik je uspešno pridobil podatke o vseh **30 NBA dvoranah**, ki so shranjeni v strukturiranem formatu JSON.

## 10. Odprti podatki in PC-Axis

V okviru tretje naloge sem projekt NBA Trip Planner razširil z uporabo odprtih statističnih podatkov v formatu PC-Axis in njihovo grafično vizualizacijo.

Za vir podatkov sem izbral podatkovno zbirko **Turistična potovanja po destinaciji potovanja in po starosti turistov, Slovenija, letno**, ki jo objavlja Statistični urad Republike Slovenije (SURS) in je dostopna na portalu Odprti podatki Slovenije (OPSI).

Vir podatkov: https://podatki.gov.si/dataset/surs2170202s

Podatkovno zbirko sem izbral, ker je povezana s področjem potovanj, ki predstavlja pomemben del projekta NBA Trip Planner. Statistični podatki omogočajo pregled turističnih trendov, predvsem potovanj v tujino, ne predstavljajo pa neposredno podatkov o potovanjih na NBA tekme.

### 10.1. PC-Axis podatkovna datoteka

Podatke sem prenesel v formatu PC-Axis (.PX) in jih shranil v datoteko `data/tourisam.PX`.

Datoteka vsebuje **4200 statističnih zapisov** za obdobje od leta 2012 do 2025.

Podatki so razdeljeni glede na naslednje spremenljivke:

- Vrsta turističnega potovanja.
- Destinacija (Slovenija, tujina, skupaj).
- Starostna skupina turistov.
- Statistična meritev.
- Leto.

Na voljo so podatki o številu turističnih potovanj, številu prenočitev, povprečnem številu prenočitev in povprečnih izdatkih na turista na prenočitev.

### 10.2. Obdelava podatkov

Za branje in obdelavo PC-Axis datoteke sem uporabil programski jezik Python ter knjižnici `pyaxis` in `pandas`.

Program se nahaja v datoteki:

`statistics/pcaxis_parser.py`

Knjižnica `pyaxis` omogoča branje in razčlenjevanje PC-Axis datoteke, medtem ko knjižnico `pandas` uporabljam za pretvorbo podatkov v številske vrednosti, filtriranje in razvrščanje po letih.

Pri branju datoteke uporabljam kodiranje `windows-1250`, ki omogoča pravilno obdelavo slovenskih znakov.

Podatki se ob posamezni zahtevi preberejo neposredno iz PC-Axis datoteke, zato ni potrebno ustvarjanje dodatne JSON datoteke.

### 10.3. Flask API

Za povezavo med Pythonom in spletno stranjo sem uporabil spletno ogrodje **Flask**.

Aplikacija omogoča naslednje naslove:

| Naslov            | Funkcionalnost                                 |
| ----------------- | ---------------------------------------------- |
| `/`               | Osnovne informacije o aplikaciji               |
| `/statistics`     | Prikaz spletne strani s statistiko             |
| `/api/options`    | Pridobivanje razpoložljivih možnosti za filtre |
| `/api/statistics` | Pridobivanje filtriranih statističnih podatkov |

Flask API vrne podatke v formatu JSON, ki jih JavaScript uporabi za prikaz grafikona.

### 10.4. Grafična vizualizacija podatkov

Za prikaz statističnih podatkov sem izdelal spletno stran **Travel Statistics Dashboard**.

Pri razvoju sem uporabil naslednje tehnologije:

- **HTML** – struktura spletne strani.
- **CSS** – oblikovanje spletne strani in prilagoditev različnim velikostim zaslona.
- **JavaScript** – komunikacija s Flask API in upravljanje filtrov.
- **Chart.js** – grafična vizualizacija statističnih podatkov.

Spletna stran vsebuje interaktivni linijski grafikon, ki prikazuje statistične vrednosti turističnih potovanj po letih.

Uporabnik lahko podatke filtrira glede na:

- Destinacijo potovanja.
- Starostno skupino turistov.
- Vrsto turističnega potovanja.
- Statistično meritev.

Ob spremembi posameznega filtra JavaScript pošlje novo zahtevo Flask API-ju. Python ponovno prebere in filtrira podatke iz PC-Axis datoteke ter vrne ustrezne rezultate.

Grafikon se nato samodejno posodobi brez ponovnega nalaganja celotne spletne strani.

### 10.5. Dinamično pridobivanje podatkov

Podatki se dinamično pridobivajo prek Flask API-ja.

Ob odprtju spletne strani JavaScript najprej pošlje zahtevo na `/api/options`, kjer pridobi razpoložljive vrednosti za filtre.

Nato pošlje zahtevo na `/api/statistics`, kjer pridobi filtrirane statistične podatke.

Začetne nastavitve filtrov so:

- Destinacija: `Tujina`.
- Starost: `Starost - SKUPAJ`.
- Vrsta potovanja: `Turistična potovanja - SKUPAJ`.
- Meritev: `Potovanja (v 1000)`.

Na podlagi pridobljenih podatkov se ustvari grafikon s knjižnico Chart.js.

### 10.6. Zagon spletne aplikacije

Za izvajanje spletne aplikacije je potreben Python 3 in naslednje knjižnice:

```bash
python -m pip install flask pyaxis pandas
```

V terminalu odpremo glavno mapo projekta in izvedemo:

```bash
python statistics/pcaxis_parser.py
```

Ob uspešnem zagonu se prikaže:

```text
NBA TRIP PLANNER
Tourism Statistics API
Server: http://127.0.0.1:5000

 * Running on http://127.0.0.1:5000
```

Spletno stran odpremo v brskalniku na naslovu:

http://127.0.0.1:5000/statistics

Na strani se prikažejo filtri in linijski grafikon turističnih potovanj.

### 10.7. Preverjanje delovanja

Delovanje aplikacije sem preveril z zagonom Flask strežnika in odpiranjem spletne strani v brskalniku.

Uspešno sem preveril:

- Branje PC-Axis datoteke.
- Obdelavo podatkov s knjižnicama `pyaxis` in `pandas`.
- Pridobivanje statističnih podatkov prek Flask API-ja.
- Pravilno nalaganje HTML, CSS in JavaScript datotek.
- Prikaz interaktivnega grafikona s Chart.js.
- Filtriranje po destinaciji, starostni skupini, vrsti potovanja in statistični meritvi.
- Samodejno posodabljanje grafikona ob spremembi filtrov.

Vse preverjene API zahteve so bile uspešno izvedene s statusno kodo HTTP `200`.

Preveril sem tudi delovanje filtrov in potrdil, da se grafikon pravilno spreminja glede na izbrane vrednosti.

### 10.8. Namen naloge

Namen tretje naloge je prikazati uporabo odprtih statističnih podatkov v formatu PC-Axis, njihovo obdelavo, filtriranje in grafično predstavitev v spletni aplikaciji.

Z uporabo Pythona, Flask API-ja in Chart.js sem izdelal funkcionalen modul **Travel Statistics**, ki predstavlja dodatno funkcionalnost projekta NBA Trip Planner.

Izdelani modul omogoča pregled turističnih trendov in predstavlja osnovo za nadaljnji razvoj ter povezovanje različnih funkcionalnosti v končni spletni aplikaciji.
