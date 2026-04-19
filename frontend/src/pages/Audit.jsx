import React, { useEffect, useState } from 'react';
import api from '../api/axios';
export default function Audit(){
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ action:'', user:'' });
  async function fetch(){ const params = {}; if (filters.action) params.action = filters.action; if (filters.user) params.user = filters.user; const res = await api.get('/api/audit/logs', { params }); setLogs(res.data || []); }
  useEffect(()=>{ fetch(); }, []);
  return (
    <div className="p-4">
      <h2 className="text-xl">Audit Logs</h2>
      <div className="mb-2">
        <input placeholder="user" onChange={e=>setFilters(f=>({...f, user: e.target.value}))} className="border p-1 mr-2" />
        <select onChange={e=>setFilters(f=>({...f, action: e.target.value}))} className="border p-1 mr-2">
          <option value="">All</option><option value="UPLOAD">UPLOAD</option><option value="DOWNLOAD">DOWNLOAD</option><option value="SHARE">SHARE</option>
        </select>
        <button onClick={fetch} className="btn-primary">Apply</button>
      </div>
      <div className="bg-white rounded shadow p-2">
        <table className="w-full text-left"><thead><tr><th>User</th><th>File</th><th>Action</th><th>Time</th><th>txHash</th></tr></thead>
          <tbody>{logs.map(l=> (<tr key={`${l.timestamp}-${l.fileId}`} className="border-t"><td>{l.username}</td><td>{l.fileId}</td><td>{l.action}</td><td>{new Date(l.timestamp).toLocaleString()}</td><td>{l.txHash ? <a href={`https://explorer.example/${l.txHash}`} target="_blank" rel="noreferrer">{l.txHash}</a> : '—'}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}
