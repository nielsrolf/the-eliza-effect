import {useState} from 'react';



const SelectStory = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');

  const generateStory = async () => {
    setIsLoading(true);

    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(props.story, null, 4)
      };
      const response = await fetch('http://localhost:8726/generate', requestOptions);

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = await response.json();
      
      props.setStory(result);
    } catch (err) {
      setErr(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {err && <h2>{err}</h2>}
      <button onClick={generateStory}>Generate</button>
      {isLoading && <h2>Loading...</h2>}

    </div>
  );
};

export default SelectStory;

