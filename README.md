# 💙 Mental Health Buddy AI - Complete Platform

An AI-powered mental health support platform with a Flask backend and React frontend, featuring empathetic conversations, crisis intervention, and comprehensive wellness tools.

## 🌟 Features

### 🤖 AI-Powered Conversations
- **Gemini 2.0 Flash AI** integration for natural, empathetic responses
- **Emotion Detection** and sentiment analysis
- **Context-Aware** conversations with user history
- **Crisis Intervention** with immediate safety protocols
- **Fallback Mode** when AI is unavailable

### 🎨 Modern React Frontend
- **Material-UI** components with beautiful design
- **Framer Motion** animations for smooth UX
- **Responsive Design** for all devices
- **JWT Authentication** with secure login/signup
- **Real-time Chat** interface similar to ChatGPT

### 📊 Comprehensive Dashboard
- **Chat with Mira** - AI conversation interface
- **Wellness Hub** - Therapeutic activities and exercises
- **Mood Tracker** - Daily mood monitoring and trends
- **Resources** - Emergency contacts and mental health resources
- **Insights** - Analytics and progress tracking
- **Community** - Support groups and community features

### 🎤 Voice Features
- **Text-to-Speech** with ElevenLabs integration
- **Multiple Voice Personalities** (Bella, Rachel, Domi, Elli, Josh, Adam)
- **Speech-to-Text** for voice input
- **Play/Stop Controls** for audio management

### 🛡️ Safety & Privacy
- **Crisis Detection** with immediate escalation
- **Emergency Resources** always accessible
- **Data Export** for privacy compliance
- **Secure Authentication** with JWT tokens
- **User Data Management** with GDPR compliance

## 🛠️ Technology Stack

### Backend
- **Python 3.8+**
- **Flask** - Web framework
- **Google Gemini 2.0 Flash** - AI model
- **ElevenLabs** - Voice synthesis
- **SQLite** - Database
- **JWT** - Authentication
- **CORS** - Cross-origin support

### Frontend
- **React 18**
- **Material-UI** - UI components
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - HTTP client
- **JWT Decode** - Token handling

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Akashpatel2609/Mental-Health-Chatbot.git
   cd Mental-Health-Chatbot
   ```

2. **Create virtual environment**
   ```bash
   python -m venv mental_health_env
   # On Windows:
   mental_health_env\Scripts\activate
   # On macOS/Linux:
   source mental_health_env/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure API Keys** (Optional)
   Create a `config.py` file in the root directory:
   ```python
   class Config:
       GOOGLE_API_KEY = "your_gemini_api_key_here"
       ELEVENLABS_API_KEY = "your_elevenlabs_api_key_here"
   ```

5. **Start the Flask server**
   ```bash
   python app.py
   ```
   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to React app directory**
   ```bash
   cd mental-health-react-app
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Start the React development server**
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
Mental-Health-Chatbot/
├── app.py                          # Main Flask application
├── config.py                       # Configuration and API keys
├── requirements.txt                # Python dependencies
├── .gitignore                      # Git ignore rules
├── README.md                       # Project documentation
├── agents/                         # AI agents and logic
│   ├── therapy_agent.py           # Main AI conversation agent
│   ├── listener_agent.py          # Message analysis
│   ├── escalation_agent.py        # Crisis intervention
│   └── therapy_agent_fallback.py  # Fallback responses
├── database/                       # Data management
│   ├── user_memory.py             # User conversation storage
│   └── langchain_memory.py        # LangChain integration
├── mental-health-react-app/        # React frontend
│   ├── package.json               # Node.js dependencies
│   ├── public/                    # Static files
│   └── src/                       # React source code
│       ├── components/            # React components
│       ├── contexts/              # React contexts
│       └── App.js                 # Main React app
├── static/                        # Static assets
├── templates/                     # HTML templates
└── mental_health_env/             # Python virtual environment
```

## 🎯 Key Features Explained

### AI Conversation System
- **Emotion Detection**: Analyzes user messages for emotional content
- **Sentiment Analysis**: Provides nuanced understanding of user feelings
- **Context Awareness**: Remembers conversation history for personalized responses
- **Crisis Detection**: Automatically identifies and responds to crisis situations

### Wellness Activities
- **Breathing Exercises**: Guided breathing for anxiety relief
- **Gratitude Games**: Positive psychology exercises
- **Word Puzzles**: Cognitive engagement activities
- **Memory Games**: Brain training exercises
- **Mood Tracking**: Daily emotional monitoring
- **Progressive Relaxation**: Muscle relaxation techniques

### Voice Integration
- **Natural Speech**: Human-like voice synthesis
- **Multiple Personalities**: Different voice options for user preference
- **Emotional Tone**: Voice adapts to conversation context
- **Accessibility**: Voice input/output for users with disabilities

### Safety Features
- **Crisis Hotlines**: Immediate access to 988, 741741, 911
- **Escalation Protocol**: Automatic crisis response system
- **Emergency Resources**: Comprehensive mental health resource directory
- **Data Privacy**: Secure user data handling and export capabilities

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
GOOGLE_API_KEY=your_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
JWT_SECRET=your_jwt_secret_key
FLASK_SECRET_KEY=your_flask_secret_key
```

### API Keys Setup
1. **Google Gemini API**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **ElevenLabs API**: Get your API key from [ElevenLabs](https://elevenlabs.io/)

## 🚨 Crisis Support

The platform provides immediate access to:
- **988**: Suicide Prevention Lifeline
- **741741**: Crisis Text Line (Text HOME to 741741)
- **911**: Emergency Services

## 📊 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/verify` - Token verification
- `POST /auth/logout` - User logout

### Chat & AI
- `POST /chat` - AI conversation endpoint
- `GET /test-api` - API connection test
- `GET /user-stats/<username>` - User statistics
- `GET /mood-insights/<username>` - Mood analysis

### Voice Features
- `POST /voice/generate` - Text-to-speech
- `POST /voice/recognize` - Speech-to-text
- `POST /voice/microphone-listen` - Microphone input
- `GET /voice/voices` - Available voices
- `POST /voice/change-voice` - Change voice personality

### Wellness & Resources
- `GET /wellness-tips` - Daily wellness tips
- `GET /emergency-resources` - Crisis resources
- `POST /save-activity` - Save wellness activities
- `GET /history/<username>` - Conversation history

### Data Management
- `GET /export-data/<username>` - Export user data
- `DELETE /delete-user/<username>` - Delete user data

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for natural language processing
- **ElevenLabs** for voice synthesis technology
- **Material-UI** for beautiful React components
- **Mental health organizations** for crisis resources
- **Open source community** for various tools and libraries

## ⚠️ Important Disclaimer

This chatbot is designed to provide emotional support and resources but is **NOT a replacement for professional mental health care**. In crisis situations, please contact emergency services or mental health professionals immediately.

## 📞 Support

For support, please:
1. Check the [Issues](https://github.com/Akashpatel2609/Mental-Health-Chatbot/issues) page
2. Create a new issue if your problem isn't already addressed
3. Contact the maintainer for urgent matters

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Akashpatel2609/Mental-Health-Chatbot&type=Date)](https://star-history.com/#Akashpatel2609/Mental-Health-Chatbot&Date)

---

**Made with ❤️ for mental health awareness and support**
