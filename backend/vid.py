from moviepy import editor as mp
import numpy as np
import click

slide_duration = 5
fontsize = 20
size=(500, 720)
font = "Avenir"


def typing_animate(text, seconds_per_word, wait_at_the_end, prefix=""):
    while "  " in text:
        text = text.replace("  ", " ")
    duration = len(text.split(" ")) * seconds_per_word
    N = len(text)
    durations = np.random.uniform(1, 3, size=(N,))
    durations = durations / durations.sum() * duration 
    durations[-1] += wait_at_the_end
    videos = []
    for i in range(len(text)):
        txt_clip = mp.TextClip(prefix + text[:i+1], fontsize=fontsize, color='white', size=size, method='caption', align='North', font=font)
        txt_clip = txt_clip.set_pos('bottom').set_duration(durations[i]) #.set_pos('center')
        videos.append(txt_clip)
    return mp.concatenate_videoclips(videos)



def input_video(text, seconds_per_word, wait_at_the_end):
    print("Generating video for: ", text)
    for punctuation in [". ", "! ", "? ", ": ", "; "]:
        text = text.replace(punctuation, punctuation + "\n")
    text = text.split("\n")
    slides = []
    for sentence in text:
        words = sentence.split(" ")
        while len(words) > 20:
            slide, words = words[:19], words[19:]
            slides.append(" ".join(slide))
        slide = " ".join(words)
        slides.append(slide)
    
    videos = []
    prefix = "INPUT: "
    for slide in slides:
        videos.append(typing_animate(slide, seconds_per_word, wait_at_the_end, prefix))
        prefix = ""
    return mp.concatenate_videoclips(videos)


def slideshow(text):
    print("Generating video for: ", text)
    for punctuation in [". ", "! ", "? ", ": ", "; "]:
        text = text.replace(punctuation, punctuation + "\n")
    text = text.split("\n")
    slides = []
    for sentence in text:
        words = sentence.split(" ")
        while len(words) > 20:
            slide, words = words[:19], words[19:]
            slides.append(" ".join(slide))
        slide = " ".join(words)
        slides.append(slide)
    
    videos = []
    for slide in slides:
        print("slide: ", slide)
        txt_clip = mp.TextClip(slide, fontsize=fontsize, color='white', size=size, method='caption', align='North', font=font)
        txt_clip = txt_clip.set_pos('bottom').set_duration(slide_duration) #.set_pos('center')
        videos.append(txt_clip)
    return mp.concatenate_videoclips(videos)


@click.command()
@click.argument("output_path", type=click.Path())
@click.argument("text", type=str)
@click.option("--seconds_per_word", type=float, default=0.5)
@click.option("--wait_at_the_end", type=float, default=2)
def main(output_path, text, seconds_per_word=0.5, wait_at_the_end=2):
    """Iterate through all chapter and generate media
    
    Arguments:
        story: path to the ready text file
    """
    slideshow(text).write_videofile(output_path, fps=24)


if __name__ == "__main__":
    main()

