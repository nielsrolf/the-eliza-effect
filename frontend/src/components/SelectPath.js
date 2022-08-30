import { Button } from "@mui/material";
import {useState, useEffect} from 'react';


function SelectPath(props) {
  const {setStory, available, setAvailable} = props;
  console.log(available)

  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');
  
  const setSelectedPath = async (event) => {
    console.log(event);
    // setStory({...story, path: event.target.value});
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: event.target.value }, null, 4)
    };
    const response = await fetch('http://localhost:5000/open', requestOptions);

    if (!response.ok) {
    throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();

    console.log('result is: ', JSON.stringify(result, null, 4));

    setStory(result);
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
            const response = await fetch('http://localhost:5000/available', requestOptions);

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
  } , [available]);


  return (
    <form>
      {
        available.map((file) =>
            <Button value={file} onClick={setSelectedPath} key={file}>{file}</Button>
        )
    }
    </form>
  )
}

export default SelectPath;


