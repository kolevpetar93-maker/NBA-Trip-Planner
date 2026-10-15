from pathlib import Path
import json
import xml.etree.ElementTree as ET

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / 'data'


def load_entities(filename, tag):
    root = ET.parse(DATA_DIR / filename).getroot()
    entities = {}
    for element in root.findall(tag):
        entity_id = element.get('id')
        if not entity_id or entity_id in entities:
            raise ValueError(
                f'Missing or duplicate ID in {filename}: {entity_id}')
        record = {'id': entity_id}
        for child in element:
            record[child.tag] = (child.text or '').strip()
        entities[entity_id] = record
    return entities


def combine_games(teams, arenas, games):
    combined = []
    for game in games.values():
        home_id = game['domacaEkipaId']
        away_id = game['gostujocaEkipaId']
        arena_id = game['dvoranaId']
        if home_id not in teams or away_id not in teams or arena_id not in arenas:
            raise ValueError(
                f"Game {game['id']} references a missing team or arena")
        arena = arenas[arena_id]
        combined.append({
            'id': game['id'],
            'datum': game['datum'],
            'vreme': game['vreme'],
            'domacaEkipa': teams[home_id]['ime'],
            'gostujocaEkipa': teams[away_id]['ime'],
            'dvorana': arena['ime'],
            'mesto': arena['mesto'],
            'status': game['status'],
            'rezultat': game.get('rezultat', ''),
        })
    return combined


def print_games(games):
    if not games:
        print('Ni najdenih tekem za izbrano mesto.')
        return
    print(f"{'ID':<7} {'Datum':<12} {'Domača ekipa':<25} {'Gostujoča ekipa':<25} {'Dvorana'}")
    print('-' * 100)
    for game in games:
        print(
            f"{game['id']:<7} {game['datum']:<12} {game['domacaEkipa']:<25} {game['gostujocaEkipa']:<25} {game['dvorana']}")


def export_json(games):
    with (BASE_DIR / 'filtrirano.json').open('w', encoding='utf-8') as file:
        json.dump(games, file, ensure_ascii=False, indent=4)


def export_xml(games):
    root = ET.Element('filtriraneTekme')
    for game in games:
        element = ET.SubElement(root, 'tekma', {'id': game['id']})
        for key, value in game.items():
            if key != 'id':
                ET.SubElement(element, key).text = value
    tree = ET.ElementTree(root)
    ET.indent(tree, space='    ')
    tree.write(BASE_DIR / 'filtrirano.xml',
               encoding='utf-8', xml_declaration=True)


def main():
    try:
        teams = load_entities('ekipe.xml', 'ekipa')
        arenas = load_entities('dvorane.xml', 'dvorana')
        games = load_entities('tekme.xml', 'tekma')
        combined = combine_games(teams, arenas, games)
    except (FileNotFoundError, ET.ParseError, KeyError, ValueError) as error:
        print(f'Napaka pri branju podatkov: {error}')
        return

    print('NBA TRIP PLANNER - FILTRIRANJE TEKEM')
    while True:
        print('\n--- MENI ---')
        print('1 - Filtriraj tekme po mestu')
        print('2 - Prikaži vse tekme')
        print('0 - Izhod')
        choice = input('Izberite možnost (0/1/2): ').strip()

        if choice == '0':
            print('Program se je zaključil.')
            break
        elif choice == '1':
            print('Razpoložljiva mesta:', ', '.join(
                sorted({game['mesto'] for game in combined})))
            city = input('Vnesite mesto: ').strip()
            if not city:
                print('Vnesite ime mesta ali izberite možnost 2 za vse tekme.')
                continue
            filtered = [
                game for game in combined if game['mesto'].casefold() == city.casefold()]
        elif choice == '2':
            filtered = combined
        else:
            print('Neveljavna izbira. Poskusite znova.')
            continue

        print_games(filtered)
        export_json(filtered)
        export_xml(filtered)
        print(f'\nNajdenih tekem: {len(filtered)}')
        print('Rezultati so shranjeni v filtrirano.json in filtrirano.xml.')


if __name__ == '__main__':
    main()
