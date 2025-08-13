exports.handler = async function(event, context) {
    try {
        const { prompt } = JSON.parse(event.body);
        const API_KEY = process.env.GEMINI_API_KEY;
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${API_KEY}`;
        
        const payload = { 
            instances: [{ prompt: prompt }], 
            parameters: { "sampleCount": 1} 
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `Erro na API: ${response.statusText}` }),
            };
        }

        const result = await response.json();
        const base64Data = result?.predictions?.[0]?.bytesBase64Encoded;

        if (!base64Data) {
             return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Erro ao gerar a imagem.' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ image: base64Data }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao processar a requisição.' }),
        };
    }
};
