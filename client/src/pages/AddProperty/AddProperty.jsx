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

export default function AddProperty() {
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
      setImageUploadError("You should upload at least 1 image");
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
          setImageUploadError("Upload failed. (2MB limit exceeded)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 10 images per listing");
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
        return setError("You must upload at least one image");
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
      };
      navigate(`/property/${responseData._id}`);
    } catch (error) {
      setError(error.message);
      setLoadingState(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <main className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-center my-8 text-gray-800">
          Add a Property
        </h1>

        <form
          onSubmit={submitHandler}
          className="flex flex-col sm:flex-row gap-6"
        >
          <div className="flex flex-col flex-1 gap-6">
            <input
              type="text"
              placeholder="Title"
              className="border p-4 rounded-lg shadow-sm"
              id="title"
              maxLength="50"
              minLength="10"
              required
              onChange={changesHandler}
              value={formData.title}
            />
            <textarea
              type="text"
              placeholder="Description"
              className="border p-4 rounded-lg shadow-sm"
              id="description"
              maxLength="10000"
              minLength="10"
              required
              onChange={changesHandler}
              value={formData.description}
            />
            <input
              type="text"
              placeholder="Location"
              className="border p-4 rounded-lg shadow-sm"
              id="location"
              maxLength="30"
              minLength="10"
              required
              onChange={changesHandler}
              value={formData.location}
            />

            <div className="flex gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="house"
                  className="w-5 h-5"
                  onChange={changesHandler}
                  checked={formData.type === "house"}
                />
                <span>House</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="apartment"
                  className="w-5 h-5"
                  onChange={changesHandler}
                  checked={formData.type === "apartment"}
                />
                <span>Apartment</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5 h-5"
                  onChange={changesHandler}
                  checked={formData.furnished}
                />
                <span>Furnished</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5 h-5"
                  onChange={changesHandler}
                  checked={formData.parking}
                />
                <span>Parking Spot</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="gas"
                  className="w-5 h-5"
                  onChange={changesHandler}
                  checked={formData.gas}
                />
                <span>Gas</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="electricity"
                  className="w-5 h-5"
                  onChange={changesHandler}
                  checked={formData.electricity}
                />
                <span>Electricity</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <input
                  className="p-4 border border-gray-300 rounded-lg shadow-sm"
                  type="number"
                  id="bedrooms"
                  min="1"
                  required
                  onChange={changesHandler}
                  value={formData.bedrooms}
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
                  onChange={changesHandler}
                  value={formData.bathrooms}
                />
                <p>Bathrooms</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  className="p-4 border border-gray-300 rounded-lg shadow-sm"
                  type="text"
                  id="price"
                  required
                  onChange={changesHandler}
                  value={formData.price}
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
                onChange={(e) => setFiles(e.target.files)}
                className="p-4 border border-gray-300 rounded w-full shadow-sm"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                type="button"
                disabled={uploading}
                onClick={imageSubmitHandler}
                className="p-4 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            {imageUploadError && (
              <div className="text-red-700">{imageUploadError}</div>
            )}
            {formData.images.length > 0 &&
              formData.images.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between p-3 border items-center"
                >
                  <img
                    src={url}
                    alt="property image"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => imageDeleteHandler(index)}
                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              ))}
            <button disabled={loadingState || uploading} className="p-4 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
              {loadingState ? "Adding Property..." : "Add Property"}
            </button>
            {error && <div className="text-red-700">{error}</div>}
          </div>
        </form>
      </main>
    </div>
  );
}
