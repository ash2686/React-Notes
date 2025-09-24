import React, {useState,useEffect,useRef} from 'react'
import Header from './Components/Header';
import ListView from './Components/ListView';
import MainScreen from './Components/MainScreen';
import './App.css';


const App = () => {

  let GenUid = () =>{
    // let timeStamp = Date.now().toString().substring(0,4);
    // let randomKey = Math.random().toString(36).substring(2,6);
    // return `${timeStamp}-${randomKey}`;

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const idLength = 8;

  for (let i = 0; i < idLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

  let [notes, setNotes] = useState(()=>{
    let storedNotes = localStorage.getItem('myNotes');
    return storedNotes ? JSON.parse(storedNotes) : [];
  });

  let [noteId, setNoteId] = useState(()=>{GenUid();});
  let [selectedNote, setSelectedNote] = useState(null);
  let [sortBy, setSortBy] = useState("newest");
  let clearAndFocusRef = useRef(null);
  let addNoteHandler = useRef(null);
  

  let timeStamp = ()=>{
        let stamp = new Date();
        return{
          display: stamp.toLocaleString(),
          sort: stamp.getTime()
        }
  }

  useEffect(() => {
    // Update local storage whenever 'items' state changes
    localStorage.setItem('myNotes', JSON.stringify(notes));
  }, [notes]);

  function handleSave(newNote){
    let ts = timeStamp();
     if (selectedNote) {
      // update existing note
      setNotes((prev) =>
        prev.map((n) =>
          n.id === selectedNote.id ? { ...n, ...newNote, updateStamp: ts.display } : n
        )
      );
      setSelectedNote(null); // reset after editing
    } else {
      // add new note
      setNotes([
        ...notes,
        { ...newNote, noteStamp: ts.display, id: GenUid(), sortStamp: ts.sort, updateStamp: "No Updates Yet!" },
      ]);
      setNoteId(GenUid());
    }
    // setNotes([...notes,{...newNote,noteStamp: ts.display,id:noteId}]);
    // setNoteId(noteId+1);
    if (clearAndFocusRef.current) {
      clearAndFocusRef.current();
    }
}

function removeNotes(){
     localStorage.removeItem('myNotes');
     setNotes([]);
     setNoteId(GenUid());
}

function deleteNote(id) {
  setNotes(prev => prev.filter(note => note.id !== id));
  setSelectedNote(null); // clear selection if deleted
}

let sortedNotes = [...notes];

if (sortBy === "newest") {
  sortedNotes.sort((a, b) => b.sortStamp - a.sortStamp);
} else if(sortBy === "oldest"){
    sortedNotes.sort((a, b) => a.sortStamp - b.sortStamp);
} else if (sortBy === "updated") {
  sortedNotes.sort((a, b) => {
    let aTime = a.updateStamp === "No Updates Yet!" ? 0 : new Date(a.updateStamp).getTime();
    let bTime = b.updateStamp === "No Updates Yet!" ? 0 : new Date(b.updateStamp).getTime();
    return bTime - aTime;
  });
} else if (sortBy === "az") {
  sortedNotes.sort((a, b) => a.title.localeCompare(b.title));
}

function exportNotes() {
  if(confirm("Are you sure you want to save a new text file!?")){
  let fs = timeStamp();
  const dataStr = JSON.stringify(notes, null, 2); // pretty JSON
  const blob = new Blob([dataStr], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `React-Notes-${fs.display}.txt`; // file name
  link.click();

  URL.revokeObjectURL(url); // cleanup
} 
}

return (
    <>
    <div className="main-container">
              <Header exportNotes={exportNotes}/>
              <div className="bottom">              
              <ListView 
                        notes ={sortedNotes}
                        addNote={()=>addNoteHandler.current && addNoteHandler.current()}
                        setSelectedNote={setSelectedNote}
                        selectedNote = {selectedNote}
                        deleteNote={deleteNote}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
              />
              <MainScreen 
                          saveNote={handleSave} 
                          clearNotes={removeNotes} 
                          onAddNoteHandler={(fn)=>{addNoteHandler.current = fn}} 
                          clearArea={(fn) => (clearAndFocusRef.current = fn)}
                          selectedNote={selectedNote}
              />
              </div>

              
              
    </div>
    </>
  )
}

export default App