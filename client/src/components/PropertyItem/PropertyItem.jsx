import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function PropertyItem({ property }) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <Link to={`/property/${property._id}`}>
        <img
          src={
            property.images[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='property cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='truncate text-lg font-semibold text-slate-700'>
            {property.title}
          </p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <p className='text-sm text-gray-600 truncate w-full'>
              {property.location}
            </p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>
            {property.description}
          </p>
          <div className='text-slate-700 flex gap-4'>
            <div className='font-bold text-xs'>
              {property.bedrooms > 1
                ? `${property.bedrooms} спални `
                : `${property.bedrooms} спалня `}
            </div>
            <div className='font-bold text-xs'>
              {property.bathrooms > 1
                ? `${property.bathrooms} бани `
                : `${property.bathrooms} баня `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
