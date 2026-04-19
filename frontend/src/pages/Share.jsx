import React, { useEffect, useState } from 'react';
import api from '../api/axios';
export default function Share(){
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState('');
  const [expiry, setExpiry] = useState(60);
  const [link, setLink] = useState('');
  useEffect(()=>{ api.get('/api/files').then(r=>setFiles(r.data||[])); }, []);
  async function create(){ if (!selected) return alert('select file'); const res = await api.post(`/api/files/${selected}/share`, { minutesValid: Number(expiry) }); setLink(res.data.link); }
  return (
    <div className="p-4">
      <h2 className="text-xl">Create Share Link</h2>
      <select onChange={e=>setSelected(e.target.value)} className="border p-1 mt-2">
        <option value="">-- select --</option>{files.map(f=> <option key={f.id} value={f.id}>{f.originalFileName}</option>)}
      </select>
      <div className="mt-2">Expires (minutes): <input type="number" value={expiry} onChange={e=>setExpiry(e.target.value)} className="border ml-2 p-1" /></div>
      <button className="btn-primary mt-2" onClick={create}>Create</button>
      {link && <div className="mt-4"><input className="w-full border p-1" readOnly value={link} /><button onClick={()=>navigator.clipboard.writeText(link)} className="mt-2">Copy</button></div>}
    </div>
  );
}
