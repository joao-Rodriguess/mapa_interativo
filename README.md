# Mapa Interativo com Controle Gestual

Este projeto permite controlar um mapa do Google Maps usando movimentos das mãos capturados pela webcam.

## Como Usar

1. **Obtenha uma API Key do Google Maps**:
   - Você precisará de uma chave de API válida para ver o mapa corretamente.
   - Sem a chave, o mapa pode ficar escuro ou com marcas d'água, mas a interface funcionará.

2. **Execute o Servidor Local**:
   - Devido a políticas de segurança dos navegadores, a câmera e alguns recursos podem não funcionar se você abrir o arquivo `index.html` clicando duas vezes nele.
   - Use uma extensão como "Live Server" no VS Code.
   - Ou, se tiver Python instalado, abra o terminal nesta pasta e rode:
     ```bash
     python -m http.server
     ```
   - Ou com Node.js:
     ```bash
     npx serve
     ```

3. **Interagindo**:
   - Abra o navegador no endereço local (ex: `http://localhost:8000`).
   - Cole sua API Key na janela que aparecer.
   - **Permita o acesso à Câmera**.
   - **Mover o Mapa (Pan)**: Feche a mão (punho) e mova-a para arrastar o mapa como se fosse um papel.
   - **Zoom**: (Em breve) Use gestos de pinça.

## Requisitos
- Navegador moderno (Chrome, Edge, Firefox).
- Webcam.

## Tecnologias
- HTML5 / CSS3 (Glassmorphism UI).
- JavaScript (Vanilla).
- Google Maps JavaScript API.
- MediaPipe Hands (Google).
