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
      <Route element={<ProtectedRoute />}>
          {/* Dynamic dashboard route */}
          <Route path="/dashboardp/:patientId" element={<DashboardP />} />
        </Route>
      <Route path="/doctor/dashboardd/*" element={<DashboardD />} />
      <Route path="/patient/bookappointment" element={<BookAppointment />} />
      <Route path="/patient/medicationtracker" element={<MedicationTracker/>} />
      <Route path="/patient/profile" element={<Profile />} />
      <Route path="/patient/reports" element={<Reports />} />
      <Route path="/patient/videocall" element={<VideoCall/>} />
      <Route path="/doctor/appointments" element={<Appointments />} />
      <Route path="/doctor/handwrittenreportupload" element={<HandwrittenReportUpload />} />
      <Route path="/doctor/patientlist" element={<PatientList />} />
      <Route path="/doctor/profileD" element={<ProfileD />} />
      <Route path="/doctor/reportcreation" element={<ReportCreation />} />

      </Routes>
    </Router>
    </>
  )
}

export default App