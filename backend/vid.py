from moviepy import editor as mp
import numpy as np
import click


def typing_animate(text, seconds_per_word, wait_at_the_end):
    while "  " in text:
        text = text.replace("  ", " ")
    try:
        duration = len(text.split(" ")) * seconds_per_word
        N = len(text)
        durations = np.random.uniform(1, 3, size=(N,))
        durations = durations / durations.sum() * duration 
        durations[-1] += wait_at_the_end
        videos = []
        for i in range(len(text)):
            txt_clip = mp.TextClip(text[:i+1], fontsize=50, color='white', size=(1280, 720), method='caption', align='North')
            txt_clip = txt_clip.set_pos('bottom').set_duration(durations[i]) #.set_pos('center')
            videos.append(txt_clip)
        return mp.concatenate_videoclips(videos)
    except:
        breakpoint()


def long_text_to_video(text, seconds_per_word, wait_at_the_end):
    print("Generating video for: ", text)
    for punctuation in [". ", "! ", "? ", ": ", "; "]:
        text = text.replace(punctuation, punctuation + "\n")
    text = text.split("\n")
    slides = []
    for sentence in text:
        words = sentence.split(" ")
        while len(words) > 14:
            slide, words = words[:13], words[13:]
            slides.append(" ".join(slide))
        slide = " ".join(words)
        slides.append(slide)
    
    videos = [typing_animate(slide, seconds_per_word, wait_at_the_end) for slide in slides]
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
    long_text_to_video(text, seconds_per_word, wait_at_the_end).write_videofile(output_path, fps=24)


if __name__ == "__main__":
    main()
