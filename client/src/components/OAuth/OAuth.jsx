import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../../firebase';
import { useDispatch } from'react-redux';
import { loginSuccess } from '../../redux/user/userSlice.js';
import { useNavigate } from'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider); // If you have only one google account, you wont get popup window to choose which account to use
      
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: result.user.displayName, email: result.user.email, image: result.user.photoURL }),
      })

      const data = await res.json();
      dispatch(loginSuccess(data));
      navigate('/');
    } catch (error) {
      console.log('Could not login with Google:', error);
    }
  }

  return (
    <button onClick={handleGoogleAuth} type='button' className='text-white p-3 rounded-lg uppercase hover:opacity-95 
        disabled:opacity-80' style={{ backgroundColor: '#00B98E' }}>
      Continue with Google
    </button>
  )
}
