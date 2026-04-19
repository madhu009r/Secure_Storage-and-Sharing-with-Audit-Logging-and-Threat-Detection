import React, { useRef, useState } from 'react';
export default function FileDropzone({ onFiles, disabled=false }){
  const fileRef = useRef();
  const [dragging, setDragging] = useState(false);
  const blockedExtensions = ['exe','bat','cmd'];
  function handleFiles(fileList){
    const files = Array.from(fileList);
    const blocked = files.filter(f => blockedExtensions.includes(f.name.split('.').pop().toLowerCase()));
    if (blocked.length) return onFiles({ ok:false, error: `Blocked file types: ${blocked.map(b=>b.name).join(', ')}` });
    onFiles({ ok:true, files });
  }
  return (
    <div onDragOver={(e)=>{ e.preventDefault(); setDragging(true); }} onDragLeave={()=>setDragging(false)}
      onDrop={(e)=>{ e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      className={`p-4 border rounded ${dragging? 'border-dashed':''}`}>
      <input ref={fileRef} type="file" className="hidden" onChange={e=>handleFiles(e.target.files)} />
      <p>Drag & drop files here or <button type="button" onClick={()=>fileRef.current.click()} className="underline">browse</button></p>
      <p className="text-sm text-gray-500">Blocked: .exe .bat .cmd</p>
    </div>
  );
}
