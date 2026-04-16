document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatWindow = document.getElementById('chat-window');
    const storePreview = document.getElementById('store-preview');
    const fullCode = document.getElementById('full-code');
    const codeOverlay = document.getElementById('code-overlay');
    const toggleCode = document.getElementById('toggle-code');

    // Estado inicial de la tienda (un lienzo en blanco profesional)
    let storeCode = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: sans-serif; margin: 0; padding: 20px; color: #333; text-align: center; }
                .container { max-width: 800px; margin: auto; padding: 40px; border: 2px dashed #ccc; border-radius: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Tu nueva tienda aparecerá aquí</h2>
                <p>Usa el chat para pedir diseños, productos o configuraciones.</p>
            </div>
        </body>
        </html>
    `;

    // Función para actualizar el visor
    const updateVisor = (newContent, type) => {
        // Al recibir código nuevo, reemplazamos el estado completo para verlo renderizado al 100%
        storeCode = newContent;

        // Renderizar en el iframe
        const doc = storePreview.contentWindow.document;
        doc.open();
        doc.write(storeCode);
        doc.close();

        // Actualizar overlay de código para usuarios curiosos
        fullCode.textContent = storeCode;
    };

    // Inicializar visor
    updateVisor(storeCode);

    // Toggle para ver código
    toggleCode.addEventListener('click', () => {
        codeOverlay.classList.toggle('hidden');
        toggleCode.textContent = codeOverlay.classList.contains('hidden') ? 'Ver Código' : 'Cerrar Código';
    });

    const processResponse = (text) => {
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
        let match;
        let cleanText = text;

        while ((match = codeBlockRegex.exec(text)) !== null) {
            const lang = match[1] || 'html';
            const code = match[2];
            
            updateVisor(code, lang);
            cleanText = cleanText.replace(match[0], `<div class="impl-hint">✨ ¡Vista previa actualizada!</div>`);
        }
        return cleanText;
    };

    const addMessage = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        if (sender === 'bot') {
            messageDiv.innerHTML = processResponse(text);
        } else {
            messageDiv.textContent = text;
        }
        chatMessages.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        if (!message) return;

        userInput.value = '';
        addMessage(message, 'user');

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot loading';
        loadingDiv.textContent = '...';
        chatMessages.appendChild(loadingDiv);

        try {
            // MOCK RESPONSE para frontend limpio sin backend
            // En una implementación real, esto llamaría a /chat
            setTimeout(() => {
                if (loadingDiv && loadingDiv.parentNode === chatMessages) {
                    chatMessages.removeChild(loadingDiv);
                }

                const mockResponses = [
                    "¡Hecho! He diseñado tu tienda de ropa con un estilo premium. Mira el visor a tu derecha.\n\n```html\n<!DOCTYPE html>\n<html>\n<head>\n<style>\nbody { font-family: 'Playfair Display', serif; background: #fdfbf7; color: #1a1a1a; }\nheader { padding: 40px; text-align: center; border-bottom: 1px solid #eee; }\n.hero { height: 500px; background: url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1000&q=80') center/cover; display: flex; align-items: center; justify-content: center; color: white; }\n.hero h1 { font-size: 4rem; text-shadow: 2px 2px 10px rgba(0,0,0,0.5); }\n.products { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 40px; }\n.product-card { border: 1px solid #eee; padding: 10px; text-align: center; }\n.product-card img { width: 100%; height: 250px; object-fit: cover; }\n</style>\n</head>\n<body>\n<header><h1>NUBE FASHION</h1></header>\n<section class=\"hero\"><h1>Colección Otoño 2024</h1></section>\n<section class=\"products\">\n<div class=\"product-card\"><img src=\"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80\"><h3>Vestido Minimal</h3><p>$45.00</p></div>\n<div class=\"product-card\"><img src=\"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=500&q=80\"><h3>Chaqueta Urban</h3><p>$89.00</p></div>\n<div class=\"product-card\"><img src=\"https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=500&q=80\"><h3>Accesorios Premium</h3><p>$25.00</p></div>\n</section>\n</body>\n</html>\n```",
                    "Claro, he actualizado los colores a una paleta más vibrante.\n\n```html\n<!DOCTYPE html>\n<html>\n<head>\n<style>\nbody { font-family: 'Inter', sans-serif; background: #fff; color: #333; }\n.banner { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 60px; text-align: center; }\n.grid { display: flex; justify-content: space-around; padding: 50px; }\n.item { background: #f8f9fa; border-radius: 15px; padding: 20px; width: 25%; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }\n</style>\n</head>\n<body>\n<div class=\"banner\"><h1>TU TIENDA TECH</h1><p>Lo último en tecnología</p></div>\n<div class=\"grid\">\n<div class=\"item\"><h3>Gadgets</h3></div>\n<div class=\"item\"><h3>Audio</h3></div>\n<div class=\"item\"><h3>Gaming</h3></div>\n</div>\n</body>\n</html>\n```"
                ];

                const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
                addMessage(randomResponse, 'bot');
            }, 1500);

            /* 
            // CÓDIGO ORIGINAL CON BACKEND:
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message }),
            });
            const data = await response.json();
            
            if (loadingDiv && loadingDiv.parentNode === chatMessages) {
                chatMessages.removeChild(loadingDiv);
            }

            if (data.response) {
                addMessage(data.response, 'bot');
            }
            */
        } catch (error) {
            if (loadingDiv && loadingDiv.parentNode === chatMessages) {
                chatMessages.removeChild(loadingDiv);
            }
            addMessage('Error de conexión.', 'bot');
        }
    });
});
