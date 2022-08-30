from backend.main import *
import os



@click.command()
@click.argument("story_template", type=click.Path(exists=True))
@click.argument("story_out", type=click.Path())
def main(story_template: str, story_out: str):
    """Complete the english version of the story and translate it"""
    os.makedirs(story_out, exist_ok=True)
    for chapter in glob(f"{story_template}/*.txt"):
        target = chapter.replace(story_template, story_out).split(".txt")[0]
        template = parse_template(chapter)
        story = fill_template_gpt3(template)
        write_parts(story, target, "story_en.txt")
        story_de = translate_parts(story)
        write_parts(story_de, target, "story_de.txt")


if __name__ == "__main__":
    main()
  