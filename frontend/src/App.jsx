import React, { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css'
import Home from './components/Home/Home';
import Login from './components/Home/Login';
import Register from './components/Home/Register.jsx';
import RegisterP from './components/Home/Register/RegisterP';
import RegisterD from './components/Home/Register/RegisterD';
import LoginPatient from './components/auth/LoginPatient';
import DashboardP from './components/patient/DashboardP';
import DashboardD from './components/doctor/DashboardD';
import BookAppointment from "./components/patient/BookAppointment";
import MedicationTracker from './components/patient/MedicationTracker';
import Profile from './components/patient/Profile';
import Reports from './components/patient/Reports';
import VideoCall from './components/patient/VideoCall';
import Appointments from './components/doctor/Appointments';  
import HandwrittenReportUpload from './components/doctor/HandwrittenReportUpload';
import PatientList from './components/doctor/PatientList';
import ProfileD from './components/doctor/ProfileD';
import ReportCreation from './components/doctor/ReportCreation';
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Chatbot from './components/chatbot/Chatbot.jsx'; // Import Chatbot


function App() {

  return (
    <>
    <Router>
      <Routes>
      <Route path="/" index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register/>}/>
      <Route path="/register/doctor" element={<RegisterD/>}/>
      {/* <Route path="/auth/loginpatient" element={<LoginPatient />} /> */} 
      <Route element={<ProtectedRoute />}>
          <Route path="/patient/dashboard/:id" element={<DashboardP />} />
          <Route path="/patient/dashboardd/:id" element={<DashboardD />} />
      </Route>

      <Route path="/register/patient/:id" element={<RegisterP/>}/>
      <Route path="/patient/bookappointment/:id" element={<BookAppointment />} />
      <Route path="/patient/medicationtracker/:id" element={<MedicationTracker/>} />
      <Route path="/patient/profile/:id" element={<Profile />} />
      <Route path="/patient/reports/:id" element={<Reports />} />
      <Route path="/patient/videocall/:id" element={<VideoCall/>} />
      {/* need to add a back option here */}

      <Route path="/doctor/appointments" element={<Appointments />} />
      <Route path="/doctor/handwrittenreportupload" element={<HandwrittenReportUpload />} />
      <Route path="/doctor/patientlist" element={<PatientList />} />
      <Route path="/doctor/profileD" element={<ProfileD />} />
      <Route path="/doctor/reportcreation" element={<ReportCreation />} />

      </Routes>
      {/* Global Chatbot Button */}
      <Chatbot />
    </Router>
    </>
  )
}

export default App