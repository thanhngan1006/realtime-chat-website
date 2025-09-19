import { withErrorHandler } from '../utils/error-handler';
import { GoogleGenAI } from '@google/genai';

class AIService {
  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      console.error('VITE_GEMINI_API_KEY is not defined in .env file');
      throw new Error('API Key for AI Service is missing.');
    }

    this.ai = new GoogleGenAI({ apiKey });
  }

  generateResponse = withErrorHandler(async (messageHistory) => {
    try {
      const prompt = messageHistory
        .map((msg) => `${msg.role}: ${msg.parts[0].text}`)
        .join('\n');

      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash-latest',
        contents: prompt,
      });

      const text = response.text;

      return text;
    } catch (error) {
      console.error('Lỗi từ Google GenAI Service:', error);
      return 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.';
    }
  });
}

export const aiService = new AIService();
