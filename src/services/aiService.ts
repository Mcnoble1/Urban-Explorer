import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateFunFact(locationName: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Give me a single interesting and unique fact about ${locationName} in 1-2 sentences. Make it engaging and fun.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return (
      text ||
      'This location has a fascinating history waiting to be discovered!'
    );
  } catch (error) {
    console.error('Error generating fun fact:', error);
    return 'This location has a fascinating history waiting to be discovered!';
  }
}
