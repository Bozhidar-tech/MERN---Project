import { FaSearch, FaBars } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
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

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermUrl = urlParams.get('searchTerm');
    if (searchTermUrl) {
      setSearchTerm(searchTermUrl);
    }
  }, [location.search]);

  return (
    <header className='bg-gray-800 text-white shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
        <Link to='/'>
          <h1 className='text-xl font-bold flex items-center'>
            <span className='text-teal-400'>Bozhidar</span>
            <span className='ml-2 text-teal-400'>Estate</span>
          </h1>
        </Link>
        <form onSubmit={submitHandler} className='bg-gray-800 p-2 rounded-md flex items-center'>
          <input
            type="text"
            placeholder='Search...'
            className='p-2 rounded-md border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 w-24 sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type='submit' className='p-2'>
            <FaSearch className='text-teal-400' />
          </button>
        </form>
        <div className='sm:hidden'>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='p-2'>
            <FaBars className='text-white' />
          </button>
        </div>
        <nav className='hidden sm:flex space-x-4'>
          <Link to='/' className='hover:text-teal-400'>Начало</Link>
          <Link to='/about' className='hover:text-teal-400'>За Нас</Link>
          <Link to='/profile'>
            {currentUser ? (
              <img className='rounded-full h-7 w-7 object-cover' src={currentUser.image} alt="profile" />
            ) : (
              <span className=' hover:text-teal-400'>Вход</span>
            )}
          </Link>
          {!currentUser && (
            <Link to='/register' className='hover:text-teal-400'>
              Регистрация
            </Link>
          )}
        </nav>
      </div>
      {isMenuOpen && (
        <div className='sm:hidden bg-gray-700 p-4'>
          <Link to='/' className='block py-2 text-slate-700 hover:text-teal-400' onClick={() => setIsMenuOpen(false)}>Начало</Link>
          <Link to='/about' className='block py-2 text-slate-700 hover:text-teal-400' onClick={() => setIsMenuOpen(false)}>За Нас</Link>
          <Link to='/profile'>
            {currentUser ? (
              <img className='rounded-full h-7 w-7 object-cover' src={currentUser.image} alt="profile" onClick={() => setIsMenuOpen(false)} />
            ) : (
              <span className='block py-2 text-slate-700 hover:text-teal-400' onClick={() => setIsMenuOpen(false)}>Вход</span>
            )}
          </Link>
          {!currentUser && (
            <Link to='/register' className='block py-2 text-slate-700 hover:text-teal-400' onClick={() => setIsMenuOpen(false)}>
              Регистрация
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
