import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { app } from '../../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AddProperty() {
  const { t } = useTranslation();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bathrooms: 0,
    bedrooms: 0,
    furnished: false,
    parking: false,
    gas: false,
    electricity: false,
    type: 'house',
    images: [],
  });
  const [imageUploadError, setImageUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loadingState, setLoadingState] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertyId = params.propertyId;
        const res = await fetch(`/api/property/get/${propertyId}`);
        const data = await res.json();
        if (data.success === false) {
          console.error(data.message);
          return;
        }
        setFormData(data);
      } catch (error) {
        console.error('Error fetching property:', error);
      }
    };

    fetchProperty();
  }, [params.propertyId]);

  const imageSubmitHandler = async () => {
    if (files.length === 0) {
      setImageUploadError(t('minimumOneImage'));
      return;
    }

    if (files.length + formData.images.length > 10) {
      setImageUploadError(t('imageLimit'));
      return;
    }

    setUploading(true);
    setImageUploadError('');

    try {
      const uploadedImages = await Promise.all(
        Array.from(files).map((file) => storedImages(file))
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
    } catch (error) {
      setImageUploadError(t('uploadFailed'));
    } finally {
      setUploading(false);
    }
  };

  const storedImages = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
        },
        (error) => reject(error),
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  const imageDeleteHandler = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const changesHandler = (e) => {
    const { id, type, checked, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (formData.images.length < 1) {
      setError(t('minimumOneImage'));
      return;
    }

    setLoadingState(true);
    setError('');

    try {
      const response = await fetch(`/api/property/edit/${params.propertyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await response.json();

      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/property/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <main className="p-6 max-w-4xl mx-auto bg-gray-700 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-center my-8 text-teal-400">
          {t('editProperty')}
        </h1>

        <form onSubmit={submitHandler} className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col flex-1 gap-6">
            <input
              type="text"
              placeholder={t('title')}
              className="border p-4 rounded-md shadow-sm border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              id="title"
              maxLength="50"
              minLength="10"
              required
              onChange={changesHandler}
              value={formData.title || ''}
            />
            <textarea
              placeholder={t('description')}
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
              placeholder={t('location')}
              className="border p-4 rounded-md shadow-sm border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              id="location"
              maxLength="30"
              minLength="10"
              required
              onChange={changesHandler}
              value={formData.location}
            />

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="house"
                  name="type"
                  className="w-5 h-5 text-teal-500"
                  onChange={changesHandler}
                  checked={formData.type === 'house'}
                />
                <span className="text-white">{t('house')}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="apartment"
                  name="type"
                  className="w-5 h-5 text-teal-500"
                  onChange={changesHandler}
                  checked={formData.type === 'apartment'}
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
                  <span className="text-xs text-white">( € )</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1 gap-6">
            <p className="font-semibold text-white">
              {t('imageUpload')}
              <span className="font-normal text-gray-400 ml-2">
                {t('imageUploadHint')}
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
                {uploading ? t('uploading') : t('uploadImages')}
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
                    {t('deletePhoto')}
                  </button>
                </div>
              ))}
            <button
              disabled={loadingState || uploading}
              className="p-4 bg-teal-500 text-white rounded-md uppercase hover:bg-teal-600 disabled:opacity-80"
            >
              {loadingState ? t('savingChanges') : t('saveChanges')}
            </button>
            {error && <div className="text-red-500">{error}</div>}
          </div>
        </form>
      </main>
    </div>
  );
}
