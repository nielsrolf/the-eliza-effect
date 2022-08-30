# The ELIZA Effect

This repo is the software for the generative theater "The ELIZA Effect" (premiere: 2.10.2022 at Staatsschauspiel Dresden).

You can save template stories like this:
```
Context (audio): Dialogue. Kriemhild and Luzia are sitting in the desert. They have been camping out for weeks, and they have started having strange dreams. They don't know yet why it is happening , but it has started giving them nightmares about cowboys. This is what they discuss. In the middle, they start to fight. You'll never believe at the end why this is happening.
Luzia (audio): Kriemhild? Can you hear me?
Kriemhild (audio): Yes, I can hear you. What's wrong?
Stage directions (video): This will be rendered as a video and played outside the browser.
Marin (audio): The next part of the story will be completed by GPT-3
Luzia (audio): <generate>
```
in the `data/` folder. Once you start the frontend, you can generate the completion, German translation and media files in one step. Generated stories can be edited in the frontend and played - if you setup your Midi and audio devices correctly, the audios will be routed to different channels for the headphones of the respective actors. The actors then perform the story that GPT completed live.

## Development


```sh
# Install dependencies
pip install -e ".[test]"

# Install pre-commit hooks
brew install pre-commit
pre-commit install -t pre-commit
cp .env.example .env
```

and run the server:
```
python gen_theater/backend.py &
cd frontend && npm start
```

# Setting up the secon screen
[here](https://apple.stackexchange.com/questions/161701/how-can-i-force-an-application-to-be-launched-to-the-2nd-monitor#:~:text=Make%20any%20application%20start%20on%20the%20other%20monitor%3A&text=Go%20to%20System%20Preferences%20%2D%3E%20Displays,iterm2%20and%20chrome%20browser%20does.)