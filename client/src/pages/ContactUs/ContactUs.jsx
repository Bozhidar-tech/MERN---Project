import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/user/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuccess(data.message);
      setFormData({ username: '', email: '', message: '' }); // Reset form fields
    } catch (err) {
      setError(`Failed to send message: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto">
      <section className="bg-gray-100 p-8 rounded-lg shadow-md mb-12">
        <h2 className="text-3xl font-bold mb-6 text-slate-800 text-center">Контактна форма</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="username" className="block text-lg font-semibold text-slate-700 mb-2">Име</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-lg font-semibold text-slate-700 mb-2">Имейл</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-lg font-semibold text-slate-700 mb-2">Съобщение</label>
            <textarea
              id="message"
              name="message"
              rows="6"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            ></textarea>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-teal-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-teal-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Изпращане...' : 'Изпрати'}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {success && <p className="text-green-500 text-center mt-4">{success}</p>}
      </section>

      {/* Contact Info Section */}
      <section className="mb-12 text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">Информация за Контакт</h2>
        <div className="flex flex-col md:flex-row md:justify-center gap-8">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md flex items-center text-left">
            <FaMapMarkerAlt className="text-teal-500 text-2xl mr-4" />
            <div>
              <p className="text-slate-700">Sofia, Bulgaria</p>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md flex items-center text-left">
            <FaPhone className="text-teal-500 text-2xl mr-4" />
            <div>
              <p className="text-slate-700">+012 345 67890</p>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md flex items-center text-left">
            <FaEnvelope className="text-teal-500 text-2xl mr-4" />
            <div>
              <p className="text-slate-700">mailsender@abv.bg</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-slate-800 text-center">Нашето Местоположение</h2>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <iframe
            title="Company Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253143.26205108654!2d23.1759!3d42.6977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14aa8d5b3d6bb8d9%3A0x91f89b2d9c92a535!2sSofia%2C%20Bulgaria!5e0!3m2!1sen!2sus!4v1632785518457!5m2!1sen!2sus"
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
