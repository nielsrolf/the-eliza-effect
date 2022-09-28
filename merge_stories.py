import json


stories = [
    "short",
    "tutorial"
]

merged = []
for story_path in stories:
    with open(f"data/{story_path}/generated/medias.json", "r") as f:
        story = json.load(f)
        story[0]["title"] = story_path
        story[0]["color"] = "blue"
        merged += story

for part in merged:
    if part["media"] != "extern":
        part["src"] = ""


import os
os.makedirs("data//The-ELIZA-Effect", exist_ok=True)
with open(f"data/The-ELIZA-Effect/medias.json", "w") as f:
    json.dump(merged, f)