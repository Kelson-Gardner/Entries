import { useState } from 'react';
import './App.css';
import { Button } from '@mui/material';
import VisuallyHiddenInput from './components/VisuallyHiddenInput';
import HelpIcon from '@mui/icons-material/Help';
import Tooltip from '@mui/material/Tooltip';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import CelebrationIcon from '@mui/icons-material/Celebration';
import confetti from 'canvas-confetti';


function App() {
  const [winner, setWinner] = useState("");
  const [entryPool, setEntryPool] = useState([]);
  const [error, setError] = useState("");
  const [percentages, setPercentages] = useState([]);
  
  function selectWinner(event){
    readFile(event, pickRandomEntry);
    confetti({
      angle: 90,
      spread: 360,
      particleCount: 100,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#ff0', '#0f0', '#f00']
    });
  }


  function getPercentagesAndWinner(event){
    readFile(event, pickRandomEntry);
    readFile(event, calculatePercentages);
    confetti({
  angle: 90,
  spread: 360,
  particleCount: 100,
  origin: { x: 0.5, y: 0.5 },
  colors: ['#ff0', '#0f0', '#f00']
});
  }

  function getTotalEntries(entries){
    return entries.reduce((sum, entry) => sum + parseInt(entry.Entries), 0);
  }

  function calculatePercentages(entries){
    const totalEntries = getTotalEntries(entries);
    let entryPercentages = [];
    for(let entry of entries){
      let winPercentage = (entry.Entries / totalEntries) * 100;
      let newEntry = {name: entry.Name, percentage: winPercentage.toFixed(2)};
      entryPercentages.push(newEntry);
    }
    setPercentages(entryPercentages.sort((a, b) => b.percentage - a.percentage));
    return entryPercentages;
  }

  function pickRandomEntry(entries) {
    const totalEntries = getTotalEntries(entries);
    let randomIndex = Math.floor(Math.random() * totalEntries);
    for (const entry of entries) {
        if (randomIndex < entry.Entries) {
            return entry.Name;
        }
        randomIndex -= entry.Entries;
    }
  }

  function readFile(event, funct){
    if(entryPool.length > 0 && event.target.files === undefined){
      setWinner(pickRandomEntry(entryPool));
    }
    else{
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;

          setEntryPool(parseCSV(content));

          const tempEntryPool = parseCSV(content);
          const result = funct(tempEntryPool);

          if(Array.isArray(result)){
            setPercentages(funct(tempEntryPool));
          }else{
            setWinner(funct(tempEntryPool));
          }

        };
        reader.readAsText(file);
      }
    }
  }

  function parseCSV(csv) {
    setError("");
    const lines = csv.split('\n'); 
    const entries = [];
    const headers = ["Name", "Entries"];
    for (let i = 0; i < lines.length; i++) {
      const values = lines[i].split(',');

      if (values.length === headers.length) {
        const entry = {};

        for (let j = 0; j < headers.length; j++) {
          entry[headers[j]] = values[j].trim();
        }
        
        if((values[0] || values[1]) && !(values[0] && values[1])){
          setError("The CSV is not formatted correctly!");
          return []
        }

        entries.push(entry);
      }
    }
    return entries;
  }

  return (
    <>
      <h1>
        Entries
      <Tooltip title="The CSV should be formatted as follows ['name',' # of entries']" arrow>
         <HelpIcon id="help-icon"></HelpIcon>
         </Tooltip>
      </h1>
      <div className="button-container">
        <Button
            sx={{ minWidth: 350 }}   
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<EmojiEventsIcon />}
            className="button">
          Get A Winner
         <VisuallyHiddenInput funct={getPercentagesAndWinner}/>
         </Button>
      </div>
      {error && (
          <>
          <p>{error}</p>
          </>
      )}
      {percentages && winner && (
        <>
        <p>The Winner is {winner}!!</p>
        <Button 
        onClick={selectWinner}
        >Generatre New Winner</Button>
        <ul>{percentages.map((item, index) => (
            <li key={index}>{item.name}: {item.percentage}%</li>
        ))}
        </ul>
        </>
      )}
    </>
  )
}

export default App
