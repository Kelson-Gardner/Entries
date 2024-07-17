import { useState } from 'react'
import './App.css'
import { Button } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisuallyHiddenInput from './components/VisuallyHiddenInput';


function App() {
  const [winner, setWinner] = useState("")
  const [entryPool, setEntryPool] = useState([])

  function pickRandomEntry(entries) {
    const totalEntries = entries.reduce((sum , entry) => sum + parseInt(entry.Entries), 0);
    let randomIndex = Math.floor(Math.random() * totalEntries);
    for (const entry of entries) {
        if (randomIndex < entry.Entries) {
            return entry.Name;
        }
        randomIndex -= entry.Entries;
    }
}

  function readFile(event){
    if(entryPool.length > 0 && event.target.files === undefined){
      setWinner(pickRandomEntry(entryPool))
    }
    else{
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          setEntryPool(parseCSV(content))
          const tempEntryPool = parseCSV(content)
          setWinner(pickRandomEntry(tempEntryPool))
        };
        reader.readAsText(file);
      }
    }
  }

  function parseCSV(csv) {
    const lines = csv.split('\n'); 
    const entries = [];
    const headers = ["Name", "Entries"]
  
    for (let i = 0; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length === headers.length) {
        const entry = {};
        for (let j = 0; j < headers.length; j++) {
          entry[headers[j]] = values[j].trim();
        }
        entries.push(entry);
      }
    }
    return entries;
  }


  return (
    <>
      <h1>Entries</h1>
      <div className="input-container">
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}>
          Upload CSV File
         <VisuallyHiddenInput funct={readFile}/>
         </Button>
      </div>
      {winner !== "" && (
        <>
        <p>The Winner is {winner}!!</p>
        <Button 
        onClick={readFile}
        >Generatre New Winner</Button>
        </>
      )}
    </>
  )
}

export default App
