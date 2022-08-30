import requests


response = requests.post("http://localhost:5000/open", json={"path": "./data/cowboy_dream.txt", "language": "en"})

data = response.json()

response = requests.post("http://localhost:5000/generate", json=data)
breakpoint()