import React from 'react';

export default function ConfirmModal({ open, title = '', message = '', onConfirm = ()=>{}, onCancel = ()=>{} }){
  if(!open) return null;
  return (
    <div className="confirm-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="confirm-box">
        <h3 id="confirm-title">{title}</h3>
        <p className="muted">{message}</p>
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn primary" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
