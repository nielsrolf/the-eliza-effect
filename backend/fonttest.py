
from moviepy import editor as mp

text = "MITTLERE PERSON: Ich habe geträumt, dass ich auf einer Bühne stand und einen lila Pyjama trug."
fonts = [
    "Roboto Mono for Powerline",
    "Avenir",
    "DIN Alternate",
    "Microsoft Sans Serif"
]
for font in fonts:
    txt_clip = mp.TextClip(text, fontsize=15, color='white', size=(720, 720), method='caption', align='North', font="Avenir")
    txt_clip = txt_clip.set_pos('bottom').set_duration(5) #.set_pos('center')
    txt_clip.write_videofile(f"{font}.mp4", fps=24)