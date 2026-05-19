import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Navigation, ChevronLeft, ShieldCheck } from 'lucide-react';
// 1. Firestore 데이터베이스 객체 불러오기
import { db } from './firebase'; 
import { collection, getDocs } from 'firebase/firestore';

const MapPage = () => {
  const navigate = useNavigate();
  
  // 2. 병원 리스트를 저장할 상태 (처음에는 빈 배열)
  const [hospitalList, setHospitalList] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // 3. 페이지가 처음 열릴 때 Firestore에서 데이터 가져오기
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "hospitals"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,     // Firestore 문서의 고유 ID
          ...doc.data()   // 문서 내부 필드 데이터들 (name, type, tel 등)
        }));
        
        setHospitalList(data);
        if (data.length > 0) {
          setSelectedHospital(data[0]); // 첫 번째 병원을 기본 선택으로 설정
        }
        setLoading(false);
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생: ", error);
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  // 데이터를 불러오는 중일 때 보여줄 화면
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#F9F7F0' }}>
        <h3>🏥 병원 데이터를 불러오는 중입니다...</h3>
      </div>
    );
  }

  // 데이터가 없을 때 예외 처리
  if (hospitalList.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#F9F7F0' }}>
        <h3>등록된 병원 데이터가 없습니다. Firebase를 확인해 주세요.</h3>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F9F7F0', minHeight: '100vh', fontFamily: 'sans-serif', color: '#333' }}>
      {/* 헤더 영역 */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '4px' }}>
          <ChevronLeft size={20} />
          <span style={{ fontSize: '15px' }}>뒤로</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={22} color="#2D5A42" strokeWidth={2.5} />
          <span style={{ fontWeight: 'bold', fontSize: '19px', color: '#000', letterSpacing: '-0.5px' }}>안심온</span>
        </div>
        <span style={{ fontSize: '13px', color: '#888' }}>현재 내 위치</span>
      </header>

      <div style={{ padding: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' }}>주변 병원 찾기</h1>

        {/* --- 지도 영역 --- */}
        <div style={{ 
          position: 'relative', width: '100%', height: '400px', backgroundColor: '#EAE7D6', borderRadius: '24px', 
          overflow: 'hidden', marginBottom: '30px', backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px'
        }}>
          {/* 내 위치 */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#2D5A42', borderRadius: '50%', border: '3px solid #fff' }}></div>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#2D5A42', marginTop: '4px', display: 'block' }}>내 위치</span>
          </div>

          {/* 지도 위 아이콘 마커 (Firestore 데이터 연동) */}
          {hospitalList.map((h) => (
            <div
              key={h.id}
              onClick={() => setSelectedHospital(h)}
              style={{
                position: 'absolute', top: `${h.y}%`, left: `${h.x}%`, cursor: 'pointer', transition: 'all 0.3s ease',
                transform: selectedHospital && selectedHospital.id === h.id ? 'scale(1.2) translateY(-5px)' : 'scale(1)',
                zIndex: selectedHospital && selectedHospital.id === h.id ? 5 : 1
              }}
            >
              <div style={{
                backgroundColor: selectedHospital && selectedHospital.id === h.id ? '#C84C3E' : '#fff',
                padding: '6px', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #ddd'
              }}>
                <MapPin size={18} color={selectedHospital && selectedHospital.id === h.id ? '#fff' : '#2D5A42'} fill="none" strokeWidth={2.5} />
              </div>
            </div>
          ))}

          {/* 정보 카드 (선택된 병원 데이터 출력) */}
          {selectedHospital && (
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', maxWidth: '280px', backgroundColor: '#fff', borderRadius: '20px', padding: '18px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', zIndex: 10 }}>
              <p style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{selectedHospital.type} · {selectedHospital.time || '24시간'} · {selectedHospital.distance}</p>
              <h3 style={{ fontSize: '17px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{selectedHospital.name}</h3>
              <p style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>{selectedHospital.address}</p>
              <p style={{ fontSize: '14px', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} color="#666" /> {selectedHospital.tel}
              </p>
              <button style={{ width: '100%', backgroundColor: '#2D5A42', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <Navigation size={16} /> 네이버 지도로 길찾기
              </button>
            </div>
          )}
        </div>

        {/* 병원 리스트 영역 */}
        <section>
          <h2 style={{ fontSize: '16px', color: '#666', marginBottom: '16px' }}>인근 병원 리스트</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {hospitalList.map((hospital) => (
              <div 
                key={hospital.id} 
                onClick={() => setSelectedHospital(hospital)}
                style={{
                  display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '16px', borderRadius: '20px',
                  border: selectedHospital && selectedHospital.id === hospital.id ? '2px solid #C84C3E' : '1px solid #f0f0f0', cursor: 'pointer', transition: '0.2s'
                }}
              >
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%', marginRight: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center',
                  backgroundColor: selectedHospital && selectedHospital.id === hospital.id ? '#C84C3E' : '#F4F4F0', transition: '0.2s'
                }}>
                  <MapPin size={22} color={selectedHospital && selectedHospital.id === hospital.id ? '#fff' : '#2D5A42'} fill="none" strokeWidth={2} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 2px 0', fontSize: '15px', fontWeight: 'bold' }}>{hospital.name}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>{hospital.type} · {hospital.distance} · {hospital.tel}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MapPage;