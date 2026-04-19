import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import io from 'socket.io-client';
export default function Threats(){
  const [alerts, setAlerts] = useState([]);
  useEffect(()=>{
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    let socket;
    if (socketUrl){
      socket = io(socketUrl, { transports: ['websocket'] });
      socket.on('threat_alert', (d) => setAlerts(prev => [d, ...prev]));
    }
    let mounted = true;
    const poll = async ()=>{ try{ const res = await api.get('/api/threats'); if (mounted) setAlerts(res.data || []); }catch(err){} };
    if (!socket){ poll(); const id = setInterval(poll, 15000); return ()=>{ mounted=false; clearInterval(id); if (socket) socket.disconnect(); } }
    return ()=> socket.disconnect();
  }, []);
  return (
    <div className="p-4">
      <h2 className="text-xl">Threats & Alerts</h2>
      <ul>{alerts.map(a=> (<li key={a.id} className={`p-2 mb-2 border ${a.riskScore>80 ? 'border-red-600':''}`}><div><strong>{a.type}</strong> by {a.username} at {new Date(a.timestamp).toLocaleString()}</div><div>Risk: {a.riskScore}</div><div>{a.details}</div><div className="mt-2"><button onClick={()=>api.post('/api/threats/acknowledge', { id: a.id })}>Acknowledge</button></div></li>))}</ul>
    </div>
  );
}
