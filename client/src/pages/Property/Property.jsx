import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../../components/Contact/Contact";
import { useTranslation } from 'react-i18next';

export default function Property() {
  SwiperCore.use([Navigation]);
  const { t } = useTranslation();
  const [property, setProperty] = useState(null);
  const [loadingState, setLoadingState] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoadingState(true);
        const res = await fetch(`/api/property/get/${params.propertyId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoadingState(false);
          return;
        }
        setProperty(data);
        setLoadingState(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoadingState(false);
      }
    };
    fetchProperty();
  }, [params.propertyId]);

  return (
    <main>
      {loadingState && <p className="text-center my-7 text-2xl">{t('loading')}</p>}
      {error && <p className="text-center my-7 text-2xl">{t('unexpected_error')}</p>}
      {property && !loadingState && !error && (
        <div>
          <Swiper navigation>
            {property.images.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              {t('link_copied')}
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className='text-2xl font-semibold text-white'>
              {property.title} - € {property.price.toLocaleString('en-US')}
            </p>

            <p className="flex items-center mt-6 gap-2 text-white text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {property.location}
            </p>

            <div className="flex gap-4">
              <p className="bg-green-700 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {property.type === "house" ? t('property_type_house') : t('property_type_apartment')}
              </p>
            </div>

            <p className="text-white">
              <span className="font-semibold">{t('description_label')} </span>
              {property.description}
            </p>

            <ul className="text-white font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg " />
                {property.bedrooms > 1
                  ? `${property.bedrooms} ${t('bedrooms_label')} `
                  : `${property.bedrooms} ${t('bedrooms_label')} `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {property.bathrooms > 1
                  ? `${property.bathrooms} ${t('bathrooms_label')} `
                  : `${property.bathrooms} ${t('bathrooms_label')} `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {property.parking ? t('parkingProperty') : t('no_parking')}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {property.furnished ? t('furnished') : t('unfurnished')}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {property.electricity ? t('heating') : t('no_heating')}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {property.gas ? t('gasProperty') : t('no_gas')}
              </li>
            </ul>
            {currentUser && property.userRef !== currentUser._id && !contact && (
              <button onClick={() => setContact(true)} className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95">
                {t('contact_owner')}
              </button>
            )}
            {contact && <Contact property={property}/>}
          </div>
        </div>
      )}
    </main>
  );
}
