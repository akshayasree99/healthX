import React, { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css'
import Home from './components/Home/Home';
import Login from './components/Home/Login';
import Register from './components/Home/Register/Register';
import RegisterP from './components/Home/Register/RegisterP';
import RegisterD from './components/Home/Register/RegisterD';
import LoginPatient from './components/auth/LoginPatient';
import Dashboard from './components/patient/Dashboard';
import BookAppointment from "./components/patient/BookAppointment";
import MedicationTracker from './components/patient/MedicationTracker';
import Profile from './components/patient/Profile';
import Reports from './components/patient/Reports';
import VideoCall from './components/patient/VideoCall';



function App() {

  return (
    <>
    <Router>
      <Routes>
      <Route path="/" index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register/>}/>
      <Route path="/register/patient" element={<RegisterP/>}/>
      <Route path="/register/doctor" element={<RegisterD/>}/>
      <Route path="/auth/loginpatient" element={<LoginPatient />} />
      <Route path="/home/register/registerp" element={<RegisterP />} />
      <Route path="/home/register/registerd" element={<RegisterD />} /> 
      <Route path="/patient/dashboard/*" element={<Dashboard />} />
      <Route path="/patient/bookappointment" element={<BookAppointment />} />
      <Route path="/patient/medicationtracker" element={<MedicationTracker/>} />
      <Route path="/patient/profile" element={<Profile />} />
      <Route path="/patient/reports" element={<Reports />} />
      <Route path="/patient/videocall" element={<VideoCall/>} />


      </Routes>
    </Router>
    </>
  )
}

export default App