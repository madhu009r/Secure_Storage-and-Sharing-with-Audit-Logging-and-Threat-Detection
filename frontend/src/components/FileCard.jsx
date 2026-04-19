import React from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
export default function FileCard({ file, onDownload, onOpenShare }){
  return (
    <div className="bg-white rounded-lg2 p-4 shadow-card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium">{file.originalFileName}</h3>
          <p className="text-xs text-neutral-400 mt-1">{file.owner?.username} • {Math.round(file.size/1024)} KB</p>
        </div>
        <div>
          <span className="inline-flex items-center px-2 py-0.5 text-xs rounded bg-neutral-100 text-neutral-700">SAFE</span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-neutral-400">SHA256: <span className="font-mono text-xs">{file.sha256Hash?.slice(0,10)}…</span></div>
        <div className="flex items-center gap-2">
          <button onClick={()=>onOpenShare(file)} className="text-sm px-2 py-1 border rounded text-neutral-600">Share</button>
          <button onClick={()=>onDownload(file)} aria-label={`Download ${file.originalFileName}`} className="btn-primary flex items-center gap-2">
            <ArrowDownTrayIcon className="w-4 h-4" /> Download
          </button>
        </div>
      </div>
    </div>
  );
}
