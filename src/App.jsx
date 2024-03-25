import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import Profile from './pages/Profile';
import AboutDost from './pages/AboutDost';
import ContactUs from './pages/ContactUs';
import Chat from './pages/Chat';
import ForgetPassword from './pages/ForgetPassword';

import Suggestions from './pages/SuggestionPage';
import FriendRequests from './pages/FriendRequestPage';
import ResetPassword from './pages/ResetPassword';
import Room from './components/Room';
import OTP from './pages/OTP';
import Oops from './components/Oops';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/about' element={<AboutDost />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/room' element={<Room/>}/>
        <Route path ="/suggestions" element={<Suggestions />} />
        <Route path ="/friendsRequests" element={<FriendRequests/>} />

        <Route path="/foregettingPassword" element={<ForgetPassword />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />

        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/otp" element={<OTP />} />

        <Route path="*" element={<Oops />} />
      </Routes>
    </Router>
  );
};

export default App;
