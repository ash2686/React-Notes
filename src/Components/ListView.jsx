import React, {useState} from 'react'
import './ListView.css';

const ListView = ({notes,addNote,setSelectedNote,selectedNote,deleteNote,sortBy,setSortBy}) => {

  let [searchString,setSearchString] = useState("");

  function pickNote(note) {
  if (selectedNote && selectedNote.id === note.id) {
    // clicked the same note again → unselect it
    setSelectedNote(null);
  } else {
    // clicked a new note → select it
    setSelectedNote(note);
  }
}

  function delNote(){
     if (!selectedNote) {
              alert("Select a note first!");

              return;
            }
            deleteNote(selectedNote.id);
  }

  let filteredNotes = notes.filter(note=>{
    return(
        note.title.toLowerCase().includes(searchString.toLowerCase()) ||
        note.body.toLowerCase().includes(searchString.toLowerCase())
    )
  })

  return (
    <>
    <div className="left-panel">
      <div className="left-top">
        <button id="add-note" onClick={addNote}>Add - Note</button>
        <input type="text" placeholder='search notes...' value = {searchString} onInput={(e)=>setSearchString(e.target.value)} />
        <div className="sort-block">
            <label htmlFor="sort">Sort Notes</label>
              <select name="sort" id="sort-notes" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="az">A-Z</option>
                <option value="updated">Updated</option>
              </select>
        </div>
              {<p className='no-of-notes'>Number of Notes - <span>{notes.length}</span></p>}
      </div>

      <div className="left-middle">
            {filteredNotes.length>0 ? (
            filteredNotes.map(note=>(
              <div className={`note-entry ${selectedNote && selectedNote.id === note.id ? 'selected-note' : ''}`} key={note.id} onClick={()=>pickNote(note)}>
                <p id="note-title"><span className='tb'>Title </span>{note.title}</p>
                <p id="note-body"><span className='bb'>Note </span>{note.body}</p>
                <div className="time-stamps">
                <p id="note-stamp"><span className='sb'>Created - </span>{note.noteStamp}</p><span>|</span>
                <p id ="update-stamp"><span className='ub'>Updated</span>{note.updateStamp}</p>
                </div>
                <p id="note-id">Note ID - {note.id}</p>
              </div>
            ))
            ):(<p className="no-notes">No notes match your search.</p>
)}
      </div>
      <div className="left-bottom">
        <button onClick={delNote} disabled={!selectedNote}>Delete - Note</button>
      </div>
    </div>
    </>
  )
}

export default ListView