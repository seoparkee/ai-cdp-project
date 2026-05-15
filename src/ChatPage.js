import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from "lucide-react";
import { getAIResponse } from './api';

const FAQ_LIST = [
  "상해진단서 발급 및 기록법",
  "고소 서류 및 증거 수집 가이드",
  "주변 보호시설 안내",
  "가해자 접근 금지 및 신변 보호 요청",
  "무료 법률 및 경제적 지원"
];

const ChatPage = () => {
  const navigate = useNavigate();
  
  const welcomeMessage = { 
    id: 'welcome', 
    text: "안녕하세요. 저는 가정폭력 피해자를 돕는 상담사입니다. \n 진단서 발급, 고소 서류 준비, 보호시설 안내 등 무엇이든 편하게 물어보세요. \n 모든 대화는 이 기기에만 안전하게 저장됩니다.", 
    sender: 'ai' 
  };

  const [messages, setMessages] = useState([welcomeMessage]);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(Date.now());
  const [inputText, setInputText] = useState('');
  const [opacity, setOpacity] = useState(1); 
  const [isHistoryOpen, setIsHistoryOpen] = useState(false); 
  const [isHovered, setIsHovered] = useState(false);
  const [isSending, setIsSending] = useState(false); // 🔥 전송 중 중복 클릭 방지용

  const chatEndRef = useRef(null);
  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  // 대화 기록 관리
  useEffect(() => {
    if (messages.length <= 1) return;
    setChatHistory(prev => {
      const exists = prev.find(chat => chat.id === currentChatId);
      const firstUserMsg = messages.find(m => m.sender === 'user')?.text || "새로운 대화";
      if (exists) {
        return prev.map(chat => chat.id === currentChatId ? { ...chat, data: messages } : chat);
      } else {
        return [{ id: currentChatId, title: firstUserMsg, data: messages }, ...prev];
      }
    });
  }, [messages, currentChatId]);

  // 고정 답변 및 AI 답변 통합 함수
  const getCombinedResponse = async (userText) => {
    if (userText.includes("진단서")) return "[진료 시 고지] 병원 접수 시 '가정폭력 피해'임을 밝히세요. 일반 진단서가 아닌 '상해진단서'여야 합니다.";
    if (userText.includes("고소") || userText.includes("증거")) return "[증거 목록화] 상처 사진, 협박 문자, 녹음 파일 등을 미리 캡처하고 복사본을 안전한 곳에 두세요.";
    if (userText.includes("보호시설") || userText.includes("쉼터")) return "[1366 연락] 국번 없이 1366으로 전화하면 즉시 입소 가능한 쉼터를 연결해 줍니다.";
    if (userText.includes("가해자") || userText.includes("접근 금지")) return "[긴급조치] 경찰 신고 시 현장에서 '긴급임시조치'를 요청하여 가해자 접근을 금지할 수 있습니다.";
    if (userText.includes("지원") || userText.includes("경제")) return "[법률구조공단] 132를 통해 무료 법률 상담과 소송 대리 지원을 받을 수 있습니다.";

    try {
      return await getAIResponse(userText);
    } catch (error) {
      return "연결에 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.";
    }
  };

  // 🔥 핵심 수정: 메시지 전송 로직 (중복 입력 및 한글 버그 차단)
  const handleSendMessage = async (text) => {
    const messageToSend = text || inputText;
    
    // 비어있거나 이미 전송 중이면 차단
    if (!messageToSend.trim() || isSending) return;

    setIsSending(true); // 전송 시작
    const timestamp = Date.now();

    // 1. 유저 메시지 즉시 반영
    const userMsg = { id: `user-${timestamp}`, text: messageToSend, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText(''); // 입력창 비우기

    // 2. 답변 생성
    const responseText = await getCombinedResponse(messageToSend);
    
    // 3. AI 메시지 반영
    const aiMsg = { id: `ai-${timestamp + 1}`, text: responseText, sender: 'ai' };
    setMessages(prev => [...prev, aiMsg]);
    
    setIsSending(false); // 전송 완료
  };

  // 🔥 한글 입력 시 Enter 중복 방지용 이벤트 핸들러
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // isComposing: 한글 입력(조합) 중인 경우 Enter 이벤트를 무시함
      if (e.nativeEvent.isComposing) return;
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setOpacity(0);
    setTimeout(() => {
      setCurrentChatId(Date.now());
      setMessages([welcomeMessage]);
      setOpacity(1);
    }, 300);
  };

  const loadHistory = (historyItem) => {
    setOpacity(0);
    setTimeout(() => {
      setCurrentChatId(historyItem.id);
      setMessages(historyItem.data);
      setOpacity(1);
      setIsHistoryOpen(false);
    }, 300);
  };

  // 스타일 생략 없이 전체 유지...
  const styles = {
    container: { display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#fdfbf7' },
    sidebar: { width: '260px', backgroundColor: '#eceae4', display: 'flex', flexDirection: 'column', padding: '24px 16px', borderRight: '1px solid #e0ddd5' },
    sidebarLogoArea: { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' },
    newChatBtnSide: { padding: '14px', border: '1px solid #e0ddd5', borderRadius: '12px', cursor: 'pointer', marginBottom: '24px', fontWeight: 'bold', transition: '0.2s' },
    sidebarSection: { flex: 1 },
    sectionTitle: { fontSize: '14px', fontWeight: 'bold', color: '#7a7a7a', marginBottom: '16px' },
    questionList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    questionItem: { textAlign: 'left', padding: '12px 16px', backgroundColor: '#f5f4f0', border: '1px solid #e0ddd5', borderRadius: '10px', fontSize: '13px', cursor: 'pointer' },
    historyBtn: { marginTop: '20px', padding: '14px',  backgroundColor: "#2D5A42" , color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
    mainArea: { flex: 1, display: 'flex', flexDirection: 'column' },
    header: { height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid #eee' },
    navBtn: { background: 'none', border: 'none', fontSize: '18px', color: '#333', cursor: 'pointer' },
    headerTitle: { fontSize: '16px', fontWeight: 'bold' },
    chatArea: { flex: 1, padding: '20px 60px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', transition: 'opacity 0.3s ease' },
    aiMsgWrapper: { display: 'flex', justifyContent: 'flex-start' },
    userMsgWrapper: { display: 'flex', justifyContent: 'flex-end' },
    aiBubble: { maxWidth: '75%', padding: '14px 18px', backgroundColor: 'white', borderRadius: '18px', border: '1px solid #e8e6df', lineHeight: '1.6', whiteSpace: "pre-line" },
    userBubble: { maxWidth: '75%', padding: '14px 18px', backgroundColor: '#e9ede9', borderRadius: '18px', border: '1px solid #d8dfd8', lineHeight: '1.6' },
    footer: { padding: '20px 80px 40px 80px' },
    inputContainer: { display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: '35px', border: '1.5px solid #bdc7bd', padding: '6px 24px' },
    input: { flex: 1, border: 'none', outline: 'none', padding: '12px 0', fontSize: '16px' },
    sendBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7a6b' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { width: '420px', backgroundColor: 'white', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
    historyList: { maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' },
    historyItem: { padding: '15px', borderRadius: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #eee' },
    historyTitle: { fontSize: '14px', fontWeight: '600' },
    historyDate: { fontSize: '11px', color: '#aaa' },
    closeBtn: { padding: '14px', border: 'none', borderRadius: '15px', backgroundColor: '#eee', cursor: 'pointer', fontWeight: 'bold' }
  };

  return (
    <div style={styles.container}>
      {isHistoryOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsHistoryOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={{marginBottom: '15px'}}>이전 대화 기록</h3>
            <div style={styles.historyList}>
              {chatHistory.map((item) => (
                <div key={item.id} style={{
                  ...styles.historyItem,
                  backgroundColor: item.id === currentChatId ? '#f0f4f0' : 'white'
                }} onClick={() => loadHistory(item)}>
                  <span style={styles.historyTitle}>{item.title.substring(0, 15)}...</span>
                  <span style={styles.historyDate}>{new Date(item.id).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              ))}
            </div>
            <button style={styles.closeBtn} onClick={() => setIsHistoryOpen(false)}>닫기</button>
          </div>
        </div>
      )}

      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogoArea}>
           <ShieldCheck size={22} color="#2D5A42" strokeWidth={2.5} />
           <span style={{ marginLeft: '8px', fontWeight: 'bold', fontSize: '19px', color: '#000' }}>안심온</span>
        </div>
        
        <button onClick={handleNewChat} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
          style={{ ...styles.newChatBtnSide, backgroundColor: isHovered ? '#e8e6df' : '#f5f4f0' }}>+ 새 대화</button>

        <div style={styles.sidebarSection}>
          <div style={styles.sectionTitle}>자주 묻는 질문</div>
          <div style={styles.questionList}>
            {FAQ_LIST.map((faq, i) => (
              <button key={i} style={styles.questionItem} onClick={() => handleSendMessage(faq)}>{faq}</button>
            ))}
          </div>
        </div>

        <button style={styles.historyBtn} onClick={() => setIsHistoryOpen(true)}>
          🕒 기록 보기 ({chatHistory.length})
        </button>
      </aside>

      <div style={styles.mainArea}>
        <header style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.navBtn}>〈 뒤로</button>
          <div style={styles.headerTitle}>💬 상담 대화창</div>
          <div style={{ width: '60px' }}></div>
        </header>

        <main style={{ ...styles.chatArea, opacity: opacity }}>
          {messages.map((msg) => (
            <div key={msg.id} style={msg.sender === 'user' ? styles.userMsgWrapper : styles.aiMsgWrapper}>
              <div style={msg.sender === 'user' ? styles.userBubble : styles.aiBubble}>{msg.text}</div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </main>

        <footer style={styles.footer}>
          <div style={styles.inputContainer}>
            <input 
              style={styles.input} 
              placeholder="내용을 입력하세요..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown} // 🔥 수정된 핸들러 연결
            />
            <button onClick={() => handleSendMessage()} style={styles.sendBtn}>➤</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatPage;