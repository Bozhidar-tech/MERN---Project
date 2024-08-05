import React from 'react';
import { useTranslation } from 'react-i18next';

export default function TermsAndConditions() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <main className="p-6 max-w-4xl mx-auto bg-gray-800 text-white rounded-lg shadow-md mb-6">
        <h1 className="text-4xl font-bold text-center my-8 text-teal-400">
          {t('termsAndConditionsTitle')}
        </h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. {t('introduction')}</h2>
            <p>
              {t('introductionContent')}
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. {t('intellectualPropertyRights')}</h2>
            <p>
              {t('intellectualPropertyRightsContent')}
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. {t('userObligations')}</h2>
            <p>
              {t('userObligationsContent')}
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. {t('limitationOfLiability')}</h2>
            <p>
              {t('limitationOfLiabilityContent')}
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. {t('changesToTerms')}</h2>
            <p>
              {t('changesToTermsContent')}
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">6. {t('contactUs')}</h2>
            <p>
              {t('contactUsContent')}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}