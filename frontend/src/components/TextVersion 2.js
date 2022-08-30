function TextVersion(props) {
    const { story } = props;
    return (
        <div style={{width: "90%"}}>
            {
          story.medias.map((file, idx) =>
            <div key={idx}>
                <p>{file.actor} ({file.media}): {file.text}</p>
            </div>
          )
        }
        </div>
    );
}

export default TextVersion;
