import styled from "@emotion/styled";
import { Button, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import { useMIDIOutput } from "../hooks/useMidiOutput";
import React from 'react';

// 0 db
const MAX_VOLUME = 104;


// const outputs = {
//   "Luzia": 112,
//   "Marin": 114,
//   "Kriemhild": 116,
//   "LUZIA": 112,
//   "MARIN": 114,
//   "KRIEMHILD": 116,
//   "Alle": "all",
//   "ALL": "all",
//   "ALLE": "all",
//   "All": "all",
//   "all": "all",
//   "Raum": 110 ,
//   "raum": 110 ,
//   "Raum": 110 ,
//   "ROOM": 110 ,
//   "RAUM": 110 ,
//   "room": 110 
// }

const outputs = {
  "Raum": 116 ,
  "raum": 116 ,
  "Raum": 116 ,
  "ROOM": 116 ,
  "RAUM": 116 ,
  "room": 116,
  "Luzia": 104,
  "Marin": 106,
  "Kriemhild": 108,
  "LUZIA": 104,
  "MARIN": 106,
  "KRIEMHILD": 108,
  "Alle": "all",
  "ALL": "all",
  "ALLE": "all",
  "All": "all",
  "all": "all",
  "AI": "all"
}



const AudioScreen = props => {
    let { story, setStory, midiOutput } = props;

    const placeholder = { src: "", text: "", output: 0, media: "none", actor: "", raw: "" };
    let files = story.medias.length > 0 ? story.medias : [placeholder];
  
    const { cc } = useMIDIOutput(midiOutput);
    // const [ selectedOutput, setSelectedOutput ] = useState({ name: 'default' });
  
    const [ currentFile_, setCurrentFile ] = useState(0);
    const [ AutoPlay, setAutoPlay ] = useState(false)
    const currentFile = currentFile_ > files.length - 1 ? 0 : currentFile_;
    const [isLoading, setIsLoading] = useState(false);
    // const [playbackRate, setPlaybackRate] = useState(100);

    console.log("autoPlay", AutoPlay)
    const refs = files.map(() => React.createRef());


    // const changeAudioSpeed = (targetSpeed) => {
    //   document.getElementById('track01').playbackRate =targetSpeed / 100;
    //   // setPlaybackRate(event.target.value);
    // }

    const playVideo = async (part) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(part)
      };
      console.log("play", part);
      await fetch(`http://localhost:8726/play/`, requestOptions).then(res => {
        return res.json()}).then(part => {
        if(part.wait_until_finished){
          setTimeout(handleNext, 1000 * part.duration);
        } else {
          handleNext();
        }
      }).catch(err => {
        console.log(err);
      });
    }

    useEffect(() => {
      const keyDownHandler = event => {
        console.log('User pressed: ', event.key);
  
        if (event.key === 'Escape') {
          event.preventDefault();
  
          // ??????? your logic here
          console.log("autoplay before:", AutoPlay);
          setAutoPlay(!AutoPlay);
        }
      };
  
      document.addEventListener('keydown', keyDownHandler);
  
      // ??????? clean up event listener
      return () => {
        document.removeEventListener('keydown', keyDownHandler);
      };
    }, [AutoPlay]);
    
    useEffect(()=>{
      const AudioElement = document.getElementById('track01');
      
      function handleOutputChange(actor){
        console.log("output changed to: ", outputs[actor]);
        if (!actor) return;

        if(outputs[actor]==="all") {
          for(let i = 104; i <= 109; i++){
            cc(MAX_VOLUME, i, 9);
          }
          // setSelectedOutput(channel);
          return
        }
        // mute all channels
        for(let i = 0; i <= 127; i++){
          try{
            cc(0, i, 9);
          } catch (err) {
            console.log("did not mute", i);
          }
        }
        for(let singleActor of actor.split("+")){
          // set selected channel to max volume
          let channel = outputs[singleActor] || parseInt(singleActor);
          cc(MAX_VOLUME, channel, 9);
          cc(MAX_VOLUME, channel + 1, 9);
          // setSelectedOutput(channel); 
        }
      }
      
      if(files[currentFile].src){
        handleOutputChange(files[currentFile].actor)
        document.getElementById(files[currentFile]?.src).scrollIntoView({behavior: "smooth", block: "center"});
        if (!AutoPlay) return;
        if(files[currentFile].media==='audio'){
          AudioElement.play();
        }
      }
      if(["video", "typing", "input"].includes(files[currentFile].media) && AutoPlay){
        playVideo(files[currentFile])
      }
    },[currentFile, AutoPlay])


    function handleNextOffset(offset){
      console.log("habndlenext", currentFile)
      let nextFile = currentFile + offset;
      while(nextFile < files.length && files[nextFile].media==='none'){
        nextFile = nextFile + 1;
      }
      if(nextFile >= files.length){
        nextFile = files.length - 1;
      }
      if(files[nextFile].media==='stop') {
        setAutoPlay(false);
      }
      setCurrentFile(nextFile);
      refs[nextFile].current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      if(files[nextFile].media==="break") {
        let seconds = parseInt(files[nextFile].text);
        setTimeout(() => handleNextOffset(offset + 1), seconds * 1000)
      }
    }

    function handleNext() {
      handleNextOffset(1);
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
      console.log(files[idx])
      if(media=="extern"){
        files[idx].src = files[idx].text
      }else{
        files[idx].src = "";
      }
      setStory({...story, medias: files});
    }

    function deletePart(idx) {
      files.splice(idx, 1);
      setStory({...story, medias: files});
    }

    function insertEmptyMediaAfter(idx) {
      files.splice(idx + 1, 0, placeholder);
      console.log(files);
      setStory({...story, medias: files});
    }

    function changeWaitUntilFinish(idx) {
      files[idx].wait_until_finished = !files[idx].wait_until_finished;
      setStory({...story, medias: files});
    }

    function clearScreenAndHandleNext() {
      playVideo({
        "text": "",
        "duration": 0.1,
        "media": "video"
      });
      handleNext();
    }

    function updateSpeed(idx, speed) {
      files[idx].speed = speed;
      setStory({...story, medias: files});
    }
    
    const saveStory = async () => {
  
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    const currentMedia = files.length > 0 ? files[currentFile] : {src: null, media: 'None'};
    const isAudio = currentMedia.media === 'audio' || currentMedia.media === 'extern';
    const isVideo = currentMedia.media === 'video';
  
    return <Container>
      <div  style={{position: 'absolut', bottom: 0}} >
        <audio controls style={{
            width: '100%', height: '80px',
            display: isAudio ? 'inline' : 'none'
          }}
          onPlay={() => {document.getElementById("track01").playbackRate = (currentMedia.speed || 100) / 100}}
          onEnded={clearScreenAndHandleNext}
          src={`http://localhost:8726/assets/${currentMedia.src}`}
          id='track01'
          >  
        </audio>
        <div style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
          <Button children='<' size='small' onClick={handlePrevious} disabled={!currentFile} />
          <Button children='>' onClick={handleNext} />
        </div>
      </div>

      <FileListContainer>
        {
          files.map((file, idx) =>
            <FileListItem id={file.src} isActive={idx === currentFile} key={idx} ref={refs[idx]}>
              <Button onClick={()=>setCurrentFile(idx)}>Select</Button>
              <div style={{display: ["video", "typing", "input"].includes(files[idx].media) ? "inline" : "none"}}>
                Autoplay wartet bis das Video vorbei ist: <input type="checkbox" checked={file.wait_until_finished} onChange={() => changeWaitUntilFinish(idx)} />
              </div>
              <input type="text" name="actor" value={file.actor} onChange={(event) => updateActor(idx, event.target.value)}/>:
              <input type="text" name="media" value={file.media} onChange={(event) => updateMedia(idx, event.target.value)}/>
              <textarea name="src" value={file.text} style={{width: "100%"}} onChange={(event) => updateText(idx, event.target.value)}/>

              <div style={{display: isLoading ? 'none' : 'block'}} >
               <div style={{display: file.media=="audio" ? 'block' : 'none'}} >
                  Speed: <Slider aria-label="Speed" value={file.speed ? file.speed : 100  } onChange={(event) => updateSpeed(idx, event.target.value)} min={50}  max={150}  style={{
                    width: '420px', height: '15px'
                  }} size="small"  valueLabelDisplay="auto"/>
                </div>
                <Button onClick={saveStory}>Update</Button>
                <Button onClick={() => {insertEmptyMediaAfter(idx)}}>Insert</Button>
                <Button onClick={() => {deletePart(idx)}}>Delete</Button>
                <Button onClick={() => {playVideo(files[idx])}} style={{display: ["video", "typing", "input"].includes(files[idx].media) ? "inline" : "none"}}>Play</Button>
                Autoplay: 
                <input
                  type="checkbox"
                  checked={AutoPlay}
                  onChange={() => setAutoPlay(!AutoPlay)}
                  // playbackRate="0.5"
                />
              </div>

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