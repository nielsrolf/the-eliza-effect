import styled from '@emotion/styled'
import BasicModal from './components/Modal';
import useAudioDevice from './hooks/useAudioDevice';
import useMidiDevice from './hooks/useMidiDevice';
import SettingsScreen from './screens/SettingsScreen';
import SelectPath from './components/SelectPath';
import AudioScreen from './screens/AudioScreen';
import TextVersion from './components/TextVersion';
import {useState} from 'react';


// import Medias from './medias.json'


function App() {


  const AudioDevice = useAudioDevice() 
  const MidiDevice = useMidiDevice()
  const [story, setStory] = useState({medias: [], path: ""});
  const [available, setAvailable] = useState([]);
  const [ currentFile_, setCurrentFile_ ] = useState(0);
  const [selectedStory, setSelectedStory] = useState('');

  return (<>
    <SelectPath story={story} setStory={setStory} available={available} setAvailable={setAvailable} currentFile_={currentFile_} setCurrentFile_={setCurrentFile_} selectedStory={selectedStory} setSelectedStory={setSelectedStory}/>
    {/* <SelectStory setStory={setStory} story={story}/> */}
    <AudioScreen story={story} setStory={setStory} midiOutput={MidiDevice.midiOutput} currentFile_={currentFile_} setCurrentFile_={setCurrentFile_} setSelectedStory={setSelectedStory}/>
    {/* <TextVersion story={story} /> */}
    <BasicModal title='Settings'>          
      <SettingsScreen {...AudioDevice} {...MidiDevice} />
    </BasicModal>
    </>
  );
}

export default App;

const Container = styled.div`
width: 100%;
min-height: 100vh;

display: flex;
justify-content: center;
align-items: center;
`
