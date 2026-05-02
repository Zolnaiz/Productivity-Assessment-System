import React from 'react';
import { downloadTaskReport } from '../services/api';
export default function ExportReportsPage(){ return <div><h2>Export Reports</h2><button onClick={()=>downloadTaskReport('csv')}>Export CSV</button><button onClick={()=>downloadTaskReport('pdf')}>Export PDF</button></div> }
