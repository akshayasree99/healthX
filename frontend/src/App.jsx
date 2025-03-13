import React, { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css'
import Home from './components/Home/Home';
import Login from './components/Home/Login';
import Register from './components/Home/Register/Register';
import RegisterP from './components/Home/Register/RegisterP';
import RegisterD from './components/Home/Register/RegisterD';

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
      </Routes>
    </Router>
    </>
  )
}

export default App
