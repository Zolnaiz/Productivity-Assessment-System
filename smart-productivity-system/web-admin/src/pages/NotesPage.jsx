import React, { useState } from 'react';
export default function NotesPage(){
  const [notes,setNotes]=useState(()=>JSON.parse(localStorage.getItem('notes')||'[]'));
  const [text,setText]=useState('');
  const add=()=>{ if(!text.trim())return; const next=[{text,at:new Date().toISOString()},...notes]; setNotes(next); localStorage.setItem('notes',JSON.stringify(next)); setText(''); };
  return <div><h2>Notes</h2><input value={text} onChange={e=>setText(e.target.value)} /><button onClick={add}>Add</button><ul>{notes.map((n,i)=><li key={i}>{n.text}</li>)}</ul></div>
}
