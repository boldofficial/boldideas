export async function getChatResponse(
  message: string, 
  history: {role: 'user' | 'model', parts: {text: string}[]}[] = []
) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, history }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data || typeof data.text !== 'string') {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response from API');
    }
    
    return data.text || "I'm sorry, I couldn't process that. Please try again or schedule a consultation via our website.";
    
  } catch (error) {
    console.error("Chat API Error:", error);
    
    // More specific error messages based on error type
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return "I'm having trouble connecting to the server. Please check your internet connection and try again.";
    }
    
    return "I'm having a little trouble connecting right now. Please reach out via our contact page at info@getboldideas.com!";
  }
}
