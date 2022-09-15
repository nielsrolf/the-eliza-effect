import requests


response = requests.post("http://localhost:8726/files/", json={"path": "/Users/nielswarncke/Documents/art/eliza-effect-dresden/gen_theater/output/"})
breakpoint()