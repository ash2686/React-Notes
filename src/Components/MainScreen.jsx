import React, { useEffect, useState, useRef} from 'react'
import './MainScreen.css';

const MainScreen = ({saveNote,clearNotes,onAddNoteHandler, clearArea,selectedNote}) => {

    let [note,setNote] = useState({title:"",body:""});
    let titleRef = useRef(null);

    // Function to clear inputs + focus
    const clearAndFocus = () => {
    setNote({ title: "", body: "" });
    if(titleRef.current) titleRef.current.focus();
    
    };

      useEffect(() => {
    if (selectedNote) {
      setNote({ title: selectedNote.title, body: selectedNote.body });
    } else {
      setNote({ title: '', body: '' });
    }
    if (titleRef.current) titleRef.current.focus();
  }, [selectedNote]);

   // Pass the function to parent when component mounts
    useEffect(() => {      
      onAddNoteHandler(clearAndFocus);    
    }, [onAddNoteHandler]);

     useEffect(() => {
    if (clearArea) {
      clearArea(clearAndFocus);
    }
  }, [clearArea]);


    function handleChange(e){
      let {name, value} = e.target;
     
      setNote(prev=>({
        ...prev, [name === "title" ?"title" : "body"]:value
      }));
         
    }
    function validNote(){
      if (!note.title.trim() || !note.body.trim()) {
                                     alert("Both Title and Body are required!");
                                     return;
                                    }
    saveNote(note);

    }
  return (
        <>
        <div className="main-screen">
          <div className="screen-top">
             <input ref={titleRef} type="text" name="title" id="note-title" placeholder='Title goes here!' value ={note.title} onChange={handleChange} />
             <textarea name="body" id="note-body" placeholder='Note goes here!' value={note.body} onChange={handleChange}>
             </textarea>
          </div>
 
          <div className="screen-buttons">
            <button onClick={() => validNote()}> {selectedNote ? "Update - Note!" : "Save - Note"}</button>
            <button id="clear-button" onClick={()=>{if(confirm("Are you sure you want delete all notes?!"))clearNotes()}}>Clear - Notes</button>

          </div>
            
        </div>
        </>
  )
}

export default MainScreen