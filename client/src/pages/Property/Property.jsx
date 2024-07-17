import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';


export default function Property() {
    SwiperCore.use([Navigation]);
    const [property, setProperty] = useState(null);
    const [loadingState, setLoadingState] = useState(false);
    const [error, setError] = useState(false);
    const params = useParams();

    useEffect(() => {

        const fetchProperty = async () => {
            try {
                setLoadingState(true);
                const res = await fetch(`/api/property/get/${params.propertyId}`);
                const data = await res.json();
                if(data.success === false){
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
    <main className=''>
      {loadingState && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-center my-7 text-2xl'>An error occurred.</p>}
      {property && !loadingState && !error && (
        <div>
            <Swiper navigation>
                {property.images.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
            </Swiper>
        </div>
      )}
    </main>
  )
}
