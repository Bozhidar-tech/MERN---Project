import React from "react";

export default function AddProperty() {
  return (
<div className="min-h-screen bg-gray-200 flex items-center justify-center">
  <main className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
    <h1 className="text-4xl font-bold text-center my-8 text-gray-800">
      Add a Property
    </h1>

    <form className="flex flex-col sm:flex-row gap-6">
      <div className="flex flex-col flex-1 gap-6">
        <input
          type="text"
          placeholder="Title"
          className="border p-4 rounded-lg shadow-sm"
          id="title"
          maxLength="50"
          minLength="10"
          required
        />
        <textarea
          placeholder="Description"
          className="border p-4 rounded-lg shadow-sm"
          id="description"
          maxLength="100"
          minLength="10"
          required
        />
        <input
          type="text"
          placeholder="Location"
          className="border p-4 rounded-lg shadow-sm"
          id="location"
          maxLength="30"
          minLength="10"
          required
        />

        <div className="flex gap-6 flex-wrap">
          <label className="flex items-center gap-2">
            <input type="checkbox" id="furnished" className="w-5 h-5" />
            <span>Furnished</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" id="parking" className="w-5 h-5" />
            <span>Parking Spot</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" id="gas" className="w-5 h-5" />
            <span>Gas</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" id="electricity" className="w-5 h-5" />
            <span>Electricity</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <input
              className="p-4 border border-gray-300 rounded-lg shadow-sm"
              type="number"
              id="bedrooms"
              min="1"
              required
            />
            <div>
              <p>Bedrooms</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              className="p-4 border border-gray-300 rounded-lg shadow-sm"
              type="number"
              id="bathrooms"
              min="1"
              required
            />
            <p>Bathrooms</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              className="p-4 border border-gray-300 rounded-lg shadow-sm"
              type="text"
              id="price"
              required
            />
            <div className="flex flex-col items-center">
              <p>Price</p>
              <span className="text-xs">($)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 gap-6">
        <p className="font-semibold">
          Images:
          <span className="font-normal text-gray-500 ml-2">
            The first image will be the cover (max 10)
          </span>
        </p>

        <div className="flex gap-4">
          <input
            className="p-4 border border-gray-300 rounded w-full shadow-sm"
            type="file"
            id="images"
            accept="image/*"
            multiple
          />
          <button className="p-4 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
            Upload
          </button>
        </div>
        <button className="p-4 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          Add Property
        </button>
      </div>
    </form>
  </main>
</div>


  );
}
