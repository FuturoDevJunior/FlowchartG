# FlowchartSaaS

Um aplicativo web para criar, editar e compartilhar fluxogramas de forma simples e intuitiva.

![FlowchartSaaS Screenshot](https://via.placeholder.com/800x400?text=FlowchartSaaS)

## Funcionalidades

- Criação de fluxogramas com diferentes tipos de nós (retângulos, círculos, diamantes)
- Conexão entre nós com setas
- Edição de texto em cada nó
- Exportação de fluxogramas como PNG ou SVG
- Compartilhamento de fluxogramas via link
- Salvamento automático local
- Salvamento na nuvem (requer autenticação)
- Autenticação via magic link (email)

## Tecnologias Utilizadas

- React 18
- TypeScript
- Vite
- Fabric.js para manipulação de canvas
- Tailwind CSS para estilização
- Supabase para autenticação e armazenamento

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
   - Preencha com suas credenciais do Supabase

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
3. Configure as variáveis de ambiente no painel do Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Netlify

1. Faça fork deste repositório
2. Importe o projeto no Netlify
3. Configure as variáveis de ambiente no painel do Netlify
4. Configure o comando de build: `npm run build`
5. Configure o diretório de publicação: `dist`

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

Desenvolvido por [DevFerreiraG](https://linkedin.com/in/DevFerreiraG)

<p align="center">
  <a href="#english">English</a> •
  <a href="#português">Português</a> •
  <a href="#español">Español</a> •
  <a href="#français">Français</a> •
  <a href="#deutsch">Deutsch</a>
</p>

<h2 id="english">🇬🇧 English</h2>

A professional micro-SaaS solution for creating interactive flowcharts, built with modern web technologies. FlowchartSaaS empowers teams to visualize processes, algorithms, and workflows with an intuitive drag-and-drop interface.

### ✨ Key Features

- **Intuitive Design**: Create, edit, and connect flowchart nodes with simple drag & drop
- **Export Options**: Download your work as PNG/SVG for presentations and documentation
- **Automatic Saving**: Never lose your work with real-time localStorage persistence
- **Collaboration**: Share flowcharts via unique URLs with team members
- **Cloud Integration**: Seamless Supabase backend for authenticated users
- **Responsive Experience**: Fully functional across desktop and mobile devices

### 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript and Fabric.js canvas manipulation
- **UI/UX**: Tailwind CSS for responsive, utility-first styling
- **Authentication**: Secure Magic Link authentication via Supabase
- **Data Storage**: Hybrid approach with localStorage and Supabase
- **CI/CD**: Automated deployment with Docker and GitHub Actions

### 🔒 Enterprise-Grade Security

- Comprehensive input sanitization with DOMPurify
- Properly configured CORS policies
- HTTPS enforcement across all connections
- Minimized dependency footprint to reduce vulnerabilities
- Row Level Security implementation in Supabase

<h2 id="português">🇧🇷 Português</h2>

Uma solução micro-SaaS profissional para criação de fluxogramas interativos, construída com tecnologias web modernas. O FlowchartSaaS capacita equipes a visualizar processos, algoritmos e fluxos de trabalho com uma interface intuitiva de arrastar e soltar.

### ✨ Recursos Principais

- **Design Intuitivo**: Crie, edite e conecte nós de fluxograma com simples arrastar e soltar
- **Opções de Exportação**: Baixe seu trabalho como PNG/SVG para apresentações e documentação
- **Salvamento Automático**: Nunca perca seu trabalho com persistência em tempo real no localStorage
- **Colaboração**: Compartilhe fluxogramas via URLs únicas com membros da equipe
- **Integração com Nuvem**: Backend Supabase perfeito para usuários autenticados
- **Experiência Responsiva**: Totalmente funcional em dispositivos desktop e móveis

### 🛠️ Stack Tecnológica

- **Frontend**: React 18 com TypeScript e manipulação de canvas com Fabric.js
- **UI/UX**: Tailwind CSS para estilização responsiva e orientada a utilitários
- **Autenticação**: Autenticação segura via Magic Link através do Supabase
- **Armazenamento de Dados**: Abordagem híbrida com localStorage e Supabase
- **CI/CD**: Implantação automatizada com Docker e GitHub Actions

### 🔒 Segurança de Nível Empresarial

- Sanitização abrangente de entrada com DOMPurify
- Políticas CORS configuradas adequadamente
- HTTPS obrigatório em todas as conexões
- Dependências minimizadas para reduzir vulnerabilidades
- Implementação de Segurança em Nível de Linha no Supabase

<h2 id="español">🇪🇸 Español</h2>

Una solución micro-SaaS profesional para crear diagramas de flujo interactivos, construida con tecnologías web modernas. FlowchartSaaS permite a los equipos visualizar procesos, algoritmos y flujos de trabajo con una interfaz intuitiva de arrastrar y soltar.

### ✨ Características Principales

- **Diseño Intuitivo**: Crea, edita y conecta nodos de diagrama con simple arrastrar y soltar
- **Opciones de Exportación**: Descarga tu trabajo como PNG/SVG para presentaciones y documentación
- **Guardado Automático**: Nunca pierdas tu trabajo con persistencia en tiempo real en localStorage
- **Colaboración**: Comparte diagramas a través de URLs únicos con miembros del equipo
- **Integración en la Nube**: Backend Supabase perfecto para usuarios autenticados
- **Experiencia Responsiva**: Completamente funcional en dispositivos de escritorio y móviles

### 🛠️ Stack Tecnológico

- **Frontend**: React 18 con TypeScript y manipulación de canvas con Fabric.js
- **UI/UX**: Tailwind CSS para estilización responsiva y orientada a utilidades
- **Autenticación**: Autenticación segura vía Magic Link a través de Supabase
- **Almacenamiento de Datos**: Enfoque híbrido con localStorage y Supabase
- **CI/CD**: Despliegue automatizado con Docker y GitHub Actions

### 🔒 Seguridad de Nivel Empresarial

- Sanitización integral de entrada con DOMPurify
- Políticas CORS configuradas adecuadamente
- HTTPS obligatorio en todas las conexiones
- Dependencias minimizadas para reducir vulnerabilidades
- Implementación de Seguridad a Nivel de Fila en Supabase

<h2 id="français">🇫🇷 Français</h2>

Une solution micro-SaaS professionnelle pour créer des organigrammes interactifs, construite avec des technologies web modernes. FlowchartSaaS permet aux équipes de visualiser des processus, des algorithmes et des flux de travail avec une interface intuitive de glisser-déposer.

### ✨ Fonctionnalités Clés

- **Conception Intuitive**: Créez, modifiez et connectez des nœuds d'organigramme par simple glisser-déposer
- **Options d'Exportation**: Téléchargez votre travail au format PNG/SVG pour présentations et documentation
- **Sauvegarde Automatique**: Ne perdez jamais votre travail grâce à la persistance en temps réel dans localStorage
- **Collaboration**: Partagez des organigrammes via des URLs uniques avec les membres de l'équipe
- **Intégration Cloud**: Backend Supabase parfait pour les utilisateurs authentifiés
- **Expérience Responsive**: Entièrement fonctionnel sur les appareils de bureau et mobiles

### 🛠️ Stack Technologique

- **Frontend**: React 18 avec TypeScript et manipulation de canvas avec Fabric.js
- **UI/UX**: Tailwind CSS pour un style responsive et orienté utilitaire
- **Authentification**: Authentification sécurisée via Magic Link grâce à Supabase
- **Stockage de Données**: Approche hybride avec localStorage et Supabase
- **CI/CD**: Déploiement automatisé avec Docker et GitHub Actions

### 🔒 Sécurité de Niveau Entreprise

- Assainissement complet des entrées avec DOMPurify
- Politiques CORS correctement configurées
- HTTPS obligatoire sur toutes les connexions
- Dépendances minimisées pour réduire les vulnérabilités
- Implémentation de la Sécurité au Niveau des Lignes dans Supabase

<h2 id="deutsch">🇩🇪 Deutsch</h2>

Eine professionelle Micro-SaaS-Lösung zur Erstellung interaktiver Flussdiagramme, entwickelt mit modernen Webtechnologien. FlowchartSaaS ermöglicht Teams die Visualisierung von Prozessen, Algorithmen und Workflows mit einer intuitiven Drag-and-Drop-Oberfläche.

### ✨ Hauptfunktionen

- **Intuitives Design**: Erstellen, Bearbeiten und Verbinden von Flussdiagrammknoten durch einfaches Drag & Drop
- **Exportoptionen**: Laden Sie Ihre Arbeit als PNG/SVG für Präsentationen und Dokumentationen herunter
- **Automatisches Speichern**: Verlieren Sie nie Ihre Arbeit durch Echtzeit-Persistenz im localStorage
- **Zusammenarbeit**: Teilen Sie Flussdiagramme über eindeutige URLs mit Teammitgliedern
- **Cloud-Integration**: Nahtloses Supabase-Backend für authentifizierte Benutzer
- **Responsive Erfahrung**: Voll funktionsfähig auf Desktop- und Mobilgeräten

### 🛠️ Technologie-Stack

- **Frontend**: React 18 mit TypeScript und Fabric.js Canvas-Manipulation
- **UI/UX**: Tailwind CSS für responsive, utility-first Gestaltung
- **Authentifizierung**: Sichere Magic-Link-Authentifizierung über Supabase
- **Datenspeicherung**: Hybrider Ansatz mit localStorage und Supabase
- **CI/CD**: Automatisierte Bereitstellung mit Docker und GitHub Actions

### 🔒 Unternehmenssichere Sicherheit

- Umfassende Eingabebereinigung mit DOMPurify
- Korrekt konfigurierte CORS-Richtlinien
- HTTPS-Durchsetzung für alle Verbindungen
- Minimierte Abhängigkeiten zur Reduzierung von Schwachstellen
- Row Level Security-Implementierung in Supabase

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for backend functionality)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/flowchart-saas.git
   cd flowchart-saas
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and add your Supabase credentials.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Using Docker

The easiest way to deploy is using Docker: