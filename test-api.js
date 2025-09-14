require('dotenv').config();

async function testGeminiAPI() {
    const API_KEY = process.env.GEMINI_API_KEY;
    console.log('Testing API key:', API_KEY ? API_KEY.substring(0, 10) + '...' : 'NOT FOUND');
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: 'Hello, this is a test message'
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: 100,
                    temperature: 0.7
                }
            })
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', response.status, response.statusText);
            console.error('Error details:', errorText);
            return;
        }

        const data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2));
        
        if (data.candidates && data.candidates[0]) {
            console.log('Generated text:', data.candidates[0].content.parts[0].text);
        }
        
    } catch (error) {
        console.error('Error testing API:', error);
    }
}

testGeminiAPI();