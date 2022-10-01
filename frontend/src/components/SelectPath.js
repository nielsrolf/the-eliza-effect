import { Button } from "@mui/material";
import {useState, useEffect} from 'react';
import Chapters from './Chapters';

async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function SelectPath(props) {
  const {story, setStory, available, setAvailable, currentFile_, setCurrentFile_, selectedStory, setSelectedStory} = props;
  console.log(available)

  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');
  
  
  const setSelectedPath = async (event) => {
    setSelectedStory(event.target.value);
    console.log(event);
    // setStory({...story, path: event.target.value});
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: event.target.value }, null, 4)
    };
    const response = await fetch('http://localhost:8726/open', requestOptions);

    if (!response.ok) {
    throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();

    console.log('result is: ', JSON.stringify(result, null, 4));

    setStory(result);
    setCurrentFile_(0);
  }

  useEffect(() => {
    const fetchAvailable = async () => {
    // if(available.length > 0) return;
        try{
            setIsLoading(true);
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            };
            const response = await fetch('http://localhost:8726/available', requestOptions);

            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }

            const result = await response.json();

            console.log('result is: ', JSON.stringify(result, null, 4));

            setAvailable(result);
        } catch (err) {
            setErr(err.message);
        } finally {
            setIsLoading(false);
        }
    }
    if(available.length === 0) fetchAvailable();
    let filename = selectedStory.replace("data/", "").replace("/medias.json", "");
    document.getElementById("filename").value = filename;
  } , [available, selectedStory, setAvailable, setSelectedStory]);

  const saveAs = async () => {
    
    const filename = "data/" + document.getElementById("filename")?.value + "/medias.json";
    console.log(filename);
    let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...story, path: filename }, null, 4)
    };
    let response = await fetch('http://localhost:8726/save', requestOptions);
    let result = await response.json();
    setSelectedStory(filename);
    setStory(result);
    // available
    requestOptions = {
      method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
    response = await fetch('http://localhost:8726/available', requestOptions);

    if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
    }

    result = await response.json();

    console.log('result is: ', JSON.stringify(result, null, 4));

    setAvailable(result);
  }


  return (
    <div>
      <form>
        {
          available.map((file) =>
              <Button value={file} onClick={setSelectedPath} key={file} style={{
                "backgroundColor":  file === selectedStory ? "rgb(120, 120, 120)" : "rgb(60, 60, 60)",
              }}>{file.split("data/")[1].split(".")[0]}</Button>
          )
      }
      Save as: <input id="filename" type="text" />
      <Button onClick={saveAs}>Save</Button>
      </form>
      <Chapters story={story} currentFile={currentFile_} setCurrentFile={setCurrentFile_} />
    </div>
  )
}

export default SelectPath;


