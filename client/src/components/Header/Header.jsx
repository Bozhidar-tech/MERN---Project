import { FaBars } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t, i18n } = useTranslation();
  const { currentUser } = useSelector((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleLanguageChange = () => {
    i18n.changeLanguage(i18n.language === "bg" ? "en" : "bg");
  };

  return (
    <header className="bg-gray-800 text-white shadow-md border-b-2 border-teal-400 mb-2">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
        <Link to="/">
          <h1 className="text-xl font-bold flex items-center">
            <span className="text-teal-400">Bozhidar</span>
            <span className="ml-2 text-teal-400">Estate</span>
          </h1>
        </Link>
        <div className="flex items-center space-x-4">
          <div className="sm:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              <FaBars className="text-white" />
            </button>
          </div>
        </div>
        <nav className="hidden sm:flex space-x-4">
          {location.pathname !== "/" && (
            <Link to="/" className="hover:text-teal-400">
              {t("home")}
            </Link>
          )}
          <Link to="/about" className="hover:text-teal-400">
            {t("aboutUs")}
          </Link>
          <Link to="/search" className="hover:text-teal-400">
            {t("search")}
          </Link>
          <Link to="/contact" className="hover:text-teal-400">
            {t("contact")}
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.image}
                alt="profile"
              />
            ) : (
              <span className="hover:text-teal-400">{t("login")}</span>
            )}
          </Link>
          {!currentUser && (
            <Link to="/register" className="hover:text-teal-400">
              {t("register")}
            </Link>
          )}
          <button
            onClick={handleLanguageChange}
            className="bg-teal-400 text-white px-3 py-1 rounded"
          >
            {i18n.language === "bg" ? "EN" : "BG"}
          </button>
        </nav>
      </div>
      {isMenuOpen && (
        <div className="sm:hidden bg-gray-700 p-4">
          {location.pathname !== "/" && (
            <Link
              to="/"
              className="block py-2 text-white hover:text-teal-400"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("home")}
            </Link>
          )}
          <Link
            to="/about"
            className="block py-2 text-white hover:text-teal-400"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("aboutUs")}
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.image}
                alt="profile"
                onClick={() => setIsMenuOpen(false)}
              />
            ) : (
              <span
                className="block py-2 text-white hover:text-teal-400"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("login")}
              </span>
            )}
          </Link>
          {!currentUser && (
            <Link
              to="/register"
              className="block py-2 text-white hover:text-teal-400"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("register")}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
