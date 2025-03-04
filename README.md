#EM ANDAMENTO FlowchartG

Um aplicativo web para criar, editar e compartilhar fluxogramas de forma simples e intuitiva. Funciona 100% no navegador, sem necessidade de autenticação ou backend.

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
- Interface responsiva para desktop e dispositivos móveis
- Funciona 100% offline após o primeiro carregamento

## Tecnologias Utilizadas

- React 18
- TypeScript
- Vite
- Fabric.js para manipulação de canvas
- Tailwind CSS para estilização
- DOMPurify para sanitização de dados

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
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`
   ```
   VITE_LOCAL_STORAGE_KEY=flowchart_g_data
   VITE_APP_VERSION=1.0.0
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Acesse o aplicativo em `http://localhost:5173`

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executa o linter
- `npm run lint:fix` - Corrige problemas de linting automaticamente
- `npm run test` - Executa os testes
- `npm run test:watch` - Executa os testes em modo de observação
- `npm run test:coverage` - Executa os testes com relatório de cobertura
- `npm run cypress` - Abre o Cypress para testes E2E
- `npm run cypress:headless` - Executa testes E2E em modo headless
- `npm run analyze` - Analisa o tamanho do bundle
- `npm run clean` - Remove arquivos de build e cache
- `npm run docker:build` - Constrói a imagem Docker
- `npm run docker:run` - Executa o container Docker
- `npm run docker:compose` - Inicia todos os serviços com Docker Compose
- `npm run docker:stop` - Para todos os serviços do Docker Compose

## Docker

Para executar o projeto usando Docker:

```bash
# Construir e iniciar com Docker Compose
npm run docker:compose

# Ou construir e executar manualmente
npm run docker:build
npm run docker:run
```

Acesse o aplicativo em `http://localhost:8080`

## Deploy

### Vercel (Recomendado)

1. Faça fork deste repositório
2. Importe o projeto no Vercel:
   - Acesse vercel.com e faça login
   - Clique em "Add New..." > "Project"
   - Selecione seu repositório
   - Mantenha as configurações padrão, pois o `vercel.json` já contém tudo
3. Configure as variáveis de ambiente no painel do Vercel:
   - `VITE_LOCAL_STORAGE_KEY=flowchart_g_data`
   - `VITE_APP_VERSION=1.0.0`
4. Clique em "Deploy" e aguarde a construção
5. Acesse seu aplicativo na URL fornecida pelo Vercel

### GitHub Pages

1. Faça fork deste repositório
2. Clone-o para sua máquina local
3. Configure o base path para o nome do seu repositório:
   - Crie/edite o arquivo `.env.local` e adicione:
   ```
   VITE_BASE_PATH=/seu-repositorio/
   ```
   - Substitua "seu-repositorio" pelo nome do seu repositório no GitHub
4. Faça deploy com um único comando:
   ```bash
   npm run deploy:github
   ```
5. Acesse seu site em `https://seu-usuario.github.io/seu-repositorio/`
6. Configure o GitHub Pages nas configurações do repositório:
   - Acesse a aba "Settings" > "Pages"
   - Na seção "Source", selecione "Deploy from a branch"
   - Selecione a branch "gh-pages" e pasta "/ (root)"
   - Clique em "Save"

### Netlify

1. Faça fork deste repositório
2. Importe o projeto no Netlify
3. Configure o comando de build: `npm run build`
4. Configure o diretório de publicação: `dist`
5. Configure as variáveis de ambiente necessárias
6. O deploy será feito automaticamente

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

## Otimizações e Performance

O FlowchartG foi cuidadosamente otimizado para:
- Carregamento rápido (< 2s até interatividade)
- Bundle mínimo (< 400KB gzipped)
- Zero dependências de backend
- Funcionamento offline completo
- Consumo mínimo de recursos
- Suporte a múltiplos dispositivos e tamanhos de tela

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add some amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Autor

