    exports.handler = async function(event, context) {
        try {
            const { prompt } = JSON.parse(event.body);
            const API_KEY = process.env.GEMINI_API_KEY;
            const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;
            
            const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };

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
            const text = result.candidates[0].content.parts[0].text;
            
            return {
                statusCode: 200,
                body: JSON.stringify({ text }),
            };

        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Erro ao processar a requisição.' }),
            };
        }
    };
    
