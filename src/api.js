/**
 * 구글 최신 규격을 적용하여 404와 400 에러를 완벽히 해결한 api.js
 */
export const getAIResponse = async (userMessage) => {
  // ⚠️ 발급받으신 실제 구글 API 키를 따옴표 안에 정확히 넣어주세요! (예: "AIzaSy...")
  const API_KEY = "AIzaSyCUOUYZZBE-READ0m6rAI7mjpG94DzdVhg"; 
  
  // 💡 [해결책 1] 모델 이름을 최신 규격인 'gemini-2.5-flash'로 변경합니다.
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

  try {
    const prompt = `당신은 가정폭력 피해자를 돕는 따뜻하고 전문적인 상담사입니다. 
사용자의 고민에 공감하고, 실질적인 도움(진단서, 고소, 보호시설 등)을 친절하게 안내하세요.
답변은 한국어로 정중하게 작성하세요.

사용자 질문: ${userMessage}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 💡 [해결책 2] API 키 유효성 에러(400)를 방지하기 위해 헤더에 키를 안전하게 담아 전송합니다.
        "x-goog-api-key": API_KEY 
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