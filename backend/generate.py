from backend.main import *
import os


@click.command()
@click.argument("story", type=click.Path(exists=True))
def main(story: str):
    """Iterate through all chapter and generate media
    
    Arguments:
        story: path to the ready text file
    """
    target = os.path.dirname(story)
    story_de = parse_template(story)
    text_to_media(story_de, play=False, generate_all=True, target=target)


if __name__ == "__main__":
    main()
  