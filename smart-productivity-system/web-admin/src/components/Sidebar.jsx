import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearToken } from '../services/api';

const links = [
  ['dashboard','Dashboard'],['users','Users'],['tasks','Tasks'],['audits','Audits'],['reports','Reports'],
  ['notes','Notes'],['goals','Daily Goals'],['badges','Badges'],['departments','Departments'],['audit-log','Audit Log'],['export','Export']
];

export default function Sidebar(){
  const location = useLocation();
  const navigate = useNavigate();
  return <aside style={{ width:240, background:'#0f172a', color:'white', padding:16 }}><h3>Smart Admin</h3><nav style={{ display:'grid', gap:8 }}>{links.map(([to,label]) => <Link key={to} to={`/${to}`} style={{ color: location.pathname===`/${to}`?'#60a5fa':'white' }}>{label}</Link>)}</nav><button style={{ marginTop: 20 }} onClick={() => { clearToken(); navigate('/login'); }}>Logout</button></aside>
}
