import styled from '@emotion/styled'
import BasicModal from './components/Modal';
import useAudioDevice from './hooks/useAudioDevice';
import useMidiDevice from './hooks/useMidiDevice';
import SettingsScreen from './screens/SettingsScreen';
import SelectStory from './components/SelectStory';
import SelectPath from './components/SelectPath';
import AudioScreen from './screens/AudioScreen';
import TextVersion from './components/TextVersion';
import {useState} from 'react';


// import Medias from './medias.json'


function App() {

  // const files = [
  //   ...Array(10).fill({src:'', name: ''}).map(
  //   (file, index) => ({ src:`assets/L${index+1}.wav`, output: 101 }) ), 
  //   ...Array(1).fill({ src:'assets/C1.wav', output: 105 })
  // ];

  // const files = [
  //   {src: 'assets/L1.wav', output: 101},
  //   {src: 'assets/L2.wav', output: 102},
  //   {src: 'assets/L3.wav', output: 103},
  //   {src: 'assets/L4.wav', output: 104},
  //   {src: 'assets/L5.wav', output: 105},
  //   {src: 'assets/L6.wav', output: 106},
  // ]

  const AudioDevice = useAudioDevice() 
  const MidiDevice = useMidiDevice()
  const [story, setStory] = useState({medias: [], path: "data/cowboy_dream/generated/medias.json"});
  const [available, setAvailable] = useState([]);
  const [ currentFile_, setCurrentFile_ ] = useState(0);
  const [selectedStory, setSelectedStory] = useState('');

  return (<>
    <SelectPath setStory={setStory} available={available} setAvailable={setAvailable} setCurrentFile_={setCurrentFile_} selectedStory={selectedStory} setSelectedStory={setSelectedStory}/>
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
