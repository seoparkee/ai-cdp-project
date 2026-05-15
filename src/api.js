import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// 1. API 키 (서박 리더의 키 그대로 사용)
const API_KEY = "AIzaSyANOdLCxjqyJLDUDiriN8_nJRwzzQZjNq4"; 
const genAI = new GoogleGenerativeAI(API_KEY);

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

export const getAIResponse = async (userMessage) => {
  try {
    // 2. 모델명을 가장 범용적인 'gemini-pro'로 변경 (404 에러 방지)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro", 
      safetySettings 
    });

    const prompt = `당신은 가정폭력 피해자를 돕는 따뜻하고 전문적인 상담사입니다. 
사용자의 고민에 공감하고, 실질적인 도움(진단서, 신고, 보호시설 등)을 친절하게 안내하세요.
답변은 한국어로 정중하게 작성하세요.

사용자 질문: ${userMessage}`;

    // 3. 가장 표준적인 텍스트 생성 방식 사용
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Gemini 상세 에러:", error);
    // 에러가 나더라도 사용자가 당황하지 않게 안내
    return "상담 연결에 문제가 생겼습니다. 구글 AI 스튜디오에서 API 키의 모델 권한(Gemini Pro)을 확인하시거나, 잠시 후 다시 시도해 주세요.";
  }
};