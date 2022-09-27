import os

# Start app
dirname = os.path.dirname(__file__)
cmd = f'\\"python3 {dirname}/eliza_effect.py\\"'
alias = f"alias eliza='{cmd}'"
os.system(f"echo '\n{alias}' >> ~/.bashrc")
os.system(f"echo '\n{alias}' >> ~/.zshrc")