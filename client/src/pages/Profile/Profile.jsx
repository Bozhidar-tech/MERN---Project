import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { app } from "../../firebase";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { updateStart, updateSuccess, updateFailure, deleteFailure, deleteStart, deleteSuccess } from "../../redux/user/userSlice";

export default function Profile() {
  const fileInput = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [successfulUpdate, setSuccessfulUpdate] = useState(false);
  const [formData, setFormData] = useState({});
  const [loadingState, setLoadingState] = useState(false);
  const dispatch = useDispatch();

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
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingState(true);
    setTimeout(async () => {
      try {
        dispatch(updateStart());
        const updateInfo = await fetch(`/api/user/update/${currentUser._id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await updateInfo.json();
        if (data.success === false) {
          dispatch(updateFailure(data.message || 'Update failed. Please try again.'));
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
        method: 'DELETE',
      });
      const data = await deleteUser.json();
      if (data.success === false) {
        dispatch(deleteFailure(data.message || 'Delete failed. Please try again.'));
      }
      dispatch(deleteSuccess(data));
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">My Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <span className='text-red-700'>
              Error Image upload (Image must be smaller than 2MB)
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePercentage}%`}</span>
          ) : filePercentage === 100 ? (
            <span className='text-green-700'>Image uploaded successfully!</span>
          ) : (
            ''
          )}
        </p>
        <input
          type="text"
          placeholder="Username"
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
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={changesHandler}
        />
        <button
          disabled={loading || loadingState}
          className="text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          style={{ backgroundColor: "#00B98E" }}
        >
          {loadingState ? 'Loading...' : 'Update Information'}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={deleteHandler} className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-blue-700 cursor-pointer">Logout</span>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {successfulUpdate && (
        <p className="text-green-700">Information updated successfully!</p>
      )}
    </div>
  );
}
