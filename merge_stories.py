import json


stories = [
    "Beginn",
    "Beginn2",
    "1KI",
    "ZS1",
    "2Nein",
    "3Marin",
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
for story_path in stories:
    with open(f"data/{story_path}/generated/medias.json", "r") as f:
        story = json.load(f)
        story[0]["title"] = story_path
        story[0]["color"] = "blue"
        merged += story

import os
os.makedirs("data//The-ELIZA-Effect", exist_ok=True)
with open(f"data/The-ELIZA-Effect/medias.json", "w") as f:
    json.dump(merged, f)