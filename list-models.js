require('dotenv').config();

async function listModels() {
    const API_KEY = process.env.GEMINI_API_KEY;
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error listing models:', response.status, errorText);
            return;
        }

        const data = await response.json();
        console.log('Available models:');
        data.models.forEach(model => {
            console.log('- Name:', model.name);
            console.log('  Display Name:', model.displayName);
            console.log('  Supported Methods:', model.supportedGenerationMethods);
            console.log('---');
        });
        
    } catch (error) {
        console.error('Error:', error);
    }
}

listModels();