import time
from pathlib import Path
import requests
from bs4 import BeautifulSoup
import json


def fetch_problems(page: int) -> list[dict]:
    url = f"https://kep.uz/practice/problems/basic-programming?page={page}"
    print(f"Fetching {url}")
    resp = requests.get(url)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    table = soup.find("section", class_="section-problems-table")
    if not table:
        print(soup)
        print("Table not found on page", page)
        return []

    problems = []
    for tr in table.select("tbody tr"):
        tds = tr.find_all("td")
        if len(tds) < 6:
            continue

        problem_id = tds[0].get_text(strip=True)
        a = tds[1].find("a")
        title = a.get_text(strip=True) if a else tds[1].get_text(strip=True)
        tags = [btn.get_text(strip=True) for btn in tds[2].find_all("button")]
        difficulty = tds[3].get_text(strip=True)
        rating_span = tds[4].find("small", class_="text-success")
        rating = rating_span.get_text(strip=True) if rating_span else ""
        attempts = tds[5].get_text(strip=True)

        problems.append(
            {
                "id": problem_id,
                "title": title,
                "tags": tags,
                "difficulty": difficulty,
                "rating": rating,
                "attempts": attempts,
            }
        )

    return problems


def download():
    d = Path().joinpath("data", "judge-problem", "kep")

    all_items = []
    for page in range(2, 3):  # 必要に応じてページ数を調整
        items = fetch_problems(page)
        for prob in items:
            print(prob)
        if not items:
            break
        all_items.extend(items)
        time.sleep(1)

    # output_file = d / "basic_programming.json"
    # with output_file.open("w", encoding="utf-8") as f:
    #     json.dump(all_items, f, ensure_ascii=False, indent=2)
    # print(f"Saved {len(all_items)} entries to {output_file}")
