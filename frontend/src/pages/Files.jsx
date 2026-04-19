import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import FileDropzone from '../components/FileDropzone';
import FileCard from '../components/FileCard';
export default function Files(){
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  async function fetchFiles(){ setLoading(true); try{ const res = await api.get('/api/files'); setFiles(res.data || []); }catch(err){ console.error(err); } finally{ setLoading(false); } }
  useEffect(()=>{ fetchFiles(); }, []);
  async function handleDrop({ ok, files: f, error }){ if (!ok) return alert(error); const fd = new FormData(); fd.append('file', f[0]); setUploading(true); try{ await api.post('/api/files/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); alert('Uploaded'); fetchFiles(); }catch(err){ alert('Upload failed: ' + (err.response?.data?.message || err.message)); } finally{ setUploading(false); } }
  async function downloadFile(id, name){ try{ const res = await api.get(`/api/files/${id}/download`, { responseType: 'arraybuffer' }); const blob = new Blob([res.data]); const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url); }catch(err){ alert('Download failed: ' + (err.response?.data?.message || err.message)); } }
  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">My Files</h2>
      <div className="mb-4"><FileDropzone onFiles={handleDrop} /></div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {files.map(f => <FileCard key={f.id} file={f} onDownload={()=>downloadFile(f.id, f.originalFileName)} onOpenShare={()=>{window.location='/share'}} />)}
      </div>
    </div>
  );
}
