import { Hidden } from "@mui/material"

function VisuallyHiddenInput(props){
    return (
        <>
        <input 
        type="file"
        accept=".csv"
        style={{display: 'none'}}
        onChange={props.funct}
        ></input>
        </>
    )
}

export default VisuallyHiddenInput