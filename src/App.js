// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import MapPage from './MapPage';  // 소영(영닭)이 파일
import ChatPage from './ChatPage'; // 민지 파일

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/map" element={<MapPage />} />    {/* 소영이가 작업할 경로 */}
        <Route path="/chat" element={<ChatPage />} />  {/* 민지가 작업할 경로 */}
      </Routes>
    </Router>
  );
}

export default App;

//나중에 버튼에 <Link to="/map">병원 찾기</Link> 이런 거 달아줘야 페이지 이동 가능