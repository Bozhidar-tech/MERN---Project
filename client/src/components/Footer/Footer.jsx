import React from 'react';
import { FaTwitter, FaFacebookF, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
import { MdLocationOn, MdPhone, MdEmail} from 'react-icons/md';
export default function Footer(){
    return (
        <div className="bg-dark text-red pt-5 mt-5 animate__animated animate__fadeIn" data-wow-delay="0.1s">
          <div className="container mx-auto py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 border-t border-gray-600">
             
              <div className="px-4">
                <h5 className="text-white mb-4">Get In Touch</h5>
                <div className="flex items-center mb-2">
              <MdLocationOn size={18} className="mr-2" />
              <p className="mb-0 text-black">123 Street, New York, USA</p>
            </div>
            <div className="flex items-center mb-2">
              <MdPhone size={18} className="mr-2" />
              <p className="mb-0 text-black">+012 345 67890</p>
            </div>
            <div className="flex items-center mb-2">
              <MdEmail size={18} className="mr-2" />
              <p className="mb-0 text-black">info@example.com</p>
            </div>
                <div className="flex">
                  <a className="btn btn-outline-light btn-social mr-2" href="/"><FaTwitter /></a>
                  <a className="btn btn-outline-light btn-social mr-2" href="/"><FaFacebookF /></a>
                  <a className="btn btn-outline-light btn-social mr-2" href="/"><FaYoutube /></a>
                  <a className="btn btn-outline-light btn-social" href="/"><FaLinkedinIn /></a>
                </div>
              </div>
    
              
              <div className="px-4">
                <h5 className="text-white mb-4">Quick Links</h5>
                <a href="/about" className="text-white-50 block mb-2">За нас</a>
                <a href="/" className="text-white-50 block mb-2">Нашите услуги</a>
                <a href="/" className="text-white-50 block mb-2">Политика за поверителност</a>
                <a href="/" className="text-white-50 block mb-2">Общи условия</a>
              </div>
            </div>
          </div>
    
          <div className="container mx-auto py-4 border-t border-gray-600">
            <div className="py-4 flex flex-col md:flex-row justify-center items-center text-center">
              <div className="mb-3 md:mb-0">
                © <a href="/" className="border-b border-white">Bozhidar Estate</a>, All Right Reserved.
              </div>
              <div className="footer-menu md:ml-4">
                <a href="/" className="text-white-50 block mb-2 md:inline-block md:mb-0 md:ml-4">Бисктвитки</a>
                <a href="/" className="text-white-50 block mb-2 md:inline-block md:mb-0 md:ml-4">Помощ</a>
                <a href="/" className="text-white-50 block mb-2 md:inline-block md:mb-0 md:ml-4">Често задавани въпроси</a>
              </div>
            </div>
          </div>
        </div>
      );
};