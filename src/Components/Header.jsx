import React from 'react'
import './Header.css'

const Header = ({exportNotes}) => {
  return (
    <>
    <div className="notes-header">
        <p onClick={exportNotes}>Export Notes</p>
        <h1>React Notes</h1>
    </div>
    </>
  )
}

export default Header