import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routing from './components/router';

function App() {
  return (
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  );
}

export default App;