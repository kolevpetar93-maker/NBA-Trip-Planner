# NBA Trip Planner – XML, JSON in Web Parser

## 1. Opis projekta

NBA Trip Planner je konzolna aplikacija, razvita v programskem jeziku Python, ki omogoča pregled in filtriranje NBA tekem glede na mesto njihovega izvajanja.

Namen projekta je prikazati delo s strukturiranimi podatki XML, povezovanje različnih entitet prek identifikatorjev (ID), deserializacijo podatkov ter izvoz filtriranih rezultatov v formata JSON in XML.

Projekt vključuje tudi spletni razčlenjevalnik (Web Parser), ki samodejno pridobiva podatke o NBA dvoranah s spletne strani HomeAway in jih shranjuje v datoteko JSON.

Podatki o tekmah so demonstracijski in ne predstavljajo uradnega razporeda NBA tekem.

## 2. Struktura projekta

```text
NBA Planner Trip/
├── data/
│   ├── ekipe.xml
│   ├── dvorane.xml
│   ├── tekme.xml
│   └── nba_arenas.json
├── scraper/
│   └── arena_parser.py
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
