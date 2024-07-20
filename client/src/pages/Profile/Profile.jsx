import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { app } from "../../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteFailure,
  deleteStart,
  deleteSuccess,
  logoutStart,
  logoutFailure,
  logoutSuccess,
} from "../../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileInput = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [deletePropertyError, setDeletePropertyError] = useState(false);
  const [successfulUpdate, setSuccessfulUpdate] = useState(false);
  const [formData, setFormData] = useState({});
  const [loadingState, setLoadingState] = useState(false);
  const [propertiesError, setPropertiesError] = useState(false);
  const [myProperties, setMyProperties] = useState([]);
  const dispatch = useDispatch();
  const [propertiesVisible, setPropertiesVisible] = useState(false);

  

  useEffect(() => {
    if (file) {
      imageUploadHandler(file);
    }
  }, [file]);

  const imageUploadHandler = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData((prevData) => ({ ...prevData, image: downloadURL }))
        );
      }
    );
  };

  const changesHandler = (e) => {
    setFormData((prevData) => ({ ...prevData, [e.target.id]: e.target.value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoadingState(true);
    setTimeout(async () => {
      try {
        dispatch(updateStart());
        const updateInfo = await fetch(`/api/user/update/${currentUser._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await updateInfo.json();
        if (data.success === false) {
          dispatch(
            updateFailure(data.message || "Update failed. Please try again.")
          );
          setLoadingState(false);
          return;
        }
        dispatch(updateSuccess(data));
        setSuccessfulUpdate(true);
      } catch (error) {
        dispatch(updateFailure(error.message));
      }
      setLoadingState(false);
    }, 500);
  };

  const deleteHandler = async () => {
    try {
      dispatch(deleteStart());
      const deleteUser = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await deleteUser.json();
      if (data.success === false) {
        dispatch(
          deleteFailure(data.message || "Delete failed. Please try again.")
        );
      }
      dispatch(deleteSuccess(data));
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };

  const logoutHandler = async () => {
    try {
      dispatch(logoutStart);
      const logoutUser = await fetch("/api/auth/logout");
      const data = await logoutUser.json();
      if (data.success === false) {
        dispatch(
          logoutFailure(data.message || "Logout failed. Please try again.")
        );
        return;
      }
      dispatch(logoutSuccess(data));
    } catch (error) {
      dispatch(logoutFailure(error.message));
    }
  };

  const deletePropertyHandler = async (propertyId) => {
    try {
      setLoadingState(true);
      setDeletePropertyError(false);

      const res = await fetch(`/api/property/delete/${propertyId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      setLoadingState(false);

      if (data.success === false) {
        setDeletePropertyError(data.message || "Failed to delete property. Please try again.");
        return;
      }
      setMyProperties((prev) => prev.filter((property) => property._id !== propertyId));
      alert('Property deleted successfully');
    } catch (error) {
      setLoadingState(false);
      setDeletePropertyError(error.message || "An unexpected error occurred. Please try again later.");
    }
  };

  const showMyProperties = async () => {
    try {
      setPropertiesError(false);
      const properties = await fetch(`/api/user/properties/${currentUser._id}`);
      const data = await properties.json();
      if (data.success === false) {
        setPropertiesError(true);
        return;
      }

      setMyProperties(data);
    } catch (error) {
      setPropertiesError(true);
    }
  };

  const togglePropertiesVisibility = () => {
    setPropertiesVisible(!propertiesVisible);
    // Call showMyProperties only when properties are being shown
    if (!propertiesVisible) {
      showMyProperties();
    }
  };



  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Моят профил</h1>
      <form onSubmit={submitHandler} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileInput}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileInput.current.click()}
          src={formData.image || currentUser.image}
          alt="avatar"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {uploadError ? (
            <span className="text-red-700">
              Грешка при качването на снимка.(Размерът трябва да е под 2MB)
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePercentage}%`}</span>
          ) : filePercentage === 100 ? (
            <span className="text-green-700">Снимката е качена успешно!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="Име"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={changesHandler}
        />
        <input
          type="text"
          placeholder="Email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={changesHandler}
        />
        <input
          type="password"
          placeholder="Парола"
          id="password"
          className="border p-3 rounded-lg"
          onChange={changesHandler}
        />
        <button
          disabled={loading || loadingState}
          className="text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          style={{ backgroundColor: "#00B98E" }}
        >
          {loadingState ? "Зареждане..." : "Промени данните"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/add-property"}
        >
          Добави обява
        </Link>
      </form>
      <div className="flex justify-between mt-5 space-x-4">
        <span
          onClick={deleteHandler}
          className="text-red-700 cursor-pointer hover:text-red-800 font-semibold py-2 px-4 border border-red-700 rounded-lg hover:bg-red-100 transition duration-300"
        >
          Изтриване на акаунта
        </span>
        <span
          onClick={logoutHandler}
          className="text-blue-700 cursor-pointer hover:text-blue-800 font-semibold py-2 px-4 border border-blue-700 rounded-lg hover:bg-blue-100 transition duration-300"
        >
          Изход
        </span>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {successfulUpdate && (
        <p className="text-green-700">Информацията е променена успешно</p>
      )}
      <button
        onClick={togglePropertiesVisibility}
        className="text-white font-bold my-3 py-2 px-4 rounded-lg w-full hover:bg-green-700 transition duration-300"
        style={{ backgroundColor: "#00B98E" }}
      >
        {propertiesVisible ? 'Скрий обявите' : 'Преглед на обявите'}
      </button>
      {propertiesVisible && (
        <>
          {propertiesError && (
            <p className="text-red-500">
              Неуспешно зареждане на обявите. Моля, опитайте отново.
            </p>
          )}

          {myProperties && myProperties.length > 0 ? (
            <div className='flex flex-col gap-4'>
              <h1 className='text-center mt-7 text-2xl font-semibold'>
                Моите обяви
              </h1>
              {myProperties.map((property) => (
                <div
                  key={property._id}
                  className='border rounded-lg p-3 flex justify-between items-center gap-4'
                >
                  <Link to={`/property/${property._id}`}>
                    <img
                      src={property.images[0]}
                      alt='property image'
                      className='h-16 w-16 object-contain'
                    />
                  </Link>
                  <Link
                    className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                    to={`/property/${property._id}`}
                  >
                    <p>{property.title}</p>
                  </Link>

                  <div className='flex flex-col item-center'>
                    <button
                      onClick={() => deletePropertyHandler(property._id)}
                      className='text-red-700 uppercase'
                    >
                      Изтриване на имота
                    </button>
                    <Link to={`/edit-property/${property._id}`}>
                      <button className='text-green-700 uppercase'>Промяна на данните</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-500">Няма намерени обяви.</p>
          )}
        </>
      )}
    </div>
  );
}
