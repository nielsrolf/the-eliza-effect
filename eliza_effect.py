#!python3

import os
import time

def system(cmd):
    print(f"os: {cmd}")
    return os.system(cmd)


print("Starting eliza effect")
# Stop app if running
system("kill -9 $(lsof -t -i:3000)")
system("kill -9 $(lsof -t -i:8726)")


# Start app
dirname = os.path.dirname(__file__)
t = str(int(time.time()))
system(f"cd \"{dirname}\" && git pull")
# system(f"cd \"{dirname}\" && python3 backend/backend.py &> logs/{t}_backend &")
# system(f"cd \"{dirname}/frontend\" && npm start &> ../logs/{t}_frontend &")

# Open beamer browser
import webbrowser

dirname = dirname.replace(" ", "%20")
url = f'file://{dirname}/beamer/index.html'

# MacOS
chrome_path = 'open -a /Applications/Google\ Chrome.app %s'

# Windows
# chrome_path = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe %s'

# Linux
# chrome_path = '/usr/bin/google-chrome %s'

webbrowser.get(chrome_path).open(url)


