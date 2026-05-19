/**
 * 구글 v1beta 엔드포인트를 적용하여 404 Not Found를 완벽하게 해결한 최종 api.js
 */
export const getAIResponse = async (userMessage) => {
  // ⚠️ 서박 리더의 소중한 새 API 키! 그대로 유지합니다.
  const API_KEY = "AIzaSyC_m5Jlvg2ahBO5im0f-AkWEXprCJWcVDQ"; 
  
  // 💡 해결의 열쇠: v1 대신 'v1beta' 주소를 사용하면 구글이 1.5-flash 모델을 바로 인식합니다!
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  try {
    const prompt = `당신은 가정폭력 피해자를 돕는 따뜻하고 전문적인 상담사입니다. 
사용자의 고민에 공감하고, 실질적인 도움(진단서, 고소, 보호시설 등)을 친절하게 안내하세요.
답변은 한국어로 정중하게 작성하세요.

사용자 질문: ${userMessage}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return `[구글 서버 에러]: ${errorText}`;
    }

    const data = await response.json();
    
    // 안전하게 답변 텍스트만 파싱하여 리턴
    if (data && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      return `[데이터 구조 에러]: 응답 형식이 다릅니다. ${JSON.stringify(data)}`;
    }

  } catch (error) {
    console.error("🔴 Gemini API 최종 에러:", error);
    return `[클라이언트 오류]: ${error.message}`;
  }
};