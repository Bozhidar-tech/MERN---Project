import React from 'react'

export default function Search() {
  return (
    <div className='flex flex-col md:flex-row'>
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className='flex flex-col gap-8'>
            <div className="flex items-center gap-2">
                <label className='whitespace-nowrap font-semibold'>Search Term</label>
                <input type="text"
                id='searchTerm'
                placeholder='Search...'
                className='border rounded-lg p-3 w-full' />
            </div>
            <div className="flex gap-2 flex-wrap items-center">
                <label className='font-semibold'>Type:</label>
                <div className="flex gap-2">
                    <input type="checkbox" id='all' className='w-5'/>
                    <span>House & Apartment</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id='house' className='w-5'/>
                    <span>House</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id='apartment' className='w-5'/>
                    <span>Apartment</span>
                </div>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
                <label className='font-semibold'>Amenities:</label>
                <div className="flex gap-2">
                    <input type="checkbox" id='furnished' className='w-5'/>
                    <span>Furnished</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id='gas' className='w-5'/>
                    <span>Gas</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id='electricity' className='w-5'/>
                    <span>Electricity</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id='parking' className='w-5'/>
                    <span>Parking</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <label className='font-semibold'>Sort by:</label>
                <select className='border rounded-lg p-3' id="sort_order">
                    <option value="">Price High to Low</option>
                    <option value="">Price Low to High</option>
                    <option value="">Latest</option>
                    <option value="">Oldest</option>
                </select>
            </div>
            <button className='text-white p-3 rounded-lg uppercase hover:opacity-95' style={{ background: '#00B98E' }}>Search</button>
        </form>
      </div>
      <div className="">
        <h1 className='text-3xl font-semibold border-b p-3 mt-5'style={{ color: '#00B98E' }}>Properties List:</h1>
      </div>
    </div>
  )
}
