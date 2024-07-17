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
          setErrorMessage('Failed to fetch house properties');
          return;
        }
        const houseData = await houseRes.json();
        setHouseProperties(houseData);

        const apartmentRes = await fetch('/api/property/get?type=apartment&limit=4');
        if (!apartmentRes.ok) {
          setError(true);
          setErrorMessage('Failed to fetch apartment properties');
          return;
        }
        const apartmentData = await apartmentRes.json();
        setApartmentProperties(apartmentData);

        setLoading(false);
      } catch (error) {
        setError(true);
        setErrorMessage('An unexpected error occurred');
        console.error('Error fetching properties:', error.message);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div>
      
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your future <span className='text-slate-500'>home</span>
          <br />
          easily with us
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Bozhidar Estate is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>

      <Swiper navigation>
        {[...houseProperties, ...apartmentProperties].map((property) => (
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
        {loading && <p>Loading...</p>}
        {houseProperties.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Latest Houses</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=house'}>Show more houses</Link>
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
              <h2 className='text-2xl font-semibold text-slate-600'>Latest Apartments</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=apartment'}>Show more apartments</Link>
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
