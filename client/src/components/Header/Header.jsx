import { FaSearch, FaBars } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const {currentUser} = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() =>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermUrl = urlParams.get('searchTerm');
    if(searchTermUrl){
      setSearchTerm(searchTermUrl);
    }
  }, [location.search]);
  
  return (
    <div>
      <header className='bg-slate-100 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
          <Link to='/'>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
              <span className='ml-2' style={{ color: '#00B98E' }}>Bozhidar</span>
              <span className='ml-2' style={{ color: '#00B98E' }}>Estate</span>
            </h1>
          </Link>
          <form onSubmit={submitHandler} className='bg-slate-100 p-3 rounded-lg flex items-center'>
            <input 
              type="text" 
              placeholder='Търси...' 
              className='bg-transparent focus:outline-none w-24 sm:w-64'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>
              <FaSearch className='text-slate-600'/>
            </button>
          </form>
          <div className='sm:hidden'>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <FaBars className='text-slate-600'/>
            </button>
          </div>
          <ul className='hidden sm:flex gap-4'>
            <Link to='/'>
              <li className='text-slate-700 hover:underline'>Начало</li>
            </Link>
            <Link to='/about'>
              <li className='text-slate-700 hover:underline'>За нас</li>
            </Link>
            <Link to='/profile'>
              {currentUser ? (
                <img className='rounded-full h-7 w-7 object-cover' src={currentUser.image} alt="profile" />
              ) : (
                <li className='text-slate-700 hover:underline'>Вход</li>
              )}
            </Link>
            {!currentUser && (
              <Link to='/register'>
                <li className='text-slate-700 hover:underline'>Регистрация</li>
              </Link>
            )}
          </ul>
        </div>
        {isMenuOpen && (
          <ul className='sm:hidden bg-slate-100 shadow-md p-3'>
            <Link to='/'>
              <li className='text-slate-700 hover:underline p-2' onClick={() => setIsMenuOpen(false)}>Начало</li>
            </Link>
            <Link to='/about'>
              <li className='text-slate-700 hover:underline p-2' onClick={() => setIsMenuOpen(false)}>За нас</li>
            </Link>
            <Link to='/profile'>
              {currentUser ? (
                <li onClick={() => setIsMenuOpen(false)}>
                  <img className='rounded-full h-7 w-7 object-cover' src={currentUser.image} alt="profile" />
                </li>
              ) : (
                <li className='text-slate-700 hover:underline p-2' onClick={() => setIsMenuOpen(false)}>Вход</li>
              )}
            </Link>
            {!currentUser && (
              <Link to='/register'>
                <li className='text-slate-700 hover:underline p-2' onClick={() => setIsMenuOpen(false)}>Регистрация</li>
              </Link>
            )}
          </ul>
        )}
      </header>
    </div>
  );
}
