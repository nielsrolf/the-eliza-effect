import styled from "@emotion/styled";
import { Button, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import { useMIDIOutput } from "../hooks/useMidiOutput";
import React from 'react';
import {MdAudiotrack, MdVideoCameraBack, MdPanoramaFishEye, MdNoteAdd, MdOutlineDeleteForever, MdPlayCircle, MdPauseCircle, MdControlCamera, MdOutlineRepeatOne, MdOutlineRepeatOneOn} from 'react-icons/md';

// 0 db
const MAX_VOLUME = 104;


const outputs = {
  "Luzia": 112,
  "Marin": 114,
  "Kriemhild": 116,
  "LUZIA": 112,
  "MARIN": 114,
  "KRIEMHILD": 116,
  "Alle": "all",
  "ALL": "all",
  "ALLE": "all",
  "All": "all",
  "all": "all",
  "AI": "all",
  "KI": "all",
  "ki": "all",
  "ai": "all",
  "Raum": 110 ,
  "raum": 110 ,
  "Raum": 110 ,
  "ROOM": 110 ,
  "RAUM": 110 ,
  "room": 110 ,
  "extern": 110
}

// #a65628
// #f781bf
// #984ea3
const colors = {
  "luzia": "#e41a1c",
  "marin": "#377eb8",
  "kriemhild": "#4daf4a",
  "alle": "black",
  "all": "black",
  "ai": "black",
  "ki": "black",
  "raum": "#a65628",
  "room": "#a65628",
  "audience": "#ff7f00",
  "": "rgba(0,0,0,0)",
  "r": "red",
  "g": "green",
  "b": "blue",
  "y": "yellow",
  "o": "orange",
  "w": "white",
  "k": "black",
  "red": "red",
  "green": "green",
  "blue": "blue",
  "yellow": "yellow",
  "orange": "orange",
  "white": "white",
  "black": "black"
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
    const [loopAudio, setLoopAudio] = useState(false);
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
  
          // 👇️ your logic here
          console.log("autoplay before:", AutoPlay);
          if(AutoPlay){
            pausePlay();
          }else{
            startPlay();
          }
          setAutoPlay(!AutoPlay);
        }
      };
  
      document.addEventListener('keydown', keyDownHandler);
  
      // 👇️ clean up event listener
      return () => {
        document.removeEventListener('keydown', keyDownHandler);
      };
    }, [AutoPlay]);



    useEffect(() => {
      const keyDownHandler = event => {
        console.log('User pressed: ', event.key);
  
        if (event.key === 'ArrowRight') {
          console.log("yooo");
          event.preventDefault();
          handleNext();
        }

        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          handlePrevious();
        }

        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          event.preventDefault();
          console.log(refs[currentFile])
          refs[currentFile]?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

      };
  
      document.addEventListener('keydown', keyDownHandler);
  
      // 👇️ clean up event listener
      return () => {
        document.removeEventListener('keydown', keyDownHandler);
      };
    }, [currentFile, files, refs]);
    
    useEffect(()=>{
      const AudioElement = document.getElementById('track01');
      
      function handleOutputChange(actor){
        console.log("output changed to: ", outputs[actor], actor);
        if (!actor) return;

        if(outputs[actor.toLowerCase()]==="all") {
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
          let channel = outputs[singleActor.toLowerCase()] || parseInt(singleActor);
          cc(MAX_VOLUME, channel, 9);
          cc(MAX_VOLUME, channel + 1, 9);
          // setSelectedOutput(channel); 
        }
      }
      
      
      if(files[currentFile].src){
        console.log("src is not null");
        handleOutputChange(files[currentFile].actor)
        console.log("output changed");
        document.getElementById(files[currentFile]?.src).scrollIntoView({behavior: "smooth", block: "center"});
        if (!AutoPlay) return;
        console.log("autplay is on");
        if(files[currentFile].media==='audio' || files[currentFile].media==='extern'){
          console.log("123");
          AudioElement.play();
        }
      }
      if(["video", "typing", "input"].includes(files[currentFile].media) && AutoPlay){
        playVideo(files[currentFile])
      }
    },[currentFile, AutoPlay])


    function handleNextOffset(offset){
      console.log("habndlenext", currentFile, offset)
      let nextFile = currentFile + offset;
      while(nextFile < files.length && files[nextFile].media==='none'){
        nextFile = nextFile + 1;
      }
      if(nextFile >= files.length){
        nextFile = files.length - 1;
      }
      setCurrentFile(nextFile);
      refs[nextFile]?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      if(files[nextFile].media==='stop') {
        setAutoPlay(false);
        setTimeout(() => handleNextOffset(offset + 1), 500)
      }

      if(files[nextFile].media==="break") {
        let seconds = parseInt(files[nextFile].text);
        setTimeout(() => handleNextOffset(offset + 1), seconds * 1000)
      }
    }

    function handleNext() {
      if(loopAudio){
        document.getElementById('track01').currentTime = 0;
        document.getElementById('track01').play();
        return;
      }
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
    function updateTitle(idx, title) {
      files[idx].title = title;
      setStory({...story, medias: files});
    }
    function updateColor(idx, color) {
      files[idx].color = color;
      setStory({...story, medias: files});
    }

    function updateText(idx, text) {
      files[idx].text = text;
      if(files[idx].media=="extern"){
        files[idx].src = files[idx].text
      }else{
        files[idx].src = "";
      }
      if(files[idx].media=="question"){
        const part = {...files[idx], media: "video"};
        playVideo(part);
      }

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
      setCurrentFile(idx + 1);
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
        if(files[currentFile].actor=="audience") {
          setCurrentFile(currentFile + 1);
          // handleNext();
        }
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false);
      }
    };

    const currentMedia = files.length > 0 ? files[currentFile] : {src: null, media: 'None'};
    const isAudio = currentMedia.media === 'audio' || currentMedia.media === 'extern';
    // video: one of ['video', 'typing', 'input']
    const isVideo = currentMedia.media === 'video' || currentMedia.media === 'typing' || currentMedia.media === 'input' || currentMedia.media === 'question' || currentMedia.media === 'endless-typing';

    function mediaIcon(file, onClick) {
      switch(file.media) {
        case 'audio':
          return <MdAudiotrack onClick={onClick} style={{margin: "auto"}}/>
        case 'video':
          return <MdVideoCameraBack onClick={onClick} style={{margin: "auto"}} />
        case 'typing':
          return <MdVideoCameraBack  onClick={onClick} style={{margin: "auto"}}/>
        case 'question':
          return <MdVideoCameraBack  onClick={onClick} style={{margin: "auto"}}/>
        case 'endless-typing':
          return <MdVideoCameraBack  onClick={onClick} style={{margin: "auto"}}/>
        case 'input':
          return <MdVideoCameraBack onClick={onClick} style={{margin: "auto"}} />
        case 'extern':
          return <MdAudiotrack  onClick={onClick} style={{margin: "auto"}}/>
        // case 'break':
        //   return <PauseIcon />
        // case 'stop':
        //   return <StopIcon />
        // case 'none':
        //   return <RemoveIcon />
        default:
          return <MdPanoramaFishEye  onClick={onClick}/>;
      }
    }
    function pausePlay() {
      document.getElementById("track01").pause();
      setAutoPlay(false);
    }
    function startPlay() {
      console.log("u")
      document.getElementById("track01").play();
      setAutoPlay(true);
    }
    const autoplayButton = AutoPlay ? <MdPauseCircle onClick={pausePlay} size={100} /> : <MdPlayCircle onClick={startPlay} size={100} />;
    const loopButton = loopAudio ? <MdOutlineRepeatOneOn onClick={() => setLoopAudio(false)} size={100} /> : <MdOutlineRepeatOne onClick={() => setLoopAudio(true)} size={100} />;

  
    return <Container>
      <div  style={{position: 'absolut', bottom: 0, display: "flex", flexDirection: "row"}} >
        {autoplayButton}
        {loopButton}
        
        {/* <p>Autoplay: 
        <input
          type="checkbox"
          checked={AutoPlay}
          onChange={() => setAutoPlay(!AutoPlay)}
          // playbackRate="0.5"
        />
        </p> */}
        <audio controls style={{
            width: '100%', height: '100px',
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
          <MdControlCamera onClick={() => refs[currentFile]?.current?.scrollIntoView({behavior: 'smooth', block: 'start'})} size={100} />
          <Button children='>' onClick={handleNext} />
        </div>
      </div>
    

      <FileListContainer>
        {
          files.map((file, idx) =>
            <FileListItem id={file.src} isActive={idx === currentFile} key={idx} ref={refs[idx]} style={{
              display: "flex", 
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "space-between", width: "100%", height: "40px"}}>
                <input type="text" name="title" value={file.title} onChange={(event) => updateTitle(idx, event.target.value)}
                style={{backgroundColor: colors[file.color], width: "100%", fontSize: 20}} />
                <div style={{width: "100px"}}>Color <input type="text" name="color" value={file.color} onChange={(event) => updateColor(idx, event.target.value)}
                style={{backgroundColor: colors[file.color], width: "100%"}} />
                </div>
              </div>
              <div  style={{
                display: "flex", 
                flexDirection: "row",
                justifyContent: "space-between",
                padding: "5px",
                width: "100%",
                border: "1px solid white",
              }}>
                <MdOutlineDeleteForever onClick={() => {deletePart(idx)}} size={50}/>
                <div style={{display: 'flex', flexDirection: 'r', flex: "1 1 auto"}}>
                  

                    
                    <input type="text" name="actor" value={file.actor} onChange={(event) => updateActor(idx, event.target.value)}
                      style={{backgroundColor: colors[file.actor.toLowerCase()]}} />
                    <div style={{display: ["video", "typing", "input"].includes(files[idx].media) ? "flex" : "none"}}>
                      Warten: <input type="checkbox" checked={file.wait_until_finished} onChange={() => changeWaitUntilFinish(idx)} />
                    </div>
                    
                </div>

                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: "4 1 auto"}}>

                    <textarea name="src" value={file.text} style={{width: "100%", height: "100%"}} onChange={(event) => updateText(idx, event.target.value)}/>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                        <div style={{display: (file.media=="extern" || file.media=="audio") ? "inline" : "none"}}>
                        Speed: <Slider aria-label="Speed" value={file.speed ? file.speed : 100  } onChange={(event) => updateSpeed(idx, event.target.value)} min={50}  max={150}  style={{
                          height: '15px',
                          width: "100px",
                        }} size="small"  valueLabelDisplay="auto"/>
                        </div>
                        <Button onClick={saveStory}>Update</Button>
                        
                        
                    </div>
                </div>

                <div style={{ flex: "0 0 100px", display: "flex", height: "100px", flexDirection: "column", justifyContent: "space-between", alignItems: "center", paddingLeft: "5px"}}>
                  <input type="text" name="media" value={file.media} onChange={(event) => updateMedia(idx, event.target.value)} style={{width: "100%"}}/>
                  <div style={{display: 'flex',width: "100%", flexDirection: 'column', height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "green" }}
                     onClick={()=>setCurrentFile(idx)} >
                    {mediaIcon(file)}
                  </div>
                </div>
              </div>
              <MdNoteAdd onClick={() => {insertEmptyMediaAfter(idx)}} size={32}/>
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