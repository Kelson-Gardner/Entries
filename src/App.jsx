import { useState } from 'react';
import './App.css';
import { Button } from '@mui/material';
import VisuallyHiddenInput from './components/VisuallyHiddenInput';
import HelpIcon from '@mui/icons-material/Help';
import Tooltip from '@mui/material/Tooltip';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

function App() {
  const [winner, setWinner] = useState("");
  const [entryPool, setEntryPool] = useState([]);
  const [error, setError] = useState("");
  const [formatError, setFormatError] = useState("");
  const [percentages, setPercentages] = useState([]);
  
  function selectWinner(event){
    readFile(event, pickRandomEntry);
  }


  function getPercentagesAndWinner(event){
    readFile(event, pickRandomEntry);
    readFile(event, calculatePercentages);
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
    setFormatError("");
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

        values[0] = values[0].replace(/\s+/g, '');
        values[1] = values[1].replace(/\s+/g, '');

        if((values[0] || values[1]) && !(values[0] && values[1])){
          if(!values[0]){
            setFormatError(`A name is missing in Row ${i + 1}`)
          } else {
            setFormatError(`# of entries is missing in Row ${i + 1} for ${values[0]}`)
          }
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
      <Tooltip title={<span>The CSV should be formatted as follows:<br></br> Column 1: Names, Column 2: # of Entries</span>} arrow>
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
          <div style={{color: 'red'}}>{error}</div>
          <div style={{color: 'red'}}>{formatError}</div>
          </>
      )}
      {percentages && winner && (
        <>
        <h2>The Winner is {winner}!!</h2>
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
