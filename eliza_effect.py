#!python3

import os

print("Starting eliza effect")
# Stop app if running
os.system("kill -9 $(lsof -t -i:3000)")
os.system("kill -9 $(lsof -t -i:8726)")

# Start app
dirname = os.path.dirname(__file__)
os.system(f"cd {dirname} && python3 backend/backend.py &> logs/backend_logs &")
os.system(f"cd {dirname}/frontend && npm start &> ../logs/frontend_logs &")

# Open beamer browser
import webbrowser

url = f'file://{dirname}/beamer/index.html'

# MacOS
chrome_path = 'open -a /Applications/Google\ Chrome.app %s'

# Windows
# chrome_path = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe %s'

# Linux
# chrome_path = '/usr/bin/google-chrome %s'

webbrowser.get(chrome_path).open(url)


