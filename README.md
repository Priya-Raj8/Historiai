# HistoriaAI - Interactive History Learning Platform
https://historiai.netlify.app/
## Project Overview
HistoriaAI is an interactive learning platform that brings history to life through engaging AI-powered conversations. The application features an intelligent chatbot named Clieo that acts as a history tutor, providing detailed information, storytelling, and answering questions about historical events, figures, and periods.

**Developed By:** Priya Raj | UID: 12307363

## Features

### 1. Interactive AI Chatbot (Clieo)
- **Storytelling Mode**: Engages users with narrative-style historical content
- **Dual Response Modes**: Choose between detailed explanations or concise summaries
- **Voice Recognition**: Speak your questions instead of typing
- **Context-Aware Responses**: The chatbot remembers conversation history to provide relevant answers
- **Suggested Follow-up Questions**: Dynamically generated based on conversation context

### 2. User Interface
- **Responsive Design**: Works on desktop and mobile devices
- **Topic Categories**: Browse history by different categories (Ancient, Medieval, Modern, etc.)
- **Featured Topics**: Highlighted historical subjects on the homepage
- **Adjustable Chat Size**: Toggle between compact and expanded views
- **Dark Theme**: Easy on the eyes for extended reading sessions

### 3. Content
- **Comprehensive Historical Coverage**: From ancient civilizations to modern history
- **Accurate Information**: AI responses are designed to maintain historical accuracy
- **Engaging Presentation**: Information presented in a narrative, engaging style

## Technologies Used

### Frontend
- **React**: JavaScript library for building the user interface
- **React Router**: For navigation between pages
- **TailwindCSS**: For styling and responsive design
- **Vite**: Build tool and development server

### Backend & APIs
- **Google Gemini 2.0 Flash API**: Powers the AI chatbot responses
- **Web Speech API**: Enables voice recognition for spoken questions

### State Management
- **React Hooks**: useState, useEffect, useRef, and useLocation for state management
- **Custom Caching**: For storing conversation history

## Implementation Details

### AI Integration
The application integrates with Google's Gemini 2.0 Flash API to generate historically accurate and engaging responses. The integration is handled through the `openaiService.js` file, which:

1. Formats user messages and conversation history
2. Creates system prompts that guide the AI's response style
3. Makes API calls to Google's Gemini service
4. Processes and returns the AI's responses

### Voice Recognition
Voice input is implemented using the Web Speech API, which:

1. Captures audio input from the user's microphone
2. Converts speech to text in real-time
3. Automatically submits the transcribed text to the AI
4. Provides visual feedback during recording and processing

### Suggested Questions Generation
The system dynamically generates follow-up questions based on:

1. Keywords extracted from the conversation
2. Historical period detection
3. Topic-specific question templates
4. Entity recognition for personalized suggestions

### Responsive UI Components
The application features several key UI components:

1. **MainLayout**: Provides consistent structure across all pages
2. **ChatBot**: The floating chat interface accessible from any page
3. **TopicDetailPage**: Displays detailed information about specific historical topics
4. **HomePage**: Features categorized historical topics and featured content

## Project Structure

```
ai-history-tutor-webapp/
├── public/             # Static files
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── ChatBot.jsx # AI chatbot implementation
│   │   ├── Header.jsx  # Navigation header
│   │   └── Footer.jsx  # Page footer
│   ├── layouts/        # Page layout templates
│   ├── pages/          # Application pages
│   ├── services/       # API and service integrations
│   │   └── openaiService.js # Gemini AI integration
│   ├── styles/         # Global styles
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Application entry point
├── .env                # Environment variables (API keys)
└── package.json        # Project dependencies
```

## How to Run the Application

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm or yarn package manager
- Google Gemini API key

### Setup Instructions

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd ai-history-tutor-webapp
   ```

2. **Install dependencies**
   ```
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following content:
   ```
   VITE_GOOGLE_API_KEY=your_google_gemini_api_key_here
   ```

4. **Start the development server**
   ```
   npm run dev
   # or
   yarn dev
   ```

5. **Access the application**
   Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Features for Future Development

1. **User Accounts**: Personal profiles to track learning progress
2. **Quiz Mode**: Test knowledge gained from conversations
3. **Timeline Visualization**: Interactive timelines for historical events
4. **Multilingual Support**: Expand beyond English
5. **Offline Mode**: Basic functionality without internet connection

## Acknowledgements

- Google Gemini API for powering the AI responses
- React and Vite communities for excellent documentation
- Historical content references and accuracy verification sources
