import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import PropertyItem from '../../components/PropertyItem/PropertyItem';

SwiperCore.use([Navigation]);

export default function Home() {
  const [houseProperties, setHouseProperties] = useState([]);
  const [apartmentProperties, setApartmentProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const houseRes = await fetch('/api/property/get?type=house&limit=4');
        if (!houseRes.ok) {
          setError(true);
          setErrorMessage('Неуспешно зареждане на къщите.');
          return;
        }
        const houseData = await houseRes.json();
        setHouseProperties(houseData);

        const apartmentRes = await fetch('/api/property/get?type=apartment&limit=4');
        if (!apartmentRes.ok) {
          setError(true);
          setErrorMessage('Неуспешно зареждане на апартаментите.');
          return;
        }
        const apartmentData = await apartmentRes.json();
        setApartmentProperties(apartmentData);

        setLoading(false);
      } catch (error) {
        setError(true);
        setErrorMessage('Неочаквана грешка. Моля, опитайте отново');
        console.error('Error fetching properties:', error.message);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div>
      
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Намерете бъдещият си  <span className='text-slate-500'>дом</span>
          <br />
          лесно чрез нашата агенция
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Bozhidar Estate е най-доборото място да намерите бъдещият си дом.
          <br />
          Имаме голям избор на имоти, от които да избирате.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Потърсете вашият дом тук...
        </Link>
      </div>

      <Swiper navigation>
        {[...houseProperties].map((property) => (
          <SwiperSlide key={property._id}>
            <div
              style={{
                background: `url(${property.images[0]}) center no-repeat`,
                backgroundSize: 'cover',
                height: '500px',
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {loading && <p>Зареждане...</p>}
        {houseProperties.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Последно добавени къщи</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=house'}>Покажи повече къщи</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {houseProperties.map((property) => (
                <PropertyItem property={property} key={property._id} />
              ))}
            </div>
          </div>
        )}
        {apartmentProperties.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Последно добавени апаратаменти</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=apartment'}>Покажи повече апаратаменти</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {apartmentProperties.map((property) => (
                <PropertyItem property={property} key={property._id} />
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}
