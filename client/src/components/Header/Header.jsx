import { FaBars } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); 


  return (
    <header className="bg-gray-800 text-white shadow-md border-b-2 border-teal-400 mb-2">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
        <Link to="/">
          <h1 className="text-xl font-bold flex items-center">
            <span className="text-teal-400">Bozhidar</span>
            <span className="ml-2 text-teal-400">Estate</span>
          </h1>
        </Link>
        <div className="sm:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
            <FaBars className="text-white" />
          </button>
        </div>
        <nav className="hidden sm:flex space-x-4">
          {location.pathname !== '/' && (
            <Link to="/" className="hover:text-teal-400">Начало</Link>
          )}
          <Link to="/about" className="hover:text-teal-400">За Нас</Link>
          <Link to="/search" className="hover:text-teal-400">Търсене</Link>
          <Link to="/contact" className="hover:text-teal-400">Контакт</Link>
          <Link to="/profile">
            {currentUser ? (
              <img className="rounded-full h-7 w-7 object-cover" src={currentUser.image} alt="profile" />
            ) : (
              <span className="hover:text-teal-400">Вход</span>
            )}
          </Link>
          {!currentUser && (
            <Link to="/register" className="hover:text-teal-400">
              Регистрация
            </Link>
          )}
        </nav>
      </div>
      {isMenuOpen && (
        <div className="sm:hidden bg-gray-700 p-4">
          {location.pathname !== '/' && (
            <Link to="/" className="block py-2 text-white hover:text-teal-400" onClick={() => setIsMenuOpen(false)}>Начало</Link>
          )}
          <Link to="/about" className="block py-2 text-white hover:text-teal-400" onClick={() => setIsMenuOpen(false)}>За Нас</Link>
          <Link to="/profile">
            {currentUser ? (
              <img className="rounded-full h-7 w-7 object-cover" src={currentUser.image} alt="profile" onClick={() => setIsMenuOpen(false)} />
            ) : (
              <span className="block py-2 text-white hover:text-teal-400" onClick={() => setIsMenuOpen(false)}>Вход</span>
            )}
          </Link>
          {!currentUser && (
            <Link to="/register" className="block py-2 text-white hover:text-teal-400" onClick={() => setIsMenuOpen(false)}>
              Регистрация
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
