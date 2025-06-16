import React from "react";

export default function Loader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      zIndex: 9999
    }}>
      <div style={{
        width: 64,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24
      }}>
        <span style={{
          display: 'inline-block',
          width: 56,
          height: 56,
          border: '6px solid #dbeafe',
          borderTop: '6px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
      <div style={{
        color: '#64748b',
        fontSize: '1.18rem',
        fontWeight: 500,
        letterSpacing: 0.2,
        textAlign: 'center',
        opacity: 0.85
      }}>
        Even geduld...
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 