import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Call from './pages/Call';
import Join from './pages/Join';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/home/:name" element={<Home />} />
        <Route path="/call/:name/:role/:peer" element={<Call />} />
      </Routes>
    </Router>
  );
}

export default App;