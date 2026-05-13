import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
  const navigate = useNavigate();
  
  const welcomeMessage = { 
    id: 'welcome', 
    text: "안녕하세요. 저는 가정폭력 피해자를 돕는 상담사입니다. 진단서 발급, 경찰서 신고, 보호시설 찾기 등 무엇이든 편하게 물어보세요. 모든 대화는 이 기기에만 저장됩니다.", 
    sender: 'ai' 
  };

  // --- 상태 관리 ---
  const [messages, setMessages] = useState([welcomeMessage]);
  const [chatHistory, setChatHistory] = useState([]); // [{id, title, data}]
  const [currentChatId, setCurrentChatId] = useState(Date.now()); // 현재 대화의 고유 ID
  const [inputText, setInputText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [opacity, setOpacity] = useState(1); 
  const [isHistoryOpen, setIsHistoryOpen] = useState(false); 

  const chatEndRef = useRef(null);
  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  // 💡 [핵심] 메시지가 바뀔 때마다 chatHistory를 실시간 업데이트 (새 대화 안 눌러도 저장)
  useEffect(() => {
    if (messages.length <= 1) return; // 초기 메시지만 있을 때는 저장 안 함

    setChatHistory(prev => {
      const exists = prev.find(chat => chat.id === currentChatId);
      const firstUserMsg = messages.find(m => m.sender === 'user')?.text || "새로운 대화";

      if (exists) {
        // 이미 존재하는 대화면 데이터만 업데이트 (중복 생성 방지)
        return prev.map(chat => 
          chat.id === currentChatId ? { ...chat, data: messages } : chat
        );
      } else {
        // 완전히 새로운 대화 시작인 경우에만 목록에 추가
        return [{ id: currentChatId, title: firstUserMsg, data: messages }, ...prev];
      }
    });
  }, [messages, currentChatId]);

  // 메시지 전송
  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const aiResponse = { id: Date.now() + 1, text: "관련 내용을 확인했습니다. 구체적인 상황을 알려주시면 상세히 돕겠습니다.", sender: 'ai' };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  // 💡 새 대화 버튼: 단순히 ID만 새로 부여 (기록은 위 useEffect가 처리)
  const handleNewChat = () => {
    setOpacity(0);
    setTimeout(() => {
      setCurrentChatId(Date.now()); // 새로운 세션 ID 발급
      setMessages([welcomeMessage]);
      setOpacity(1);
    }, 300);
  };

  // 💡 기록 불러오기: 해당 기록의 ID를 현재 ID로 설정
  const loadHistory = (historyItem) => {
    setOpacity(0);
    setTimeout(() => {
      setCurrentChatId(historyItem.id); // 기존 ID 유지 (이 상태에서 채팅 치면 이 기록이 업데이트됨)
      setMessages(historyItem.data);
      setOpacity(1);
      setIsHistoryOpen(false);
    }, 300);
  };

  return (
    <div style={styles.container}>
      {/* 기록 모달 */}
      {isHistoryOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsHistoryOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={{marginBottom: '15px'}}>이전 대화 기록</h3>
            <div style={styles.historyList}>
              {chatHistory.length === 0 ? (
                <p style={{ color: '#999', textAlign: 'center' }}>저장된 기록이 없습니다.</p>
              ) : (
                chatHistory.map((item) => (
                  <div key={item.id} style={{
                    ...styles.historyItem,
                    backgroundColor: item.id === currentChatId ? '#f0f4f0' : 'white',
                    border: item.id === currentChatId ? '1.5px solid #9ba89b' : '1px solid #eee'
                  }} onClick={() => loadHistory(item)}>
                    <span style={styles.historyTitle}>
                      {item.id === currentChatId && "📍 "}{item.title.substring(0, 15)}...
                    </span>
                    <span style={styles.historyDate}>{new Date(item.id).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                ))
              )}
            </div>
            <button style={styles.closeBtn} onClick={() => setIsHistoryOpen(false)}>닫기</button>
          </div>
        </div>
      )}

      <aside style={styles.sidebar}>
        <div style={styles.logo}>안심온</div>
        <button 
          onClick={handleNewChat}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            ...styles.newChatBtnSide,
            backgroundColor: isHovered ? '#e8e6df' : '#f5f4f0',
            transition: '0.2s'
          }}
        >
          <span style={{ fontSize: '20px' }}>+</span> 새 대화
        </button>

        <div style={styles.sidebarSection}>
          <div style={styles.sectionTitle}>자주 묻는 질문</div>
          <div style={styles.questionList}>
            {["경찰 신고 절차", "보호시설 찾기", "진단서 발급 방법", "심리 상담"].map((faq, i) => (
              <button key={i} style={styles.questionItem}>{faq}</button>
            ))}
          </div>
        </div>

        <button style={styles.historyBtn} onClick={() => setIsHistoryOpen(true)}>
          🕒 기록 보기 ({chatHistory.length})
        </button>
      </aside>

      <div style={styles.mainArea}>
        <header style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.navBtn}>← 뒤로가기</button>
          <div style={styles.headerTitle}>💬 상담 대화창</div>
          <div style={{ width: '50px' }}></div>
        </header>

        <main style={{ ...styles.chatArea, opacity: opacity, transition: 'opacity 0.4s ease' }}>
          {messages.map((msg, index) => (
            <div key={msg.id} style={index === 0 ? styles.firstMsgWrapper : (msg.sender === 'user' ? styles.userMsgWrapper : styles.aiMsgWrapper)}>
              <div style={index === 0 ? styles.firstAiBubble : (msg.sender === 'user' ? styles.userBubble : styles.aiBubble)}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </main>

        <footer style={styles.footer}>
          <div style={styles.inputContainer}>
            <button style={styles.plusIcon}>+</button>
            <input 
              style={styles.input}
              placeholder="내용을 입력하세요..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage} style={{...styles.sendBtn, color: inputText ? '#6b7a6b' : '#ccc'}}>➤</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#fdfbf7' },
  sidebar: { width: '260px', backgroundColor: '#eceae4', display: 'flex', flexDirection: 'column', padding: '24px 16px', borderRight: '1px solid #e0ddd5' },
  logo: { fontSize: '22px', fontWeight: 'bold', color: '#8a9a8a', marginBottom: '32px', textAlign: 'center' },
  newChatBtnSide: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', border: '1px solid #e0ddd5', borderRadius: '12px', fontSize: '15px', fontWeight: '900', color: '#333', cursor: 'pointer', marginBottom: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', outline: 'none' },
  sidebarSection: { flex: 1 },
  sectionTitle: { fontSize: '14px', fontWeight: 'bold', color: '#7a7a7a', marginBottom: '16px', paddingLeft: '8px' },
  questionList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  questionItem: { textAlign: 'left', padding: '12px 16px', backgroundColor: '#f5f4f0', border: '1px solid #e0ddd5', borderRadius: '10px', fontSize: '13px', color: '#555', cursor: 'pointer' },
  historyBtn: { marginTop: '20px', padding: '14px', backgroundColor: '#9ba89b', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
  mainArea: { flex: 1, display: 'flex', flexDirection: 'column' },
  header: { height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' },
  navBtn: { background: 'none', border: 'none', fontSize: '15px', color: '#888', cursor: 'pointer' },
  headerTitle: { fontSize: '16px', fontWeight: '700', color: '#333' },
  chatArea: { flex: 1, padding: '20px 60px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' },
  firstMsgWrapper: { display: 'flex', justifyContent: 'center', margin: '60px 0' },
  firstAiBubble: { maxWidth: '85%', padding: '35px', backgroundColor: 'white', borderRadius: '28px', border: '1px solid #e8e6df', textAlign: 'center', lineHeight: '1.8', color: '#333', fontSize: '17px' },
  aiMsgWrapper: { display: 'flex', justifyContent: 'flex-start' },
  userMsgWrapper: { display: 'flex', justifyContent: 'flex-end' },
  aiBubble: { maxWidth: '75%', padding: '16px 22px', backgroundColor: 'white', borderRadius: '22px', border: '1px solid #e8e6df' },
  userBubble: { maxWidth: '75%', padding: '16px 22px', backgroundColor: '#e9ede9', borderRadius: '22px', border: '1px solid #d8dfd8' },
  footer: { padding: '20px 80px 40px 80px' },
  inputContainer: { display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: '35px', border: '1.5px solid #bdc7bd', padding: '6px 24px' },
  plusIcon: { fontSize: '26px', color: '#999', marginRight: '12px', background: 'none', border: 'none', cursor: 'pointer' },
  input: { flex: 1, border: 'none', outline: 'none', padding: '14px 0', fontSize: '16px' },
  sendBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { width: '420px', backgroundColor: 'white', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  historyList: { maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' },
  historyItem: { padding: '15px', borderRadius: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.2s' },
  historyTitle: { fontSize: '14px', color: '#333', fontWeight: '600' },
  historyDate: { fontSize: '11px', color: '#aaa' },
  closeBtn: { padding: '14px', border: 'none', borderRadius: '15px', backgroundColor: '#eee', cursor: 'pointer', fontWeight: 'bold' }
};

export default ChatPage;