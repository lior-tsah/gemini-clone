/*App.js*/

import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import "./assets/App.css";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar/Sidebar'
import Main from './components/Main/Main'
import Wrapper from './Wrapper/Wrapper';


export default function App() {
  return (
    <Wrapper>
      <Main />
    </Wrapper>
  )

}