import React, { createContext, useContext, useState } from 'react';
const ToastContext = createContext();
export function useToast(){ return useContext(ToastContext); }
export default function ToastProvider({ children }){
  const [toasts, setToasts] = useState([]);
  function push(t){ const id = Date.now(); setToasts(s=>[...s, { id, ...t }]); setTimeout(()=>setToasts(s=>s.filter(x=>x.id!==id)), 4000); }
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div aria-live="polite" className="fixed bottom-4 right-4 space-y-2">
        {toasts.map(t=>(
          <div key={t.id} className="bg-white p-3 rounded shadow">{t.title && <div className="font-medium">{t.title}</div>}{t.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
