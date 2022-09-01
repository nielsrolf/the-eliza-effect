import os

import openai
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import dataclasses
from typing import List, Dict, Tuple
from main import *
from glob2 import glob
import json
from fastapi.staticfiles import StaticFiles



load_dotenv()
openai.api_key = os.getenv("OPENAI_ACCESS_KEY")


app = FastAPI()

app.mount("/assets/data", StaticFiles(directory="data"), name="data")


class Story(BaseModel):
    path: str
    language: str = "en"
    medias: List[Dict] = None


class Video(BaseModel):
    path: str


origins = [
    "http://localhost:*",
    "http://localhost:3000",
    "https://pollinations.ai",
    "https://*.pollinations.ai",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"healthy": "yes"}


@app.post("/open")
def load_story(story: Story):
    if story.medias is None and story.path.endswith(".txt"):
        parts = parse_template(story.path)
        story = Story(
            path=story.path,
            medias = [dataclasses.asdict(i) for i in parts],
        )
    elif story.path.endswith(".json"):
        with open(story.path) as f:
            story.medias = json.load(f)
    return story




@app.post("/generate")
async def generate(template: Story) -> Story:
    """
    Generate a story from a template.
    """
    target = ".".join(template.path.split(".")[:-1]) + "/generated"
    os.makedirs(target, exist_ok=True)
    #if template.language != "en":
    #    story = en_to_de(story)
    #story_en = fill_template_gpt3([Part(**i) for i in template.medias])
    #story_de = translate_parts(story_en)
    story_de = text_to_media([Part(**i) for i in template.medias], target=target)
    story_de = Story(path=template.path, medias=[i.__dict__ for i in story_de], language="de")
    return story_de


@app.post("/save")
async def save(template: Story) -> Story:
    """
    Save a story and generate missing medias.
    """
    parts = [Part(**i) for i in template.medias]
    if template.path.endswith("medias.json"):
        target = "/".join(template.path.split("/")[:-1])
    else:
        target = ".".join(template.path.split(".")[:-1]) + "/generated"
    
    # if template.language != "de":
    #     parts = translate_parts(parts)
    story_de = text_to_media(parts, target=target)
    story_de = Story(path=target + "/medias.json", medias=[i.__dict__ for i in story_de])
    return story_de


def en_to_de(story):
    pass


def de_to_en(story):
    pass


@app.post("/play")
async def play(video: Video):
    os.system(f"ffplay -fs -autoexit '{video.path}'")
    return "OK"


@app.get("/available")
async def available():
    files = glob(f"data/*.txt") + glob(f"data/**/medias.json")
    return files


def main():
    """
    Run the server.
    """
    uvicorn.run(app, host="0.0.0.0", port=5000)


if __name__ == "__main__":
    main()
