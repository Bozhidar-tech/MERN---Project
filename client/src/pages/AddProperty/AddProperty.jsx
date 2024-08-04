import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import React, { useState } from "react";
import { app } from "../../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function AddProperty() {
  const { t } = useTranslation();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    bathrooms: 0,
    bedrooms: 0,
    furnished: false,
    parking: false,
    gas: false,
    electricity: false,
    type: "house",
    images: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const navigate = useNavigate();

  const imageSubmitHandler = (e) => {
    if (files.length === 0) {
      setImageUploadError(t('formError'));
      setUploading(false);
      return;
    }

    if (files.length > 0 && files.length + formData.images.length < 11) {
      setUploading(true);
      setImageUploadError(false);
      const uploadedImages = [];

      for (let i = 0; i < files.length; i++) {
        uploadedImages.push(storedImages(files[i]));
      }

      Promise.all(uploadedImages)
        .then((urls) => {
          setFormData({
            ...formData,
            images: formData.images.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError(t('imageUploadError'));
          setUploading(false);
        });
    } else {
      setImageUploadError(t('uploadImagesLimit'));
      setUploading(false);
    }
  };

  const storedImages = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const imageDeleteHandler = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const changesHandler = (e) => {
    if (e.target.id === "house" || e.target.id === "apartment") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "furnished" ||
      e.target.id === "parking" ||
      e.target.id === "gas" ||
      e.target.id === "electricity"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      if (formData.images.length < 1)
        return setError(t('formError'));
      setLoadingState(true);
      setError(false);
      const data = await fetch("/api/property/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const responseData = await data.json();
      setLoadingState(false);
      if (responseData.success === false) {
        setError(responseData.message);
      }
      navigate(`/property/${responseData._id}`);
    } catch (error) {
      setError(error.message);
      setLoadingState(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <main className="p-6 max-w-4xl mx-auto bg-gray-700 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-center my-8 text-teal-400">
          {t('addPropertyTitle')}
        </h1>
  
        <form onSubmit={submitHandler} className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col flex-1 gap-6">
            <input
              type="text"
              placeholder={t('titlePlaceholder')}
              className="border p-4 rounded-md shadow-sm border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              id="title"
              maxLength="50"
              minLength="10"
              required
              onChange={changesHandler}
              value={formData.title}
            />
            <textarea
              placeholder={t('descriptionPlaceholder')}
              className="border p-4 rounded-md shadow-sm border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              id="description"
              maxLength="10000"
              minLength="10"
              required
              onChange={changesHandler}
              value={formData.description}
            />
            <input
              type="text"
              placeholder={t('locationPlaceholder')}
              className="border p-4 rounded-md shadow-sm border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              id="location"
              maxLength="300"
              minLength="10"
              required
              onChange={changesHandler}
              value={formData.location}
            />
  
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="house"
                  className="w-5 h-5 text-teal-500"
                  onChange={changesHandler}
                  checked={formData.type === "house"}
                />
                <span className="text-white">{t('house')}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="apartment"
                  className="w-5 h-5 text-teal-500"
                  onChange={changesHandler}
                  checked={formData.type === "apartment"}
                />
                <span className="text-white">{t('apartment')}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5 h-5 text-teal-500"
                  onChange={changesHandler}
                  checked={formData.furnished}
                />
                <span className="text-white">{t('furnished')}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5 h-5 text-teal-500"
                  onChange={changesHandler}
                  checked={formData.parking}
                />
                <span className="text-white">{t('parking')}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="gas"
                  className="w-5 h-5 text-teal-500"
                  onChange={changesHandler}
                  checked={formData.gas}
                />
                <span className="text-white">{t('gas')}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="electricity"
                  className="w-5 h-5 text-teal-500"
                  onChange={changesHandler}
                  checked={formData.electricity}
                />
                <span className="text-white">{t('electricity')}</span>
              </div>
            </div>
  
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <input
                  className="p-4 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  type="number"
                  id="bedrooms"
                  min="1"
                  required
                  onChange={changesHandler}
                  value={formData.bedrooms}
                />
                <div>
                  <p className="text-white">{t('bedrooms')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  className="p-4 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  type="number"
                  id="bathrooms"
                  min="1"
                  required
                  onChange={changesHandler}
                  value={formData.bathrooms}
                />
                <p className="text-white">{t('bathrooms')}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  className="p-4 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  type="text"
                  id="price"
                  required
                  onChange={changesHandler}
                  value={formData.price}
                />
                <div className="flex flex-col items-center">
                  <p className="text-white">{t('price')}</p>
                  <span className="text-xs text-white">({t('priceCurrency')})</span>
                </div>
              </div>
            </div>
          </div>
  
          <div className="flex flex-col flex-1 gap-6">
            <p className="font-semibold text-white">
              {t('uploadImages')}
              <span className="font-normal text-gray-400 ml-2">
                {t('uploadImagesLimit')}
              </span>
            </p>
  
            <div className="flex gap-4">
              <input
                onChange={(e) => setFiles(e.target.files)}
                className="p-4 border border-gray-600 rounded-md w-full shadow-sm bg-gray-800 text-white"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                type="button"
                disabled={uploading}
                onClick={imageSubmitHandler}
                className="p-4 bg-teal-500 text-white rounded-md uppercase hover:bg-teal-600 disabled:opacity-80"
              >
                {uploading ? t('uploading') : t('uploadButton')}
              </button>
            </div>
            {imageUploadError && (
              <div className="text-red-500">{imageUploadError}</div>
            )}
            {formData.images.length > 0 &&
              formData.images.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between p-3 border border-gray-600 items-center bg-gray-800 rounded-md"
                >
                  <img
                    src={url}
                    alt="property image"
                    className="w-20 h-20 object-contain rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => imageDeleteHandler(index)}
                    className="p-3 text-red-500 rounded-md uppercase hover:opacity-75"
                  >
                    {t('deleteButton')}
                  </button>
                </div>
              ))}
            <button
              disabled={loadingState || uploading}
              className="p-4 bg-slate-700 text-white rounded-md uppercase hover:bg-slate-800 disabled:opacity-80"
            >
              {loadingState ? t('uploading') : t('submitButton')}
            </button>
            {error && <div className="text-red-500">{error}</div>}
          </div>
        </form>
      </main>
    </div>
  );  
}
