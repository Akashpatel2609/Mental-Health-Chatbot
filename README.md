# 💙 Mental Health Buddy AI

A modern, full-stack AI-powered mental health support platform with a Flask backend and React frontend. Features include empathetic AI chat, crisis intervention, wellness tools, voice features, analytics, and a beautiful, responsive UI.

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Akashpatel2609/Mental-Health-Chatbot.git
cd Mental-Health-Chatbot
```

### 2. Backend Setup (Flask)

- **Create a virtual environment:**
  ```bash
  python -m venv mental_health_env
  # On Windows:
  mental_health_env\Scripts\activate
  # On macOS/Linux:
  source mental_health_env/bin/activate
  ```

- **Install dependencies:**
  ```bash
  pip install -r requirements.txt
  ```

- **Configure API Keys:**
  - Create a `.env` file or edit `config.py`:
    ```
    GOOGLE_API_KEY=your_gemini_api_key
    ELEVENLABS_API_KEY=your_elevenlabs_api_key
    JWT_SECRET=your_jwt_secret_key
    FLASK_SECRET_KEY=your_flask_secret_key
    ```

- **Start the backend:**
  ```bash
  python app.py
  ```
  The backend runs at [http://localhost:5000](http://localhost:5000)

### 3. Frontend Setup (React)

- **Navigate to the React app:**
  ```bash
  cd mental-health-react-app
  ```

- **Install dependencies:**
  ```bash
  npm install
  ```

- **Start the frontend:**
  ```bash
  npm start
  ```
  The frontend runs at [http://localhost:3000](http://localhost:3000)

---

## 🧩 Project Structure

```
Mental-Health-Chatbot/
├── app.py                  # Flask backend
├── requirements.txt        # Backend dependencies
├── config.py               # API keys/config
├── agents/                 # AI agent logic
├── database/               # User data & memory
├── static/                 # Static assets
├── templates/              # HTML templates
├── mental-health-react-app/
│   ├── package.json        # Frontend dependencies
│   └── src/                # React source code
└── README.md               # Project documentation
```

---

## 🌟 Features

- **AI-Powered Chat:** Empathetic, context-aware conversations with Gemini 2.0 Flash
- **Crisis Detection:** Automatic escalation and emergency resources
- **Wellness Hub:** Breathing, meditation, motivational quotes, daily tips
- **Mood Tracker:** Log and visualize mood history
- **Voice Features:** Text-to-speech, speech-to-text, multiple AI voices
- **Analytics & Insights:** Wellness score, mood trends, activity stats
- **User Profile:** Secure authentication, profile management
- **Modern UI:** Material-UI, Framer Motion, fully responsive

---

## 🛠️ Technologies

- **Backend:** Python, Flask, SQLAlchemy, JWT, Google Gemini, ElevenLabs
- **Frontend:** React, Material-UI, Framer Motion, Axios, React Router

---

## 📝 API Endpoints

- `/auth/signup` - Register
- `/auth/signin` - Login
- `/chat` - AI chat
- `/user-stats/<username>` - User stats
- `/voice/generate` - Text-to-speech
- `/wellness-tips` - Daily tips
- `/save-activity` - Log activity
- ...and more

---

## 🆘 Crisis Support

- **988:** Suicide Prevention Lifeline
- **741741:** Crisis Text Line (Text HOME)
- **911:** Emergency Services

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## 📄 License

MIT License. See [LICENSE](LICENSE).

---

**Made with ❤️ for mental health awareness and support**
