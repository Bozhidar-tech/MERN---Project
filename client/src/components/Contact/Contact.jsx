import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function Contact({ property }) {
  const { t } = useTranslation();
  const [landlord, setLandlord] = useState(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${property.userRef}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          return;
        }
        setLandlord(data);
        setError(false);
      } catch (error) {
        setError(true);
      }
    };
    fetchLandlord();
  }, [property.userRef]);

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2 text-white">
          <p>
            {t('contactLandlord', { username: landlord.username, propertyTitle: property.title })}
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder={t('messagePlaceholder')}
            className="w-full border p-3 rounded-lg text-black"
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${property.title}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            {t('sendMessage')}
          </Link>
        </div>
      )}
    </>
  );
}
