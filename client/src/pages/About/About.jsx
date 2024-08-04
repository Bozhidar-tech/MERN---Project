import React from "react";
import { useTranslation } from 'react-i18next';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="py-20 px-4 max-w-6xl mx-auto">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
        <div className="relative text-center text-white py-12 px-4">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: "#00B98E" }}
          >
            {t('aboutHeader')}
          </h1>
          <p className="text-xl mb-8">
            {t('aboutSubtitle')}
          </p>
          <a
            href="/contact"
            className="inline-block bg-teal-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-teal-600"
          >
            {t('contactUs')}
          </a>
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-white">{t('ourMission')}</h2>
        <p className="mb-4 text-white">
          {t('aboutMission1')}
        </p>
        <p className="mb-4 text-white">
          {t('aboutMission2')}
        </p>
        <p className="mb-4 text-white">
          {t('aboutMission3')}
        </p>
      </div>
    </div>
  );
}
