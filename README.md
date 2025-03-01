# FlowchartG

Um aplicativo web para criar, editar e compartilhar fluxogramas de forma simples e intuitiva.

![FlowchartG Screenshot](https://via.placeholder.com/800x400?text=FlowchartG)

<p align="center">
  <a href="#english">English</a> •
  <a href="#português">Português</a> •
  <a href="#español">Español</a> •
  <a href="#français">Français</a> •
  <a href="#deutsch">Deutsch</a>
</p>

## Funcionalidades

- Criação de fluxogramas com diferentes tipos de nós (retângulos, círculos, diamantes)
- Conexão entre nós com setas curvas elegantes
- Edição de texto em cada nó
- Controles de zoom intuitivos para melhor visualização
- Exportação de fluxogramas como PNG ou SVG
- Compartilhamento de fluxogramas via link
- Salvamento automático local

## Tecnologias Utilizadas

- React 18
- TypeScript
- Vite
- Fabric.js para manipulação de canvas
- Tailwind CSS para estilização

## Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn

## Instalação e Execução Local

1. Clone o repositório:
   ```bash
   git clone https://github.com/FuturoDevJunior/FlowchartG.git
   cd FlowchartG
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. Acesse o aplicativo em `http://localhost:5173`

## Deploy

### Vercel

1. Faça fork deste repositório
2. Importe o projeto no Vercel
3. Configure as variáveis de ambiente no painel do Vercel (opcional)
4. O projeto está configurado para funcionar imediatamente no Vercel

### Netlify

1. Faça fork deste repositório
2. Importe o projeto no Netlify
3. Configure o comando de build: `npm run build`
4. Configure o diretório de publicação: `dist`

## Estrutura do Projeto

```
/src
  /components
    /atoms       # Componentes básicos (botões, inputs, etc)
    /molecules   # Componentes compostos por atoms
    /organisms   # Componentes complexos
    /templates   # Layouts e templates
  /lib           # Utilitários e bibliotecas
  /types         # Definições de tipos TypeScript
  App.tsx        # Componente principal
  main.tsx       # Ponto de entrada
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.

## Autor

Desenvolvido por [DevFerreiraG](https://github.com/FuturoDevJunior)

<h2 id="english">🇬🇧 English</h2>

A professional web application for creating interactive flowcharts, built with modern web technologies. FlowchartG empowers users to visualize processes, algorithms, and workflows with an intuitive drag-and-drop interface.

### ✨ Key Features

- **Intuitive Design**: Create, edit, and connect flowchart nodes with simple drag & drop
- **Advanced Visualization**: Zoom controls and auto-centering for better diagram management
- **Export Options**: Download your work as PNG/SVG for presentations and documentation
- **Automatic Saving**: Never lose your work with real-time localStorage persistence
- **Sharing**: Share flowcharts via unique URLs with anyone
- **Responsive Experience**: Fully functional across desktop and mobile devices

### 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript and Fabric.js canvas manipulation
- **UI/UX**: Tailwind CSS for responsive, utility-first styling
- **Storage**: Local browser storage for data persistence
- **Deployment**: Optimized for Vercel deployment

### 🔒 Security Features

- Comprehensive input sanitization with DOMPurify
- Properly configured CORS policies
- HTTPS enforcement across all connections
- Minimized dependency footprint to reduce vulnerabilities

<h2 id="português">🇧🇷 Português</h2>

Uma aplicação web profissional para criação de fluxogramas interativos, construída com tecnologias web modernas. O FlowchartG capacita usuários a visualizar processos, algoritmos e fluxos de trabalho com uma interface intuitiva de arrastar e soltar.

### ✨ Recursos Principais

- **Design Intuitivo**: Crie, edite e conecte nós de fluxograma com simples arrastar e soltar
- **Visualização Avançada**: Controles de zoom e centralização automática para melhor gestão de diagramas
- **Opções de Exportação**: Baixe seu trabalho como PNG/SVG para apresentações e documentação
- **Salvamento Automático**: Nunca perca seu trabalho com persistência em tempo real no localStorage
- **Compartilhamento**: Compartilhe fluxogramas via URLs únicas com qualquer pessoa
- **Experiência Responsiva**: Totalmente funcional em dispositivos desktop e móveis

### 🛠️ Stack Tecnológica

- **Frontend**: React 18 com TypeScript e manipulação de canvas com Fabric.js
- **UI/UX**: Tailwind CSS para estilização responsiva e orientada a utilitários
- **Armazenamento**: Armazenamento local do navegador para persistência de dados
- **Implantação**: Otimizado para deploy no Vercel

### 🔒 Recursos de Segurança

- Sanitização abrangente de entrada com DOMPurify
- Políticas CORS configuradas adequadamente
- HTTPS obrigatório em todas as conexões
- Dependências minimizadas para reduzir vulnerabilidades

<h2 id="español">🇪🇸 Español</h2>

Una aplicación web profesional para crear diagramas de flujo interactivos, construida con tecnologías web modernas. FlowchartG permite a los usuarios visualizar procesos, algoritmos y flujos de trabajo con una interfaz intuitiva de arrastrar y soltar.

### ✨ Características Principales

- **Diseño Intuitivo**: Crea, edita y conecta nodos de diagrama con simple arrastrar y soltar
- **Visualización Avanzada**: Controles de zoom y centrado automático para mejor gestión de diagramas
- **Opciones de Exportación**: Descarga tu trabajo como PNG/SVG para presentaciones y documentación
- **Guardado Automático**: Nunca pierdas tu trabajo con persistencia en tiempo real en localStorage
- **Compartir**: Comparte diagramas a través de URLs únicos con cualquier persona
- **Experiencia Responsiva**: Completamente funcional en dispositivos de escritorio y móviles

### 🛠️ Stack Tecnológico

- **Frontend**: React 18 con TypeScript y manipulación de canvas con Fabric.js
- **UI/UX**: Tailwind CSS para estilización responsiva y orientada a utilidades
- **Almacenamiento**: Almacenamiento local del navegador para persistencia de datos
- **Despliegue**: Optimizado para despliegue en Vercel

### 🔒 Características de Seguridad

- Sanitización integral de entrada con DOMPurify
- Políticas CORS configuradas adecuadamente
- HTTPS obligatorio en todas las conexiones
- Dependencias minimizadas para reducir vulnerabilidades

<h2 id="français">🇫🇷 Français</h2>

Une application web professionnelle pour créer des organigrammes interactifs, construite avec des technologies web modernes. FlowchartG permet aux utilisateurs de visualiser des processus, des algorithmes et des flux de travail avec une interface intuitive de glisser-déposer.

### ✨ Fonctionnalités Clés

- **Conception Intuitive**: Créez, modifiez et connectez des nœuds d'organigramme par simple glisser-déposer
- **Visualisation Avancée**: Contrôles de zoom et centrage automatique pour une meilleure gestion des diagrammes
- **Options d'Exportation**: Téléchargez votre travail au format PNG/SVG pour présentations et documentation
- **Sauvegarde Automatique**: Ne perdez jamais votre travail grâce à la persistance en temps réel dans localStorage
- **Partage**: Partagez des organigrammes via des URLs uniques avec n'importe qui
- **Expérience Responsive**: Entièrement fonctionnel sur les appareils de bureau et mobiles

### 🛠️ Stack Technologique

- **Frontend**: React 18 avec TypeScript et manipulation de canvas avec Fabric.js
- **UI/UX**: Tailwind CSS pour un style responsive et orienté utilitaire
- **Stockage**: Stockage local du navigateur pour la persistance des données
- **Déploiement**: Optimisé pour le déploiement sur Vercel

### 🔒 Fonctionnalités de Sécurité

- Assainissement complet des entrées avec DOMPurify
- Politiques CORS correctement configurées
- HTTPS obligatoire sur toutes les connexions
- Dépendances minimisées pour réduire les vulnérabilités

<h2 id="deutsch">🇩🇪 Deutsch</h2>

Eine professionelle Webanwendung zur Erstellung interaktiver Flussdiagramme, entwickelt mit modernen Webtechnologien. FlowchartG ermöglicht Benutzern die Visualisierung von Prozessen, Algorithmen und Workflows mit einer intuitiven Drag-and-Drop-Oberfläche.

### ✨ Hauptfunktionen

- **Intuitives Design**: Erstellen, Bearbeiten und Verbinden von Flussdiagrammknoten durch einfaches Drag & Drop
- **Erweiterte Visualisierung**: Zoom-Steuerung und automatische Zentrierung für besseres Diagramm-Management
- **Exportoptionen**: Laden Sie Ihre Arbeit als PNG/SVG für Präsentationen und Dokumentationen herunter
- **Automatisches Speichern**: Verlieren Sie nie Ihre Arbeit durch Echtzeit-Persistenz im localStorage
- **Teilen**: Teilen Sie Flussdiagramme über eindeutige URLs mit jedem
- **Responsive Erfahrung**: Voll funktionsfähig auf Desktop- und Mobilgeräten

### 🛠️ Technologie-Stack

- **Frontend**: React 18 mit TypeScript und Fabric.js Canvas-Manipulation
- **UI/UX**: Tailwind CSS für responsive, utility-first Gestaltung
- **Speicherung**: Lokaler Browser-Speicher für Datenpersistenz
- **Bereitstellung**: Optimiert für Vercel-Deployment

### 🔒 Sicherheitsfunktionen

- Umfassende Eingabebereinigung mit DOMPurify
- Korrekt konfigurierte CORS-Richtlinien
- HTTPS-Durchsetzung für alle Verbindungen
- Minimierte Abhängigkeiten zur Reduzierung von Schwachstellen

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/FuturoDevJunior/FlowchartG.git
   cd FlowchartG
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

The application is optimized for immediate deployment on Vercel and Netlify with no additional configuration required.
