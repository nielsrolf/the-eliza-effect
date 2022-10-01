import { Button } from "@mui/material";


function Chapters(props) {
    const {story, currentFile, setCurrentFile} = props;
    const chapterMedias = story.medias.map((media, index) => {
        return {...media, index: index}
    }).filter((file) => file.title !== "" && file.title);
    console.log("chapters", chapterMedias);
    return (
        <div style={{backgroundColor: "green"}} >
            {
                chapterMedias.map((media, chapter) => {
                    return <Button key={chapter} onClick={() => setCurrentFile(media.index)}>{media.title}</Button>
                }
            )}
        </div>
    )
}

export default Chapters;