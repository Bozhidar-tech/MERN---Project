import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import Header from './components/Header/Header';
import RouteGuard from './components/RouteGuard/RouteGuard';
import AuthController from './components/AuthController/AuthController';
import AddProperty from './pages/AddProperty/AddProperty';
import EditProperty from './pages/EditProperty/EditProperty';
import Property from './pages/Property/Property';
import Search from './pages/Search/Search';
import Footer from './components/Footer/Footer';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import ContactUs from './pages/ContactUs/ContactUs';
import TermsAndConditions from './pages/TermsAndConditions/TermsAndConditions';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route element={<AuthController />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/property/:propertyId" element={<Property />} />
        <Route path="/search" element={<Search />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/terms&conditions" element={<TermsAndConditions />} />
        <Route element={<RouteGuard />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/edit-property/:propertyId" element={<EditProperty />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
