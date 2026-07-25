import React from "react";
import axios from "axios";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Routing from "./components/routes";
import { BrowserRouter } from 'react-router-dom';



function App() {

  return (
    <>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </>
  )
}

export default App;