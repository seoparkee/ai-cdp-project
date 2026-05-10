import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9F8F3', padding: '20px', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* 헤더 영역 */}
      <header style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: '#4A5C4E', padding: '8px', borderRadius: '8px', display: 'flex' }}>
            {/* 방패 아이콘 크기 고정 */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <path d="M9 12l2 2 4-4"></path>
            </svg>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', margin: 0 }}>안심온</h1>
        </div>
        <span style={{ fontSize: '14px', color: '#666' }}>당신은 혼자가 아닙니다</span>
      </header>

      <main style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        {/* 긴급 도움 카드 */}
        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>긴급 도움이 필요하신가요</p>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111', margin: '0 0 15px 0', lineHeight: '1.2' }}>가정폭력을 당하고<br />계신가요?</h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '25px', lineHeight: '1.5' }}>지금 안전한 곳에 계신지 먼저 확인해 주세요.<br />전화 한 통이면 24시간 도움을 받을 수 있습니다.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <a href="tel:112" style={{ backgroundColor: '#D15F4C', color: 'white', padding: '15px', borderRadius: '15px', textAlign: 'center', fontWeight: 'bold', textDecoration: 'none' }}>📞 112 신고</a>
            <a href="tel:1366" style={{ backgroundColor: '#445D48', color: 'white', padding: '15px', borderRadius: '15px', textAlign: 'center', fontWeight: 'bold', textDecoration: 'none' }}>📞 1366 여성긴급</a>
          </div>
        </div>

        {/* 메뉴 버튼들 */}
        <div onClick={() => navigate('/map')} style={{ backgroundColor: 'white', borderRadius: '24px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', border: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ backgroundColor: '#F2EFE5', padding: '15px', borderRadius: '15px' }}>📍</div>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>주변 병원 찾기</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#888' }}>가까운 응급/진료 가능 병원을 안내합니다</p>
            </div>
          </div>
          <span style={{ color: '#ccc', fontSize: '20px' }}>&gt;</span>
        </div>

        <div onClick={() => navigate('/chat')} style={{ backgroundColor: 'white', borderRadius: '24px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', border: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ backgroundColor: '#F2EFE5', padding: '15px', borderRadius: '15px' }}>💬</div>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>AI 챗봇 상담</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#888' }}>증명서류 발급 방법을 안내합니다</p>
            </div>
          </div>
          <span style={{ color: '#ccc', fontSize: '20px' }}>&gt;</span>
        </div>
      </main>
    </div>
  );
};

export default MainPage;