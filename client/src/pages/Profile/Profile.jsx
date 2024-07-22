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
            updateFailure(data.message || "Промяната на данни е неуспешно.")
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
    if (!window.confirm("Сигурни ли сте, че искате да изтриете регистрацията си ?")) {
      return;
    }

    try {
      dispatch(deleteStart());
      const deleteUser = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await deleteUser.json();
      if (data.success === false) {
        dispatch(
          deleteFailure(data.message || "Изтриването неуспешно. Моля, опитайте пак.")
        );
      }
      dispatch(deleteSuccess(data));
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };

  const logoutHandler = async () => {
    try {
      dispatch(logoutStart());
      const logoutUser = await fetch("/api/auth/logout");
      const data = await logoutUser.json();
      if (data.success === false) {
        dispatch(
          logoutFailure(data.message || "Излизането неуспешно. Моля, опитайте пак.")
        );
        return;
      }
      dispatch(logoutSuccess(data));
    } catch (error) {
      dispatch(logoutFailure(error.message));
    }
  };

  const deletePropertyHandler = async (propertyId) => {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете тази обява?")) {
      return;
    }

    try {
      setLoadingState(true);
      setDeletePropertyError(false);

      const res = await fetch(`/api/property/delete/${propertyId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      setLoadingState(false);

      if (data.success === false) {
        setDeletePropertyError(data.message || "Неуспешно изтриване на обява. Моля, опитайте отново.");
        return;
      }
      setMyProperties((prev) => prev.filter((property) => property._id !== propertyId));
      alert('Обявата е изтрита успешно.');
    } catch (error) {
      setLoadingState(false);
      setDeletePropertyError(error.message || "Неочаквана грешка. Моля, опитайте отново");
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
    if (!propertiesVisible) {
      showMyProperties();
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-800 text-white rounded-lg shadow-md">
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
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 border-2 border-teal-400"
        />
        <p className="text-sm self-center">
          {uploadError ? (
            <span className="text-red-500">
              Неуспешно качване на снимка. (Размерът трябва да е под 2MB)
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-300">{`Uploading ${filePercentage}%`}</span>
          ) : filePercentage === 100 ? (
            <span className="text-green-400">Снимката е качена успешно!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="Име"
          defaultValue={currentUser.username}
          id="username"
          className="border border-gray-600 p-3 rounded-lg bg-gray-900 text-white"
          onChange={changesHandler}
        />
        <input
          type="text"
          placeholder="Email"
          defaultValue={currentUser.email}
          id="email"
          className="border border-gray-600 p-3 rounded-lg bg-gray-900 text-white"
          onChange={changesHandler}
        />
        <input
          type="password"
          placeholder="Парола"
          id="password"
          className="border border-gray-600 p-3 rounded-lg bg-gray-900 text-white"
          onChange={changesHandler}
        />
        <button
          disabled={loading || loadingState}
          className="text-white p-3 rounded-lg uppercase bg-teal-400 hover:bg-teal-300 disabled:bg-teal-600"
        >
          {loadingState ? "Зареждане..." : "Промени данните"}
        </button>
        <Link
          className="bg-teal-400 text-white p-3 rounded-lg uppercase text-center hover:bg-teal-300"
          to={"/add-property"}
        >
          Добави обява
        </Link>
      </form>
      <div className="flex justify-between mt-5 space-x-4">
        <span
          onClick={deleteHandler}
          className="text-red-500 cursor-pointer hover:text-red-400 font-semibold py-2 px-4 border border-red-500 rounded-lg hover:bg-red-700 transition duration-300"
        >
          Изтриване на акаунта
        </span>
        <span
          onClick={logoutHandler}
          className="text-teal-400 cursor-pointer hover:text-teal-300 font-semibold py-2 px-4 border border-teal-400 rounded-lg hover:bg-teal-700 transition duration-300"
        >
          Изход
        </span>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {successfulUpdate && (
        <p className="text-green-400 mt-4">Информацията е променена успешно</p>
      )}
      <button
        onClick={togglePropertiesVisibility}
        className="text-white font-bold my-3 py-2 px-4 rounded-lg w-full bg-teal-400 hover:bg-teal-300 transition duration-300"
      >
        {propertiesVisible ? 'Скрий обявите' : 'Преглед на обявите'}
      </button>
      {propertiesVisible && (
        <>
          {propertiesError && (
            <p className="text-red-500 mt-4">
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
                  className='border border-gray-600 rounded-lg p-3 flex justify-between items-center gap-4 bg-gray-900'
                >
                  <Link to={`/property/${property._id}`}>
                    <img
                      src={property.images[0]}
                      alt='property image'
                      className='h-16 w-16 object-contain'
                    />
                  </Link>
                  <Link
                    className='text-slate-300 font-semibold hover:underline truncate flex-1'
                    to={`/property/${property._id}`}
                  >
                    <p>{property.title}</p>
                  </Link>

                  <div className='flex flex-col item-center'>
                    <button
                      onClick={() => deletePropertyHandler(property._id)}
                      className='text-red-500 uppercase'
                    >
                      Изтриване на обявата
                    </button>
                    <Link to={`/edit-property/${property._id}`}>
                      <button className='text-teal-400 uppercase'>Редактиране на обявата</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-500 mt-4">Няма намерени обяви.</p>
          )}
        </>
      )}
    </div>
  );
}
