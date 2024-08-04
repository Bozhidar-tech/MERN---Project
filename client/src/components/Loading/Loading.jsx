import React from 'react';
import { useTranslation } from 'react-i18next';
import './Loading.css';

export default function Loading() {
  const { t } = useTranslation();

  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">{t('loadingText')}</p>
    </div>
  );
};