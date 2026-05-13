// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import MapPage from './MapPage'; 
import ChatPage from './ChatPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App; // 이 줄이 정확히 있는지 확인!

//나중에 버튼에 <Link to="/map">병원 찾기</Link> 이런 거 달아줘야 페이지 이동 가능