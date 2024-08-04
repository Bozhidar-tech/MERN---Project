import React from 'react';
import { FaTwitter, FaFacebookF, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
import { MdLocationOn, MdPhone, MdEmail } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white pt-5 mt-5">
      <div className="container mx-auto py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 border-t-2 border-teal-400">
          
          <div className="px-4">
            <h5 className="text-teal-400 text-xl mb-4">{t('contactUs')}</h5>
            <div className="flex items-center mb-2">
              <MdLocationOn size={18} className="mr-2" />
              <p className="mb-0">{t('address')}</p>
            </div>
            <div className="flex items-center mb-2">
              <MdPhone size={18} className="mr-2" />
              <p className="mb-0">{t('phone')}</p>
            </div>
            <div className="flex items-center mb-2">
              <MdEmail size={18} className="mr-2" />
              <p className="mb-0">{t('email')}</p>
            </div>
            <div className="flex mt-4">
              <a className="text-teal-400 mr-2" href="/" aria-label="Twitter"><FaTwitter size={20} /></a>
              <a className="text-teal-400 mr-2" href="/" aria-label="Facebook"><FaFacebookF size={20} /></a>
              <a className="text-teal-400 mr-2" href="/" aria-label="YouTube"><FaYoutube size={20} /></a>
              <a className="text-teal-400" href="/" aria-label="LinkedIn"><FaLinkedinIn size={20} /></a>
            </div>
          </div>
  
          <div className="px-4">
            <h5 className="text-teal-400 text-xl mb-4">{t('dynamicLinks')}</h5>
            <a href="/about" className="block mb-2 hover:text-teal-400">{t('aboutUs')}</a>
            <a href="/" className="block mb-2 hover:text-teal-400">{t('ourServices')}</a>
            <a href="/terms&conditions" className="block mb-2 hover:text-teal-400">{t('termsConditions')}</a>
          </div>
        </div>
      </div>
  
      <div className="container mx-auto py-4 border-t-2 border-teal-400">
        <div className="flex flex-col md:flex-row justify-center items-center text-center">
          <div className="mb-3 md:mb-0">
            © <a href="/" className="border-b border-teal-400">{t('companyName')}</a>, {t('allRightsReserved')}
          </div>
          <div className="flex mt-2 md:ml-4">
            <a href="/" className="block mb-2 md:mb-0 md:ml-4 hover:text-teal-400">{t('help')}</a>
            <a href="/" className="block mb-2 md:mb-0 md:ml-4 hover:text-teal-400">{t('faq')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