Desenvolvido por [DevFerreiraG](https://github.com/FuturoDevJunior)

<h2 id="english">🇬🇧 English</h2>

A professional web application for creating interactive flowcharts, built with modern web technologies. FlowchartG empowers users to visualize processes, algorithms, and workflows with an intuitive drag-and-drop interface. The application works entirely in the browser without requiring authentication or backend services.

### ✨ Key Features

- **Intuitive Design**: Create, edit, and connect flowchart nodes with simple drag & drop
- **Advanced Visualization**: Zoom controls and auto-centering for better diagram management
- **Export Options**: Download your work as PNG/SVG for presentations and documentation
- **Automatic Saving**: Never lose your work with real-time localStorage persistence
- **Sharing**: Share flowcharts via unique URLs with anyone
- **Responsive Experience**: Fully functional across desktop and mobile devices
- **Offline Capability**: Works completely offline after initial load

### 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript and Fabric.js canvas manipulation
- **UI/UX**: Tailwind CSS for responsive, utility-first styling
- **Storage**: Local browser storage for data persistence
- **Security**: DOMPurify for data sanitization
- **Build**: Vite for lightning-fast development and optimized builds
- **Deployment**: Optimized for Vercel, Netlify and GitHub Pages

### 🔒 Security Features

- Comprehensive input sanitization with DOMPurify
- Properly configured CORS policies
- HTTPS enforcement across all connections
- Minimized dependency footprint to reduce vulnerabilities
- No third-party services or backend requirements

<h2 id="português">🇧🇷 Português</h2>

Uma aplicação web profissional para criação de fluxogramas interativos, construída com tecnologias web modernas. O FlowchartG capacita usuários a visualizar processos, algoritmos e fluxos de trabalho com uma interface intuitiva de arrastar e soltar. A aplicação funciona inteiramente no navegador, sem necessidade de autenticação ou serviços de backend.

### ✨ Recursos Principais

- **Design Intuitivo**: Crie, edite e conecte nós de fluxograma com simples arrastar e soltar
- **Visualização Avançada**: Controles de zoom e centralização automática para melhor gestão de diagramas
- **Opções de Exportação**: Baixe seu trabalho como PNG/SVG para apresentações e documentação
- **Salvamento Automático**: Nunca perca seu trabalho com persistência em tempo real no localStorage
- **Compartilhamento**: Compartilhe fluxogramas via URLs únicas com qualquer pessoa
- **Experiência Responsiva**: Totalmente funcional em dispositivos desktop e móveis
- **Capacidade Offline**: Funciona completamente offline após o carregamento inicial

### 🛠️ Stack Tecnológica

- **Frontend**: React 18 com TypeScript e manipulação de canvas com Fabric.js
- **UI/UX**: Tailwind CSS para estilização responsiva e orientada a utilitários
- **Armazenamento**: Armazenamento local do navegador para persistência de dados
- **Segurança**: DOMPurify para sanitização de dados
- **Build**: Vite para desenvolvimento ultrarrápido e builds otimizados
- **Implantação**: Otimizado para Vercel, Netlify e GitHub Pages

### 🔒 Recursos de Segurança

- Sanitização abrangente de entrada com DOMPurify
- Políticas CORS configuradas adequadamente
- HTTPS obrigatório em todas as conexões
- Dependências minimizadas para reduzir vulnerabilidades
- Sem serviços de terceiros ou requisitos de backend

<h2 id="español">🇪🇸 Español</h2>

Una aplicación web profesional para crear diagramas de flujo interactivos, construida con tecnologías web modernas. FlowchartG permite a los usuarios visualizar procesos, algoritmos y flujos de trabajo con una interfaz intuitiva de arrastrar y soltar. La aplicación funciona completamente en el navegador sin necesidad de autenticación o servicios de backend.

### ✨ Características Principales

- **Diseño Intuitivo**: Crea, edita y conecta nodos de diagrama con simple arrastrar y soltar
- **Visualización Avanzada**: Controles de zoom y centrado automático para mejor gestión de diagramas
- **Opciones de Exportación**: Descarga tu trabajo como PNG/SVG para presentaciones y documentación
- **Guardado Automático**: Nunca pierdas tu trabajo con persistencia en tiempo real en localStorage
- **Compartir**: Comparte diagramas a través de URLs únicos con cualquier persona
- **Experiencia Responsiva**: Completamente funcional en dispositivos de escritorio y móviles
- **Capacidad Offline**: Funciona completamente sin conexión después de la carga inicial

### 🛠️ Stack Tecnológico

- **Frontend**: React 18 con TypeScript y manipulación de canvas con Fabric.js
- **UI/UX**: Tailwind CSS para estilización responsiva y orientada a utilidades
- **Almacenamiento**: Almacenamiento local del navegador para persistencia de datos
- **Seguridad**: DOMPurify para sanitización de datos
- **Build**: Vite para desarrollo ultrarrápido y builds optimizados
- **Despliegue**: Optimizado para Vercel, Netlify y GitHub Pages

### 🔒 Características de Seguridad

- Sanitización integral de entrada con DOMPurify
- Políticas CORS configuradas adecuadamente
- HTTPS obligatorio en todas las conexiones
- Dependencias minimizadas para reducir vulnerabilidades
- Sin servicios de terceros o requisitos de backend

<h2 id="français">🇫🇷 Français</h2>

Une application web professionnelle pour créer des organigrammes interactifs, construite avec des technologies web modernes. FlowchartG permet aux utilisateurs de visualiser des processus, des algorithmes et des flux de travail avec une interface intuitive de glisser-déposer. L'application fonctionne entièrement dans le navigateur sans nécessiter d'authentification ou de services backend.

### ✨ Fonctionnalités Clés

- **Conception Intuitive**: Créez, modifiez et connectez des nœuds d'organigramme par simple glisser-déposer
- **Visualisation Avancée**: Contrôles de zoom et centrage automatique pour une meilleure gestion des diagrammes
- **Options d'Exportation**: Téléchargez votre travail au format PNG/SVG pour présentations et documentation
- **Sauvegarde Automatique**: Ne perdez jamais votre travail grâce à la persistance en temps réel dans localStorage
- **Partage**: Partagez des organigrammes via des URLs uniques avec n'importe qui
- **Expérience Responsive**: Entièrement fonctionnel sur les appareils de bureau et mobiles
- **Capacité Hors Ligne**: Fonctionne complètement hors ligne après le chargement initial

### 🛠️ Stack Technologique

- **Frontend**: React 18 avec TypeScript et manipulation de canvas avec Fabric.js
- **UI/UX**: Tailwind CSS pour un style responsive et orienté utilitaire
- **Stockage**: Stockage local du navigateur pour la persistance des données
- **Sécurité**: DOMPurify pour l'assainissement des données
- **Build**: Vite pour un développement ultra-rapide et des builds optimisés
- **Déploiement**: Optimisé pour Vercel, Netlify et GitHub Pages

### 🔒 Fonctionnalités de Sécurité

- Assainissement complet des entrées avec DOMPurify
- Politiques CORS correctement configurées
- HTTPS obligatoire sur toutes les connexions
- Dépendances minimisées pour réduire les vulnérabilités
- Aucun service tiers ou exigence de backend

<h2 id="deutsch">🇩🇪 Deutsch</h2>

Eine professionelle Webanwendung zur Erstellung interaktiver Flussdiagramme, entwickelt mit modernen Webtechnologien. FlowchartG ermöglicht Benutzern die Visualisierung von Prozessen, Algorithmen und Workflows mit einer intuitiven Drag-and-Drop-Oberfläche. Die Anwendung funktioniert vollständig im Browser ohne Authentifizierung oder Backend-Dienste.

### ✨ Hauptfunktionen

- **Intuitives Design**: Erstellen, Bearbeiten und Verbinden von Flussdiagrammknoten durch einfaches Drag & Drop
- **Erweiterte Visualisierung**: Zoom-Steuerung und automatische Zentrierung für besseres Diagramm-Management
- **Exportoptionen**: Laden Sie Ihre Arbeit als PNG/SVG für Präsentationen und Dokumentationen herunter
- **Automatisches Speichern**: Verlieren Sie nie Ihre Arbeit durch Echtzeit-Persistenz im localStorage
- **Teilen**: Teilen Sie Flussdiagramme über eindeutige URLs mit jedem
- **Responsive Erfahrung**: Voll funktionsfähig auf Desktop- und Mobilgeräten
- **Offline-Fähigkeit**: Funktioniert nach dem ersten Laden vollständig offline

### 🛠️ Technologie-Stack

- **Frontend**: React 18 mit TypeScript und Fabric.js Canvas-Manipulation
- **UI/UX**: Tailwind CSS für responsive, utility-first Gestaltung
- **Speicherung**: Lokaler Browser-Speicher für Datenpersistenz
- **Sicherheit**: DOMPurify für Datenbereinigung
- **Build**: Vite für blitzschnelle Entwicklung und optimierte Builds
- **Bereitstellung**: Optimiert für Vercel, Netlify und GitHub Pages

### 🔒 Sicherheitsfunktionen

- Umfassende Eingabebereinigung mit DOMPurify
- Korrekt konfigurierte CORS-Richtlinien
- HTTPS-Durchsetzung für alle Verbindungen
- Minimierte Abhängigkeiten zur Reduzierung von Schwachstellen
- Keine Drittanbieterdienste oder Backend-Anforderungen

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

3. Create a `.env` file with the following content:
   ```
   VITE_LOCAL_STORAGE_KEY=flowchart_g_data
   VITE_APP_VERSION=1.0.0
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

The application is optimized for immediate deployment on Vercel and Netlify with no additional configuration required. Simply connect your GitHub repository to either service, and the application will be automatically built and deployed.
