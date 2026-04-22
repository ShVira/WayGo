
/**
 * Сервіс для взаємодії з Google Gemini API (REST))
 */

const ALLOWED_TAGS = ['ToGo', 'Explore', 'Cozy', 'Active', 'Social', 'Nature', 'Special', 'Depressive'];

export const fetchAiTags = async (userInput: string): Promise<string[]> => {
  const apiKey = import.meta.env.VITE_GEMINI_KEY;

  if (!apiKey) {
    throw new Error('Gemini API Key is missing in environment variables');
  }

  const systemPrompt = `
    You are an expert empathetic location curator for the WayGo app. 
    Your job is to understand the user's implicit needs (weather, mood, activities, physical state) and map them to EXACTLY 1-3 of these tags: [${ALLOWED_TAGS.join(', ')}].

    STRICT TAG DEFINITIONS & ROUTING LOGIC:
    - "Cozy": Comfort, AC/heating, coffee, reading, laptops, soft seating. ROUTING: Use this if the user is sad, tired, or complaining about bad weather (too hot/too cold) and needs a comfortable indoor refuge.
    - "Nature": Parks, trees, sea, beaches, lakes. ROUTING: Use this if the user is stressed and needs peace, or if it is HOT and they need shade/water.
    - "Social": Bars, pubs, groups, talking, loud places. ROUTING: Use for hanging out with friends or meeting people.
    - "Explore": Sightseeing, museums, nice architecture, walking around new streets.
    - "ToGo": Street food, quick coffee, eating while walking.
    - "Active": Sports, running, gym, physical exertion.
    - "Special": Romantic dates, anniversaries, breathtaking views.
    - "Depressive": EXTREMELY RESTRICTED. Use ONLY if the user EXPLICITLY asks for abandoned places, dark tourism, brutalist architecture, or a creepy vibe. NEVER use this just because the user is sad, tired, or hot.

    SCENARIO EXAMPLES:
    - "Мені сумно, хочу каву" -> ["Cozy"] (User wants comfort, NOT a cemetery).
    - "Дуже спекотно" -> ["Nature", "Cozy"] (User wants shade or AC).
    - "Хочу поплакати під дощем" -> ["Cozy", "Nature"] (User wants a melancholic but safe space).
    - "Шукаю заброшки і готику" -> ["Depressive", "Explore"].

    CRITICAL RULE: Output ONLY a valid JSON array of strings. No markdown, no intro text, no explanations.
    Format: ["Tag1", "Tag2"]
  `;

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;


try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser input: "${userInput}"`
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch from Gemini');
    }

    const data = await response.json();
    let rawText = data.candidates[0].content.parts[0].text;

    // Очищення від Markdown блоків (```json ... ```)
    const cleanJson = rawText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const tags = JSON.parse(cleanJson);

    if (!Array.isArray(tags)) {
      throw new Error('Invalid response format from Gemini AI');
    }

    // Фільтруємо лише дозволені теги
    return tags.filter(tag => ALLOWED_TAGS.includes(tag));
  } catch (error) {
    console.error('Gemini AI Search Error:', error);
    throw error;
  }
};
