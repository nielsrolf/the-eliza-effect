from backend.main import *
import os


@click.command()
@click.argument("story", type=click.Path(exists=True))
def main(story: str, target: str = None):
    """Iterate through all chapter and generate media
    
    Arguments:
        story: path to the ready text file
    """
    if target:
        os.makedirs(target, exist_ok=True)
    story_de = parse_template(story)
    text_to_media(story_de, True, True, None)


if __name__ == "__main__":
    main()
  