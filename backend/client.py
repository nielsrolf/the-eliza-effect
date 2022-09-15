import requests


response = requests.post("http://localhost:8726/open", json={"path": "./data/cowboy_dream.txt", "language": "en"})

data = response.json()

response = requests.post("http://localhost:8726/generate", json=data)
breakpoint()