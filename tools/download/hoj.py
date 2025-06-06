import time
from pathlib import Path
import requests
from bs4 import BeautifulSoup
import json


def fetch_problems(page=1):
    url = f"https://hoj.hamako-ths.ed.jp/onlinejudge/problems?page={page}"
    res = requests.get(url)
    res.raise_for_status()

    soup = BeautifulSoup(res.text, "html.parser")
    table = soup.find("table", id="head")
    rows = table.find("tbody").find_all("tr")

    problems = []

    for row in rows:
        cols = row.find_all("td")

        if len(cols) < 9:
            continue  # スキップ（念のため）

        problem_id = cols[1].text.strip()
        title_tag = cols[2].find("a")
        title = title_tag.text.strip()
        link = title_tag["href"]

        time_limit = cols[3].text.strip()
        memory_limit = cols[4].text.strip()
        point = cols[5].text.strip()

        tags = [li.text for li in cols[6].find_all("li")]
        user_count = cols[7].text.strip().replace("x ", "")

        problems.append(
            {
                "id": problem_id,
                "title": title,
                "link": link,
                "time_limit": time_limit,
                "memory_limit": memory_limit,
                "point": point,
                "tags": tags,
                "user_count": user_count,
            }
        )

    return problems


def download():
    d = Path().joinpath("data", "judge-problem", "hoj")
    for page in range(20, 34):
        problems = fetch_problems(page)
        for prob in problems:
            print(f"{prob['id']}: {prob['title']} ({prob['link']})")
            # print(prob["time_limit"], prob["memory_limit"], prob["tags"])
            p = d.joinpath(prob["id"] + ".json")
            with p.open("w") as f:
                f.write(
                    json.dumps(
                        {
                            "title": prob["title"],
                            "url": prob["link"],
                            "time_limit": prob["time_limit"],
                            "memory_limit": prob["memory_limit"],
                            "tags": prob["tags"],
                        },
                        ensure_ascii=False,
                        indent=2,
                    )
                )
            print(p.absolute())
        print("page", page)
        time.sleep(2)
