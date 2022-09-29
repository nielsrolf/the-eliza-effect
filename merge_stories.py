import json


stories = [
    "Beginn",
    "Beginn2",
    "1KI/2.KI.txt",
    "ZS1",
    "2Nein",
    "3Marin/3Marin",
    "4Was-ist",
    "5The-Lila",
    "5The-Lila2",
    "6Rache",
    "7Wir-arbeiten",
    "ZS2",
    "8Schwestern",
    "9Aufe",
    "10KI-ist-verletzt",
    "ZS3"]

merged = []
import os
for story_path in stories:
    path = f"data/{story_path}/generated/medias.json"
    if not os.path.exists(path):
        path = f"data/{story_path}/medias.json"
    with open(path, "r") as f:
        story = json.load(f)
        story[0]["title"] = story_path
        story[0]["color"] = "blue"
        merged += story
for part in merged:
    if part["media"] != "extern":
        part["src"] = None

import os
os.makedirs("data//The-ELIZA-Effect", exist_ok=True)
with open(f"data/The-ELIZA-Effect/medias.json", "w") as f:
    json.dump(merged, f)
