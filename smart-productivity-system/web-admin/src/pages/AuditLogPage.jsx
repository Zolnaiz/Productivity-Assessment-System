import React,{useEffect,useState} from 'react';
import { getToken } from '../services/api';
export default function AuditLogPage(){ const [rows,setRows]=useState([]); useEffect(()=>{ fetch('http://localhost:5000/audit',{headers:{Authorization:`Bearer ${getToken()}`}}).then(r=>r.json()).then(d=>setRows(d.data||[])); },[]); return <div><h2>Audit Log</h2><ul>{rows.map(r=><li key={r.id}>{r.action}</li>)}</ul></div>; }
