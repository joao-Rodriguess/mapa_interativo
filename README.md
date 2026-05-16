# 🌍 Mapa Seguro (OpenStreetMap)
![Banner do Projeto](file:///C:/Users/Windows%2010/.gemini/antigravity/brain/1efdc1fb-7771-4a98-a0c3-c8ee167f72d5/mapa_seguro_banner_1778965700606.png)

> **Controle gestual avançado aliado à cartografia digital de precisão.**

O **Mapa Seguro** é uma interface cartográfica interativa que redefine a experiência de navegação. Utilizando Inteligência Artificial para rastreamento de mãos em tempo real (MediaPipe), o sistema permite que o usuário manipule o mapa sem a necessidade de toque físico, proporcionando uma experiência higiênica, futurista e acessível.

---

## ✨ Funcionalidades Principais

*   **📍 Navegação Gestual**: Arraste o mapa simplesmente fechando a mão (punho) e movendo-a no ar.
*   **🌓 Interface Premium (Glassmorphism)**: UI moderna com efeitos de desfoque, transparência e tons neon que se adaptam ao tema escuro.
*   **🗺️ Cartografia OpenStreetMap**: Integração robusta com Leaflet e camadas de mapas globais.
*   **🤖 IA Integrada**: Utiliza o MediaPipe Hands para processamento de visão computacional diretamente no navegador.
*   **📱 Responsividade**: Design otimizado para diferentes resoluções, mantendo a performance.

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído com o que há de mais moderno no desenvolvimento web "vanilla":

*   [**HTML5**](https://developer.mozilla.org/en-US/docs/Web/HTML) & [**CSS3**](https://developer.mozilla.org/en-US/docs/Web/CSS) (Custom Properties, Glassmorphism)
*   [**JavaScript ES6+**](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
*   [**Leaflet.js**](https://leafletjs.com/) (Motor de mapas)
*   [**MediaPipe Hands**](https://google.github.io/mediapipe/solutions/hands.html) (Visão Computacional)
*   [**Google Fonts**](https://fonts.google.com/) (Inter)

---

## 🎮 Como Operar o Sistema

### 1. Preparação
Para garantir o funcionamento da câmera e da IA, execute o projeto em um ambiente de servidor local:
*   Use a extensão **Live Server** no VS Code.
*   Ou use o comando: `npx serve` ou `python -m http.server`.

### 2. Controles por Gestos
| Gesto | Ação |
| :--- | :--- |
| **✋ Mão Aberta** | Modo de espera / Visualização |
| **✊ Mão Fechada (Punho)** | Segurar e Arrastar o mapa |
| **📍 Posicionamento** | O mapa centraliza automaticamente na sua localização (se permitido) |

---

## 🛠️ Configuração Técnica

O sistema está configurado para rodar "out-of-the-box". Não é necessário instalar dependências pesadas, pois os modelos de IA são carregados via CDN otimizado.

1.  Clone este repositório.
2.  Abra o `index.html` através de um servidor local.
3.  Conceda permissão de acesso à webcam quando solicitado.

---

## 🎨 Design System

*   **Cores**: Indigo (#6366f1), Slate (#0f172a), Emerald (#22c55e).
*   **Tipografia**: Inter (Sans-serif moderna).
*   **Efeitos**: Backdrop-filter blur, box-shadows suaves e bordas translúcidas.

---

<p align="center">
  Desenvolvido com ❤️ para a próxima geração de interfaces web.
</p>
