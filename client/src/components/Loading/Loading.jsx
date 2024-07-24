import React from 'react';
import './Loading.css';

export default function Loading(){
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">Зареждане...</p>
    </div>
  );
};
