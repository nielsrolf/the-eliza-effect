import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import Switch from "../components/Switch";
import { useMIDIOutput } from "../hooks/useMidiOutput";

// 0 db
const MAX_VOLUME = 104;


const outputs = {
  "Luzia": 100,
  "Marin": 106,
  "Kriemhild": 106,
  "Alle": 106,
  "Room": 106
}


const AudioScreen = props => {
    let { story, setStory, midiOutput } = props;

    const placeholder = { src: "", text: "", output: 0, media: "none", actor: "", raw: "", output: "" };
    let files = story.medias.length > 0 ? story.medias : [placeholder];
  
    const { cc } = useMIDIOutput(midiOutput);
    const [ selectedOutput, setSelectedOutput ] = useState({ name: 'default' });
  
    const [ currentFile_, setCurrentFile ] = useState(0);
    const [ AutoPlay, setAutoPlay ] = useState(0)
    const currentFile = currentFile_ > files.length - 1 ? 0 : currentFile_;

    const playVideo = async (src) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({path: src})
      };
      const response = await fetch(`http://localhost:8726/play/`, requestOptions).then(res => {
        handleNext();
      }).catch(err => {
        console.log(err);
      });
    }
    
    useEffect(()=>{
      
      const AudioElement = document.getElementById('track01');
      
      function handleOutputChange(channel){
        console.log("output changed to: ", channel);
        if (!channel) return;
        
        if (selectedOutput) {
          cc(0, selectedOutput, 9);
          cc(0, selectedOutput + 1, 9);
          setSelectedOutput(channel);
          cc(MAX_VOLUME, channel, 9);
          cc(MAX_VOLUME, channel + 1, 9);
        };
        // console.log(channel)
        setSelectedOutput(channel);
        cc(MAX_VOLUME, channel, 9);
        cc(MAX_VOLUME, channel + 1, 9);
      }
      
      if(files[currentFile].src){
        handleOutputChange(outputs[files[currentFile].actor])
        document.getElementById(files[currentFile]?.src).scrollIntoView({behavior: "smooth", block: "center"});
        if (!AutoPlay) return;
        if(files[currentFile].media==='audio'){
          AudioElement.play();
        } else if(files[currentFile].media==='video'){
          playVideo(files[currentFile].src)
        }
      }
    },[currentFile, AutoPlay])
    
    
  
    function handleNext(){
      let nextFile = currentFile + 1;
      while(nextFile < files.length && files[nextFile].media==='none'){
        nextFile = nextFile + 1;
      }
      if(nextFile >= files.length){
        nextFile = files.length - 1;
      }
      setCurrentFile(nextFile);
    }
    function handlePrevious(){
      let previous = currentFile - 1;
      while(previous >= 0 && files[previous].media==='none'){
        previous = previous - 1;
      }
      if(previous < 0){
        previous = 0;
      }
      setCurrentFile(previous);
    }

    function updateActor(idx, actor) {
      files[idx].actor = actor;
      files[idx].src = "";
      setStory({...story, medias: files});
    }

    function updateText(idx, text) {
      files[idx].text = text;
      files[idx].src = "";
      setStory({...story, medias: files});
    }

    function updateMedia(idx, media) {
      files[idx].media = media;
      files[idx].src = "";
      setStory({...story, medias: files});
    }

    function insertEmptyMediaAfter(idx) {
      files.splice(idx + 1, 0, placeholder);
      console.log(files);
      setStory({...story, medias: files});
    }
    
    const saveStory = async () => {
  
      try {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(props.story, null, 4)
        };
        const response = await fetch('http://localhost:8726/save', requestOptions);
  
        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }
  
        const result = await response.json();
        
        setStory(result);
      } catch (err) {
        console.log(err)
      }
    };

    const currentMedia = files.length > 0 ? files[currentFile] : {src: null, media: 'None'};
    const isAudio = currentMedia.media === 'audio';
    const isVideo = currentMedia.media === 'video';
  
    return <Container>
      <div  style={{display: currentMedia.src ? 'block' : 'none'}} >
        <audio controls style={{
            width: '100%',
            display: isAudio ? 'block' : 'none'
          }}
          onEnded={handleNext}
          src={`/assets/${currentMedia.src}`}
          id='track01'
          >  
        </audio>
        <Button children='Play video' size='small' onClick={(event) => playVideo(currentMedia.src)}
          style={{
            display: isVideo ? 'block' : 'none'
          }} />
        <div style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
          <Button children='<' size='small' onClick={handlePrevious} disabled={!currentFile} />
          <Button children='>' onClick={handleNext} />
        </div>
        <p children={`Track source: ${currentMedia.src}`}/>
        <p children={`Track index: ${currentFile}`}/>
        <Switch label='Auto-Play' callback={() => setAutoPlay(state => !state)} value={AutoPlay}/>
      </div>

      <FileListContainer>
        {
          files.map((file, idx) =>
            <FileListItem id={file.src} isActive={idx === currentFile} key={idx}
                          onClick={()=>setCurrentFile(idx)}>
              <input type="text" name="actor" value={file.actor} onChange={(event) => updateActor(idx, event.target.value)}/>:
              <input type="text" name="media" value={file.media} onChange={(event) => updateMedia(idx, event.target.value)}/>
              <textarea name="src" value={file.text} style={{width: "100%"}} onChange={(event) => updateText(idx, event.target.value)}/>
              <Button onClick={saveStory}>Update</Button>
              <Button onClick={() => {insertEmptyMediaAfter(idx)}}>Insert</Button>
            

            </FileListItem>
            
          )
        }
      </FileListContainer>
    </Container>
  }

  export default AudioScreen

  const Container = styled.div`
    width: 90%;
    padding: 1em;
  `
  const FileListContainer = styled.div`
    width: 100%;
    max-height: 70vh;
    overflow-y: scroll;
    overflow-x: hidden;
 `
  const FileListItem = styled.p`
    cursor: pointer;
    width: 100%;
    padding: 0.5em;
    background-color: ${props => props.isActive ? '#202020' : '#353535'};
  `