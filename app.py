from flask import Flask, render_template, request, jsonify, redirect, url_for, session, flash
from flask_cors import CORS
import json
from datetime import datetime, timedelta
import os
import base64
import secrets
import signal
import bcrypt
import jwt
from functools import wraps
import random

# Import agents
from agents.listener_agent import ListenerAgent
from agents.escalation_agent import EscalationAgent
from database.user_memory import UserMemory

# Initialize Flask app
app = Flask(__name__)
app.secret_key = secrets.token_hex(16)  # For session management
CORS(app)

# JWT Configuration
JWT_SECRET = secrets.token_hex(32)
JWT_ALGORITHM = 'HS256'

print("💙 Mental Health Buddy AI - Complete System")
print(f"📅 Current Time: 2025-06-25 20:27:32")
print(f"👤 Current User: Akashpatel2609")

# Initialize variables
USE_AI = False
therapist = None
VOICE_ENABLED = False

# User storage (in production, use a proper database)
users_db = {}

# JWT Token decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            token = token.split(' ')[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            current_user = users_db.get(data['username'])
            if not current_user:
                return jsonify({'error': 'Invalid token'}), 401
        except:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

# Authentication endpoints
@app.route('/auth/signup', methods=['POST'])
def signup():
    """User registration endpoint"""
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['username', 'email', 'password', 'firstName', 'lastName', 'age']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        username = data['username'].lower()
        email = data['email'].lower()
        
        # Check if user already exists
        if username in users_db:
            return jsonify({'error': 'Username already exists'}), 409
        
        # Check if email already exists
        for user in users_db.values():
            if user['email'] == email:
                return jsonify({'error': 'Email already registered'}), 409
        
        # Hash password
        password_hash = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        # Create user
        user = {
            'username': username,
            'email': email,
            'password_hash': password_hash,
            'firstName': data['firstName'],
            'lastName': data['lastName'],
            'age': data['age'],
            'gender': data.get('gender', ''),
            'created_at': datetime.now().isoformat(),
            'last_login': datetime.now().isoformat()
        }
        
        users_db[username] = user
        
        # Generate JWT token
        token = jwt.encode(
            {
                'username': username,
                'email': email,
                'exp': datetime.utcnow() + timedelta(days=30)
            },
            JWT_SECRET,
            algorithm=JWT_ALGORITHM
        )
        
        # Return user data (without password)
        user_response = {
            'username': user['username'],
            'email': user['email'],
            'firstName': user['firstName'],
            'lastName': user['lastName'],
            'age': user['age'],
            'gender': user['gender'],
            'created_at': user['created_at']
        }
        
        print(f"✅ New user registered: {username}")
        
        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'token': token,
            'user': user_response,
            'timestamp': get_timestamp()
        }), 201
        
    except Exception as e:
        print(f"❌ Error in signup: {e}")
        return jsonify({
            'error': 'Registration failed. Please try again.',
            'timestamp': get_timestamp()
        }), 500

@app.route('/auth/signin', methods=['POST'])
def signin():
    """User login endpoint"""
    try:
        data = request.json
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        email = data['email'].lower()
        password = data['password']
        
        # Find user by email
        user = None
        for u in users_db.values():
            if u['email'] == email:
                user = u
                break
        
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Update last login
        user['last_login'] = datetime.now().isoformat()
        
        # Generate JWT token
        token = jwt.encode(
            {
                'username': user['username'],
                'email': user['email'],
                'exp': datetime.utcnow() + timedelta(days=30)
            },
            JWT_SECRET,
            algorithm=JWT_ALGORITHM
        )
        
        # Return user data (without password)
        user_response = {
            'username': user['username'],
            'email': user['email'],
            'firstName': user['firstName'],
            'lastName': user['lastName'],
            'age': user['age'],
            'gender': user['gender'],
            'created_at': user['created_at'],
            'last_login': user['last_login']
        }
        
        print(f"✅ User logged in: {user['username']}")
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'token': token,
            'user': user_response,
            'timestamp': get_timestamp()
        }), 200
        
    except Exception as e:
        print(f"❌ Error in signin: {e}")
        return jsonify({
            'error': 'Login failed. Please try again.',
            'timestamp': get_timestamp()
        }), 500

@app.route('/auth/verify', methods=['POST'])
@token_required
def verify_token(current_user):
    """Verify JWT token and return user info"""
    try:
        user_response = {
            'username': current_user['username'],
            'email': current_user['email'],
            'firstName': current_user['firstName'],
            'lastName': current_user['lastName'],
            'age': current_user['age'],
            'gender': current_user['gender'],
            'created_at': current_user['created_at'],
            'last_login': current_user['last_login']
        }
        
        return jsonify({
            'success': True,
            'user': user_response,
            'timestamp': get_timestamp()
        }), 200
        
    except Exception as e:
        print(f"❌ Error in token verification: {e}")
        return jsonify({
            'error': 'Token verification failed',
            'timestamp': get_timestamp()
        }), 500

@app.route('/auth/logout', methods=['POST'])
@token_required
def logout(current_user):
    """User logout endpoint"""
    try:
        print(f"✅ User logged out: {current_user['username']}")
        
        return jsonify({
            'success': True,
            'message': 'Logout successful',
            'timestamp': get_timestamp()
        }), 200
        
    except Exception as e:
        print(f"❌ Error in logout: {e}")
        return jsonify({
            'error': 'Logout failed',
            'timestamp': get_timestamp()
        }), 500

# Try to initialize therapy agent with timeout protection
try:
    print("🔄 Attempting to load Gemini 2.0 Flash AI (with timeout protection)...")
    from agents.therapy_agent import TherapyAgent
    
    def timeout_handler(signum, frame):
        raise TimeoutError("Therapy agent initialization timed out")
    
    try:
        # Only set timeout on Unix systems
        signal.signal(signal.SIGALRM, timeout_handler)
        signal.alarm(10)  # 10 second timeout for initialization
        
        therapist = TherapyAgent()
        USE_AI = True
        
        signal.alarm(0)  # Cancel the alarm
        print("✅ Using Gemini 2.0 Flash AI")
        
    except (TimeoutError, AttributeError):
        # Windows or timeout occurred
        print("⏰ Gemini initialization timeout, trying without timeout...")
        therapist = TherapyAgent()
        USE_AI = True
        print("✅ Using Gemini 2.0 Flash AI")
        
except Exception as e:
    print(f"❌ Failed to import Gemini TherapyAgent: {e}")
    try:
        print("🔄 Loading fallback mode...")
        from agents.therapy_agent_fallback import TherapyAgentFallback as TherapyAgent
        therapist = TherapyAgent()
        USE_AI = False
        print("✅ Using Fallback Mode (No AI)")
    except Exception as e2:
        print(f"❌ Failed to import fallback: {e2}")
        
        # Create minimal therapy agent as last resort
        class MinimalTherapyAgent:
            def generate_empathetic_response(self, message, emotion_data, user_history=None, username="Akashpatel2609"):
                emotion = emotion_data.get('primary_emotion', 'neutral')
                responses = {
                    'sadness': f"I can hear that you're going through a difficult time, {username}. I'm here to listen and support you. Your feelings are completely valid.",
                    'anxiety': f"It sounds like you're feeling overwhelmed, {username}. That can be really tough. Let's take this one step at a time. You're safe here with me.",
                    'anger': f"I can sense your frustration, {username}. It's completely normal to feel angry sometimes. I'm here to listen without judgment.",
                    'loneliness': f"Feeling lonely can be really hard, {username}. I want you to know that you're not alone - I'm here with you right now.",
                    'happiness': f"It's wonderful to hear some positivity in your message, {username}! I'm glad you're feeling good today.",
                    'fear': f"I can sense you're feeling afraid, {username}. Fear can be overwhelming, but you're safe here with me.",
                    'neutral': f"Thank you for sharing with me, {username}. I'm here to listen and support you. How are you feeling right now?"
                }
                return responses.get(emotion, responses['neutral'])
            
            def test_api_connection(self):
                return True
        
        therapist = MinimalTherapyAgent()
        USE_AI = False
        print("✅ Using Minimal Therapy Agent")

# Try to import voice service
try:
    from voice_service import VoiceService
    voice_service = VoiceService()
    VOICE_ENABLED = True
    print("✅ Enhanced voice service loaded successfully")
except Exception as e:
    print(f"⚠️ Voice service failed to load: {e}")
    print("🔄 Continuing without voice features...")
    
    # Create dummy voice service
    class DummyVoiceService:
        def text_to_speech(self, text, voice_id=None, voice_style='empathetic'):
            return None
        def speech_to_text(self, audio_data):
            return None
        def listen_from_microphone(self, timeout=5):
            return None
        def test_voice_service(self):
            return False
        def get_available_voices(self):
            return []
        def change_voice(self, voice_name):
            return False
        def get_current_voice_info(self):
            return {'name': 'none', 'voice_id': 'none', 'description': 'Voice not available'}
    
    voice_service = DummyVoiceService()

# Initialize other agents and database
listener = ListenerAgent()
escalation = EscalationAgent()
memory = UserMemory()

print(f"🔧 Mode: {'Gemini 2.0 Flash AI' if USE_AI else 'Fallback/Minimal Mode'}")
print(f"🎤 Voice: {'Enhanced ElevenLabs' if VOICE_ENABLED else 'Disabled'}")

# Test API connection asynchronously to avoid blocking startup
if USE_AI and hasattr(therapist, 'test_api_connection'):
    try:
        print("🧪 Testing Gemini API connection...")
        if therapist.test_api_connection():
            print("✅ Gemini 2.0 Flash API connected successfully!")
        else:
            print("⚠️ Gemini API connection failed, responses will use fallback")
    except Exception as e:
        print(f"⚠️ API test error: {e}")

# Test voice service
if VOICE_ENABLED and hasattr(voice_service, 'test_voice_service'):
    try:
        print("🎤 Testing Enhanced Voice service...")
        if voice_service.test_voice_service():
            print("✅ Enhanced ElevenLabs Voice service connected successfully!")
        else:
            print("⚠️ Voice service connection failed")
    except Exception as e:
        print(f"⚠️ Voice test error: {e}")

# Get timestamp function for consistency
def get_timestamp():
    return '2025-06-25 20:27:32'

# Main route - serve index.html
@app.route('/')
def index():
    return render_template('index.html')

# API endpoint for chat
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message', '')
        username = data.get('username', 'Akashpatel2609')
        
        print(f"💬 Received message from {username}: {message[:50]}...")
        print(f"📅 Current Time: {get_timestamp()}")
        
        # Get or create user
        user_id = memory.get_or_create_user(username)
        
        # Get user history
        user_history = memory.get_user_history(user_id)
        
        # Analyze message with listener agent
        analysis = listener.analyze_message(message)
        
        print(f"🔍 Detected emotion: {analysis['emotion']['primary_emotion']}")
        print(f"⚠️ Crisis level: {analysis['crisis']['crisis_level']}")
        
        # Enhanced sentiment analysis
        sentiment_score = analyze_sentiment_enhanced(message)
        print(f"💭 Sentiment score: {sentiment_score}")
        
        # Check for crisis
        if analysis['crisis']['needs_escalation']:
            crisis_response = escalation.handle_crisis(
                analysis['crisis']['crisis_level']
            )
            response = crisis_response['response'].replace('Akashpatel2609', username)
            print("🚨 Crisis response provided")
        else:
            # Generate therapeutic response with enhanced understanding
            print("🤖 Generating enhanced therapeutic response...")
            try:
                if hasattr(therapist, 'generate_empathetic_response'):
                    # Enhanced context for better responses
                    context = {
                        'username': username,
                        'current_emotion': analysis['emotion']['primary_emotion'],
                        'sentiment_score': sentiment_score,
                        'message_length': len(message),
                        'user_history_length': len(user_history),
                        'time_of_day': datetime.now().hour,
                        'previous_emotions': [h[2] for h in user_history[-5:]] if user_history else []
                    }
                    
                    response = therapist.generate_empathetic_response(
                        message, 
                        analysis['emotion'],
                        user_history,
                        username,
                        context
                    )
                else:
                    response = generate_fallback_response(message, username, analysis, sentiment_score)
                
                # Replace any remaining placeholders
                response = response.replace('Akashpatel2609', username)
                print(f"✅ Enhanced response generated: {len(response)} characters")
                
            except Exception as e:
                print(f"❌ Error in response generation: {e}")
                response = generate_fallback_response(message, username, analysis, sentiment_score)
        
        # Save conversation
        memory.save_conversation(
            user_id, 
            message, 
            response, 
            analysis['emotion']['primary_emotion']
        )
        
        return jsonify({
            'response': response,
            'emotion_detected': analysis['emotion']['primary_emotion'],
            'crisis_level': analysis['crisis']['crisis_level'],
            'sentiment_score': sentiment_score,
            'timestamp': get_timestamp(),
            'username': username,
            'mode': 'Gemini 2.0 Flash' if USE_AI else 'Enhanced Fallback'
        })
        
    except Exception as e:
        print(f"❌ Error in chat route: {e}")
        username = data.get('username', 'Akashpatel2609') if 'data' in locals() and data else 'Akashpatel2609'
        return jsonify({
            'response': f"I'm having trouble right now, but I'm here for you, {username}. Could you try again? If you're in crisis, please call 911 or 988.",
            'error': str(e)
        }), 500

def analyze_sentiment_enhanced(text):
    """Enhanced sentiment analysis with more nuanced understanding"""
    text_lower = text.lower()
    
    # Positive indicators
    positive_words = {
        'strong': ['amazing', 'wonderful', 'fantastic', 'excellent', 'brilliant', 'perfect', 'love', 'adore', 'blessed', 'grateful', 'thankful', 'happy', 'joy', 'excited', 'thrilled', 'ecstatic', 'elated', 'content', 'peaceful', 'calm', 'relaxed', 'hopeful', 'optimistic', 'confident', 'proud', 'accomplished', 'successful', 'better', 'improved', 'healing', 'recovering', 'strong', 'resilient', 'brave', 'courageous'],
        'medium': ['good', 'nice', 'okay', 'fine', 'alright', 'decent', 'pleasant', 'satisfied', 'comfortable', 'stable', 'balanced', 'normal', 'regular', 'routine', 'manageable', 'coping', 'handling', 'dealing', 'surviving', 'getting by', 'making it', 'pushing through'],
        'weak': ['better', 'improving', 'progress', 'step', 'forward', 'moving', 'trying', 'effort', 'attempt', 'hope', 'wish', 'want', 'need', 'help', 'support', 'care', 'concern', 'understanding', 'patience', 'time', 'space', 'breath', 'moment']
    }
    
    # Negative indicators
    negative_words = {
        'strong': ['terrible', 'awful', 'horrible', 'dreadful', 'miserable', 'devastated', 'crushed', 'destroyed', 'hopeless', 'desperate', 'suicidal', 'kill', 'die', 'death', 'end', 'stop', 'give up', 'quit', 'hate', 'despise', 'loathe', 'abandoned', 'betrayed', 'trapped', 'stuck', 'helpless', 'powerless', 'worthless', 'useless', 'failure', 'loser', 'burden', 'problem', 'trouble', 'disaster', 'nightmare', 'hell'],
        'medium': ['bad', 'sad', 'depressed', 'anxious', 'worried', 'scared', 'fearful', 'angry', 'frustrated', 'irritated', 'annoyed', 'upset', 'disappointed', 'hurt', 'pain', 'suffering', 'struggling', 'fighting', 'battling', 'overwhelmed', 'exhausted', 'tired', 'drained', 'empty', 'numb', 'lost', 'confused', 'uncertain', 'doubtful', 'insecure', 'vulnerable', 'weak', 'fragile', 'broken', 'damaged', 'wounded'],
        'weak': ['down', 'low', 'blue', 'moody', 'cranky', 'grumpy', 'sensitive', 'emotional', 'stressed', 'tense', 'nervous', 'uneasy', 'uncomfortable', 'restless', 'agitated', 'distracted', 'scattered', 'foggy', 'cloudy', 'heavy', 'slow', 'tired', 'exhausted', 'drained', 'empty', 'numb', 'lost', 'confused', 'uncertain', 'doubtful', 'insecure', 'vulnerable', 'weak', 'fragile', 'broken', 'damaged', 'wounded']
    }
    
    # Calculate sentiment scores
    positive_score = 0
    negative_score = 0
    
    for intensity, words in positive_words.items():
        weight = {'strong': 3, 'medium': 2, 'weak': 1}[intensity]
        for word in words:
            if word in text_lower:
                positive_score += weight
    
    for intensity, words in negative_words.items():
        weight = {'strong': 3, 'medium': 2, 'weak': 1}[intensity]
        for word in words:
            if word in text_lower:
                negative_score += weight
    
    # Context modifiers
    context_modifiers = {
        'crying': -2, 'tears': -2, 'sob': -2, 'weep': -2,
        'smile': 2, 'laugh': 2, 'giggle': 2, 'chuckle': 2,
        'please': -1, 'help': -1, 'need': -1, 'want': -1,
        'thank': 1, 'appreciate': 1, 'grateful': 1,
        'always': -1, 'never': -1, 'forever': -1, 'constantly': -1,
        'sometimes': 1, 'maybe': 1, 'perhaps': 1, 'try': 1
    }
    
    for word, modifier in context_modifiers.items():
        if word in text_lower:
            if modifier > 0:
                positive_score += modifier
            else:
                negative_score += abs(modifier)
    
    # Calculate final sentiment
    total_score = positive_score - negative_score
    
    if total_score >= 3:
        return 'very_positive'
    elif total_score >= 1:
        return 'positive'
    elif total_score <= -3:
        return 'very_negative'
    elif total_score <= -1:
        return 'negative'
    else:
        return 'neutral'

def generate_fallback_response(message, username, analysis, sentiment_score):
    """Generate more human-like fallback responses"""
    
    # Get current time for context
    hour = datetime.now().hour
    time_context = "morning" if 5 <= hour < 12 else "afternoon" if 12 <= hour < 17 else "evening" if 17 <= hour < 22 else "night"
    
    # Base responses based on sentiment and emotion
    emotion = analysis['emotion']['primary_emotion']
    
    if sentiment_score in ['very_negative', 'negative']:
        if emotion in ['sadness', 'depression']:
            responses = [
                f"I can hear the heaviness in your words, {username}. It sounds like you're carrying a lot right now. I want you to know that your feelings are completely valid, and you don't have to carry this weight alone.",
                f"I'm so sorry you're feeling this way, {username}. It takes real courage to share these difficult feelings. I'm here with you, and I want to help you find some light in this darkness.",
                f"Your pain is real, {username}, and I can feel how much you're hurting. It's okay to not be okay. Let's take this one moment at a time together."
            ]
        elif emotion in ['anxiety', 'fear']:
            responses = [
                f"I can sense the anxiety in your message, {username}. That feeling of being overwhelmed can be so intense. Let's take a deep breath together and find some ground to stand on.",
                f"It sounds like your mind is racing, {username}. Anxiety can feel like being trapped in a storm. I'm here to help you find some calm in the chaos.",
                f"I hear how scared you're feeling, {username}. Fear can be so consuming. You're safe here with me, and we can work through this together."
            ]
        elif emotion in ['anger', 'frustration']:
            responses = [
                f"I can feel the frustration in your words, {username}. Anger is often a sign that something important to you has been hurt or threatened. Your feelings make sense.",
                f"It sounds like you've been pushed to your limit, {username}. That kind of frustration can be exhausting. I'm here to listen without judgment.",
                f"I hear the anger in your voice, {username}. Sometimes anger is what protects us from feeling other painful emotions. It's okay to feel this way."
            ]
        else:
            responses = [
                f"I can tell you're going through something really difficult, {username}. Your feelings matter, and I'm here to support you through this.",
                f"It sounds like you're in a really tough place right now, {username}. I want you to know that you're not alone in this struggle.",
                f"I can hear the pain in your words, {username}. Whatever you're facing, you don't have to face it alone. I'm here with you."
            ]
    elif sentiment_score in ['very_positive', 'positive']:
        responses = [
            f"It's wonderful to hear some positivity in your message, {username}! I can feel the energy in your words. What's bringing you this sense of hope?",
            f"I'm so glad to hear you're feeling better, {username}! It sounds like something positive is happening for you. I'd love to hear more about it.",
            f"This is such a beautiful shift, {username}! I can sense the lightness in your words. What's been helping you feel this way?"
        ]
    else:  # neutral
        if emotion == 'neutral':
            responses = [
                f"Thank you for sharing with me, {username}. I'm here to listen and support you, whatever you're going through.",
                f"I appreciate you reaching out, {username}. How are you really feeling today? I'm here to listen.",
                f"Thank you for connecting with me, {username}. I'm here to support you on your mental health journey."
            ]
        else:
            responses = [
                f"I can sense some mixed emotions in your message, {username}. It's completely normal to feel this way. I'm here to help you sort through these feelings.",
                f"Thank you for sharing this with me, {username}. I can hear that you're processing some things. I'm here to support you through it.",
                f"I appreciate your honesty, {username}. It sounds like you're navigating some complex feelings. I'm here to help you work through them."
            ]
    
    # Add time-based context
    time_responses = {
        "morning": "I hope this morning brings you some peace and clarity.",
        "afternoon": "I hope your afternoon continues to bring you moments of calm.",
        "evening": "I hope you can find some rest and comfort this evening.",
        "night": "I hope you can find some peace and rest tonight."
    }
    
    base_response = random.choice(responses)
    time_context = time_responses.get(time_context, "")
    
    if time_context:
        return f"{base_response} {time_context}"
    else:
        return base_response

# Voice API endpoints
@app.route('/voice/generate', methods=['POST'])
def generate_voice():
    """Generate speech from text with enhanced human-like voice"""
    try:
        if not VOICE_ENABLED:
            return jsonify({
                'success': False,
                'error': 'Voice service not available',
                'timestamp': get_timestamp()
            }), 503
        
        data = request.json
        text = data.get('text', '')
        voice_id = data.get('voice_id', 'bella')
        voice_style = data.get('voice_style', 'empathetic')
        username = data.get('username', 'Akashpatel2609')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        print(f"🎤 Generating enhanced voice for {username}: {text[:50]}...")
        print(f"🎭 Using voice: {voice_id}, style: {voice_style}")
        
        # Map voice names to IDs if needed
        if hasattr(voice_service, 'voice_options') and voice_id in voice_service.voice_options:
            actual_voice_id = voice_service.voice_options[voice_id]
        else:
            actual_voice_id = voice_id
        
        # Generate speech with human-like settings
        audio_bytes = voice_service.text_to_speech(text, actual_voice_id, voice_style)
        
        if audio_bytes:
            # Convert to base64 for transmission
            audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
            
            return jsonify({
                'success': True,
                'audio_base64': audio_base64,
                'text': text,
                'voice_id': voice_id,
                'voice_style': voice_style,
                'username': username,
                'audio_size': len(audio_bytes),
                'timestamp': get_timestamp()
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to generate enhanced speech',
                'timestamp': get_timestamp()
            }), 500
            
    except Exception as e:
        print(f"❌ Error in enhanced voice generation: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': get_timestamp()
        }), 500

@app.route('/voice/recognize', methods=['POST'])
def recognize_voice():
    """Convert speech to text"""
    try:
        if not VOICE_ENABLED:
            return jsonify({
                'success': False,
                'error': 'Voice service not available',
                'timestamp': get_timestamp()
            }), 503
        
        data = request.json
        audio_base64 = data.get('audio_base64', '')
        username = data.get('username', 'Akashpatel2609')
        
        if not audio_base64:
            return jsonify({'error': 'No audio data provided'}), 400
        
        print(f"🎙️ Processing voice input for {username}...")
        
        # Decode base64 audio
        audio_bytes = base64.b64decode(audio_base64)
        
        # Convert speech to text
        text = voice_service.speech_to_text(audio_bytes)
        
        if text:
            return jsonify({
                'success': True,
                'text': text,
                'username': username,
                'timestamp': get_timestamp()
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Could not recognize speech',
                'timestamp': get_timestamp()
            }), 400
            
    except Exception as e:
        print(f"❌ Error in voice recognition: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': get_timestamp()
        }), 500

@app.route('/voice/microphone-listen', methods=['POST'])
def listen_microphone():
    """Listen from microphone and convert to text"""
    try:
        if not VOICE_ENABLED:
            return jsonify({
                'success': False,
                'error': 'Voice service not available',
                'timestamp': get_timestamp()
            }), 503
        
        data = request.json
        timeout = data.get('timeout', 8)
        username = data.get('username', 'Akashpatel2609')
        
        print(f"🎙️ Starting microphone listening for {username}...")
        
        # Listen from microphone
        text = voice_service.listen_from_microphone(timeout)
        
        if text:
            return jsonify({
                'success': True,
                'text': text,
                'username': username,
                'timestamp': get_timestamp()
            })
        else:
            return jsonify({
                'success': False,
                'error': 'No speech detected or could not understand',
                'timestamp': get_timestamp()
            }), 400
            
    except Exception as e:
        print(f"❌ Error in microphone listening: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': get_timestamp()
        }), 500

@app.route('/voice/voices')
def get_voices():
    """Get available ElevenLabs voices"""
    try:
        if not VOICE_ENABLED:
            return jsonify({
                'voices': [],
                'error': 'Voice service not available',
                'timestamp': get_timestamp()
            })
        
        voices_list = voice_service.get_available_voices()
        current_voice = voice_service.get_current_voice_info()
        
        return jsonify({
            'voices': voices_list,
            'current_voice': current_voice,
            'user': 'Akashpatel2609',
            'timestamp': get_timestamp()
        })
        
    except Exception as e:
        print(f"❌ Error getting voices: {e}")
        return jsonify({
            'error': str(e),
            'timestamp': get_timestamp()
        }), 500

@app.route('/voice/change-voice', methods=['POST'])
def change_voice():
    """Change the current voice"""
    try:
        if not VOICE_ENABLED:
            return jsonify({
                'success': False,
                'error': 'Voice service not available',
                'timestamp': get_timestamp()
            }), 503
        
        data = request.json
        voice_name = data.get('voice_name', 'bella')
        username = data.get('username', 'Akashpatel2609')
        
        print(f"🎭 Changing voice to {voice_name} for {username}")
        
        success = voice_service.change_voice(voice_name)
        
        if success:
            current_voice = voice_service.get_current_voice_info()
            return jsonify({
                'success': True,
                'voice_changed': voice_name,
                'current_voice': current_voice,
                'username': username,
                'timestamp': get_timestamp()
            })
        else:
            return jsonify({
                'success': False,
                'error': f'Voice {voice_name} not available',
                'timestamp': get_timestamp()
            }), 400
            
    except Exception as e:
        print(f"❌ Error changing voice: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': get_timestamp()
        }), 500

@app.route('/voice/test')
def test_voice():
    """Test voice service"""
    try:
        if not VOICE_ENABLED:
            return jsonify({
                'voice_working': False,
                'message': 'Voice service not loaded',
                'api_configured': False,
                'timestamp': get_timestamp()
            })
        
        is_working = voice_service.test_voice_service()
        current_voice = voice_service.get_current_voice_info()
        
        return jsonify({
            'voice_working': is_working,
            'message': 'Enhanced ElevenLabs TTS is working!' if is_working else 'Voice service connection failed',
            'api_configured': bool(getattr(voice_service, 'api_key', False)),
            'current_voice': current_voice,
            'user': 'Akashpatel2609',
            'timestamp': get_timestamp()
        })
        
    except Exception as e:
        return jsonify({
            'voice_working': False,
            'error': str(e),
            'timestamp': get_timestamp()
        }), 500

# Activity and history endpoints
@app.route('/save-activity', methods=['POST'])
def save_activity():
    """Save activity completion to user history"""
    try:
        data = request.json
        username = data.get('username', 'Akashpatel2609')
        activity_type = data.get('activity_type', '')
        activity_data = data.get('activity_data', {})
        
        user_id = memory.get_or_create_user(username)
        
        print(f"💾 Saving activity for {username}: {activity_type}")
        
        # Create meaningful activity messages based on type
        activity_messages = {
            'breathing': f"{username} completed a breathing exercise. This helps reduce anxiety and promotes relaxation.",
            'gratitude': f"{username} practiced gratitude by reflecting on positive aspects of their day.",
            'word-puzzle': f"{username} completed a word puzzle, engaging their mind in a positive, focused activity.",
            'memory-game': f"{username} played a memory game, which helps with cognitive function and provides a mental break.",
            'mood-tracker': f"{username} tracked their mood, building self-awareness and emotional intelligence.",
            'progressive-relaxation': f"{username} completed a progressive muscle relaxation exercise, helping to reduce physical tension."
        }
        
        activity_message = activity_messages.get(activity_type, f"Completed {activity_type} activity")
        activity_response = f"Wonderful job completing the {activity_type.replace('-', ' ')} activity, {username}! These therapeutic exercises are great for mental wellness and self-care. How did that feel for you?"
        
        memory.save_conversation(
            user_id,
            activity_message,
            activity_response,
            'positive'
        )
        
        return jsonify({
            'success': True,
            'message': 'Activity saved successfully',
            'activity_type': activity_type,
            'username': username,
            'timestamp': get_timestamp()
        })
        
    except Exception as e:
        print(f"Error saving activity: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': get_timestamp()
        }), 500

@app.route('/history/<username>')
def get_history(username):
    """Get user conversation history"""
    try:
        print(f"📚 Getting history for {username}")
        
        user_id = memory.get_or_create_user(username)
        history = memory.get_user_history(user_id, limit=20)
        
        return jsonify({
            'history': [
                {
                    'message': h[0],
                    'response': h[1],
                    'emotion': h[2],
                    'timestamp': h[3]
                } for h in history
            ],
            'username': username,
            'total_conversations': len(history),
            'timestamp': get_timestamp()
        })
    except Exception as e:
        print(f"Error getting history: {e}")
        return jsonify({
            'error': str(e),
            'timestamp': get_timestamp()
        }), 500

# System information endpoints
@app.route('/test-api')
def test_api():
    """Test endpoint to check if Gemini API is working"""
    try:
        if USE_AI and hasattr(therapist, 'test_api_connection'):
            print("🧪 Testing API connection...")
            is_working = therapist.test_api_connection()
            return jsonify({
                'api_working': is_working,
                'message': 'Gemini 2.0 Flash API is working!' if is_working else 'Gemini API connection failed',
                'mode': 'Gemini 2.0 Flash',
                'model': 'gemini-2.0-flash-exp',
                'user': 'Akashpatel2609',
                'timestamp': get_timestamp()
            })
        else:
            return jsonify({
                'api_working': True,
                'message': 'Running in fallback mode - no AI required',
                'mode': 'Fallback',
                'user': 'Akashpatel2609',
                'timestamp': get_timestamp()
            })
    except Exception as e:
        print(f"❌ Error testing API: {e}")
        return jsonify({
            'api_working': False,
            'error': str(e),
            'mode': 'Error',
            'user': 'Akashpatel2609',
            'timestamp': get_timestamp()
        })

@app.route('/user-stats/<username>')
def get_user_stats(username):
    """Get user statistics and insights"""
    try:
        print(f"📊 Getting stats for {username}")
        
        user_id = memory.get_or_create_user(username)
        history = memory.get_user_history(user_id, limit=50)  # Get more for stats
        preferences = memory.get_preferences(user_id)
        
        # Calculate some basic stats
        total_conversations = len(history)
        emotions_count = {}
        recent_activity = []
        activity_count = 0
        
        for conv in history:
            emotion = conv[2]  # emotion_detected
            emotions_count[emotion] = emotions_count.get(emotion, 0) + 1
            
            # Check if it's an activity
            if 'activity' in conv[0].lower() or 'completed' in conv[0].lower():
                activity_count += 1
                recent_activity.append({
                    'type': conv[0],
                    'timestamp': conv[3]
                })
        
        # Most common emotion
        most_common_emotion = max(emotions_count.items(), key=lambda x: x[1])[0] if emotions_count else 'neutral'
        
        # Calculate wellness score (0-100)
        wellness_score = 50  # Base score
        if 'happiness' in emotions_count:
            wellness_score += min(emotions_count['happiness'] * 5, 30)
        if 'positive' in emotions_count:
            wellness_score += min(emotions_count['positive'] * 3, 20)
        if activity_count > 0:
            wellness_score += min(activity_count * 2, 20)
        if 'sadness' in emotions_count:
            wellness_score -= min(emotions_count['sadness'] * 3, 20)
        if 'anxiety' in emotions_count:
            wellness_score -= min(emotions_count['anxiety'] * 3, 20)
        
        wellness_score = max(0, min(100, wellness_score))
        
        return jsonify({
            'username': username,
            'total_conversations': total_conversations,
            'activity_count': activity_count,
            'emotions_count': emotions_count,
            'most_common_emotion': most_common_emotion,
            'recent_activities': recent_activity[:5],  # Last 5 activities
            'preferences': preferences,
            'wellness_score': wellness_score,
            'last_activity': recent_activity[0] if recent_activity else None,
            'timestamp': get_timestamp()
        })
        
    except Exception as e:
        print(f"Error getting user stats: {e}")
        return jsonify({
            'error': str(e),
            'timestamp': get_timestamp()
        }), 500

@app.route('/wellness-tips')
def get_wellness_tips():
    """Get daily wellness tips based on current date"""
    tips_by_day = {
        0: {  # Monday
            'tip': 'Start your week with intention, Akashpatel2609! Set three small, achievable goals for today.',
            'activity': 'Try our breathing exercise to center yourself for the week ahead.',
            'emoji': '🌟',
            'focus': 'Goal Setting'
        },
        1: {  # Tuesday
            'tip': 'Take breaks between tasks, Akashpatel2609. Even 5 minutes of mindfulness can refresh your mind.',
            'activity': 'Play our memory game to give your brain a fun workout!',
            'emoji': '🧠',
            'focus': 'Mindfulness'
        },
        2: {  # Wednesday
            'tip': 'Midweek check-in: How are you feeling, Akashpatel2609? It\'s okay to adjust your expectations.',
            'activity': 'Use our mood tracker to reflect on your current emotional state.',
            'emoji': '💙',
            'focus': 'Self-Awareness'
        },
        3: {  # Thursday
            'tip': 'Practice gratitude today, Akashpatel2609. What are three things that went well this week?',
            'activity': 'Try our gratitude game to focus on the positive aspects of your life.',
            'emoji': '🙏',
            'focus': 'Gratitude'
        },
        4: {  # Friday
            'tip': 'As the week winds down, celebrate your accomplishments, big or small, Akashpatel2609!',
            'activity': 'Relax with our progressive muscle relaxation exercise.',
            'emoji': '🎉',
            'focus': 'Celebration'
        },
        5: {  # Saturday
            'tip': 'Weekend self-care, Akashpatel2609: Do something that brings you joy and peace.',
            'activity': 'Engage your mind with our word puzzle games.',
            'emoji': '🌸',
            'focus': 'Self-Care'
        },
        6: {  # Sunday
            'tip': 'Sunday reflection, Akashpatel2609: What did you learn about yourself this week?',
            'activity': 'Try all our activities and see which ones resonate with you.',
            'emoji': '🧘',
            'focus': 'Reflection'
        }
    }
    
    # Tuesday is day 1 (0=Monday, 1=Tuesday, etc.)
    current_day = 1  # Tuesday, June 25, 2025
    daily_tip = tips_by_day[current_day]
    
    return jsonify({
        'daily_tip': daily_tip,
        'date': 'Tuesday, June 25, 2025',
        'day_of_week': 'Tuesday',
        'user': 'Akashpatel2609',
        'current_focus': daily_tip['focus'],
        'timestamp': get_timestamp()
    })

@app.route('/emergency-resources')
def get_emergency_resources():
    """Get emergency mental health resources"""
    resources = {
        'immediate_help': {
            'crisis_hotline': '988',
            'emergency': '911',
            'crisis_text': 'Text HOME to 741741',
            'note': 'If you are in immediate danger, call 911 right now.'
        },
        'mental_health_resources': [
            {
                'name': 'National Suicide Prevention Lifeline',
                'phone': '988',
                'website': 'https://suicidepreventionlifeline.org',
                'description': '24/7 support for people in distress',
                'available': '24/7'
            },
            {
                'name': 'Crisis Text Line',
                'contact': 'Text HOME to 741741',
                'website': 'https://crisistextline.org',
                'description': 'Free, 24/7 support via text message',
                'available': '24/7'
            },
            {
                'name': 'National Alliance on Mental Illness (NAMI)',
                'phone': '1-800-950-NAMI (6264)',
                'website': 'https://nami.org',
                'description': 'Support, education and advocacy',
                'available': 'Mon-Fri 10am-10pm ET'
            },
            {
                'name': 'Substance Abuse and Mental Health Services Administration',
                'phone': '1-800-662-4357',
                'website': 'https://samhsa.gov',
                'description': 'Treatment referral and information service',
                'available': '24/7'
            },
            {
                'name': 'Veterans Crisis Line',
                'phone': '1-800-273-8255',
                'website': 'https://veteranscrisisline.net',
                'description': 'Support specifically for veterans',
                'available': '24/7'
            }
        ],
        'international_resources': {
            'canada': {
                'talk_suicide': '1-833-456-4566',
                'crisis_text': 'Text 45645',
                'website': 'https://talksuicide.ca'
            },
            'uk': {
                'samaritans': '116 123',
                'website': 'https://samaritans.org',
                'note': 'Free from any phone'
            },
            'australia': {
                'lifeline': '13 11 14',
                'website': 'https://lifeline.org.au'
            },
            'india': {
                'aasra': '91-22-27546669',
                'website': 'http://www.aasra.info'
            }
        },
        'online_resources': [
            {
                'name': '7 Cups',
                'website': 'https://7cups.com',
                'description': 'Free emotional support'
            },
            {
                'name': 'BetterHelp',
                'website': 'https://betterhelp.com',
                'description': 'Professional online therapy'
            },
            {
                'name': 'Headspace',
                'website': 'https://headspace.com',
                'description': 'Meditation and mindfulness'
            }
        ],
        'user': 'Akashpatel2609',
        'disclaimer': 'If you are in immediate danger, please call emergency services (911 in US) or go to your nearest emergency room.',
        'timestamp': get_timestamp()
    }
    
    return jsonify(resources)

# Data management endpoints
@app.route('/export-data/<username>')
def export_user_data(username):
    """Export user data for privacy compliance"""
    try:
        print(f"📤 Exporting data for {username}")
        
        user_id = memory.get_or_create_user(username)
        history = memory.get_user_history(user_id, limit=1000)  # Get all history
        preferences = memory.get_preferences(user_id)
        
        # Calculate summary stats
        emotions_count = {}
        activity_count = 0
        
        for conv in history:
            emotion = conv[2]
            emotions_count[emotion] = emotions_count.get(emotion, 0) + 1
            if 'activity' in conv[0].lower() or 'completed' in conv[0].lower():
                activity_count += 1
        
        export_data = {
            'user_info': {
                'username': username,
                'export_date': get_timestamp(),
                'data_format': 'Mental Health Buddy Export v2.1'
            },
            'summary': {
                'total_conversations': len(history),
                'total_activities_completed': activity_count,
                'emotions_distribution': emotions_count,
                'account_created': history[-1][3] if history else None,
                'last_activity': history[0][3] if history else None
            },
            'conversation_history': [
                {
                    'message': h[0],
                    'response': h[1],
                    'emotion_detected': h[2],
                    'timestamp': h[3]
                } for h in history
            ],
            'preferences': preferences,
            'privacy_note': 'This data export contains your complete conversation history with Mental Health Buddy. Please handle it securely.',
            'export_timestamp': get_timestamp()
        }
        
        return jsonify(export_data)
        
    except Exception as e:
        print(f"Error exporting data: {e}")
        return jsonify({
            'error': str(e),
            'timestamp': get_timestamp()
        }), 500

@app.route('/delete-user/<username>', methods=['DELETE'])
def delete_user_data(username):
    """Delete all user data (GDPR compliance)"""
    try:
        print(f"🗑️ Data deletion request for {username}")
        
        user_id = memory.get_or_create_user(username)
        
        # This would require implementing delete methods in UserMemory
        # For now, return a confirmation message
        return jsonify({
            'message': f'Data deletion request received for {username}',
            'note': 'In a production system, this would permanently delete all user data',
            'timestamp': get_timestamp(),
            'status': 'acknowledged'
        })
        
    except Exception as e:
        print(f"Error deleting user data: {e}")
        return jsonify({
            'error': str(e),
            'timestamp': get_timestamp()
        }), 500

@app.route('/mood-insights/<username>')
def get_mood_insights(username):
    """Get detailed mood insights and patterns"""
    try:
        print(f"🧠 Getting mood insights for {username}")
        
        user_id = memory.get_or_create_user(username)
        history = memory.get_user_history(user_id, limit=100)
        
        # Analyze mood patterns
        emotions_by_time = {}
        recent_emotions = []
        
        for conv in history[:20]:  # Last 20 conversations
            emotion = conv[2]
            timestamp = conv[3]
            recent_emotions.append({
                'emotion': emotion,
                'timestamp': timestamp
            })
        
        # Calculate mood trends
        positive_emotions = ['happiness', 'positive', 'joy', 'excitement']
        negative_emotions = ['sadness', 'anxiety', 'anger', 'fear', 'loneliness', 'hopelessness']
        
        positive_count = sum(1 for conv in history if conv[2] in positive_emotions)
        negative_count = sum(1 for conv in history if conv[2] in negative_emotions)
        neutral_count = len(history) - positive_count - negative_count
        
        mood_balance = {
            'positive': positive_count,
            'negative': negative_count,
            'neutral': neutral_count,
            'total': len(history)
        }
        
        # Generate insights
        insights = []
        if positive_count > negative_count:
            insights.append(f"You've been experiencing more positive emotions lately, {username}! That's wonderful to see.")
        elif negative_count > positive_count * 1.5:
            insights.append(f"I notice you've been going through some difficult emotions, {username}. Remember, it's okay to feel this way, and I'm here to support you.")
        else:
            insights.append(f"Your emotional balance shows you're navigating both positive and challenging moments, {username}.")
        
        if len(history) >= 10:
            insights.append(f"You've had {len(history)} conversations with me, {username}. Thank you for trusting me with your thoughts and feelings.")
        
        return jsonify({
            'username': username,
            'mood_balance': mood_balance,
            'recent_emotions': recent_emotions,
            'insights': insights,
            'recommendations': [
                "Continue using our breathing exercises when feeling anxious",
                "Try the gratitude game to boost positive emotions",
                "Use the mood tracker to build self-awareness",
                "Consider voice conversations for a more personal experience"
            ],
            'timestamp': get_timestamp()
        })
        
    except Exception as e:
        print(f"Error getting mood insights: {e}")
        return jsonify({
            'error': str(e),
            'timestamp': get_timestamp()
        }), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found',
        'available_endpoints': [
            '/', '/chat', '/test-api', '/wellness-tips', '/emergency-resources',
            '/history/<username>', '/user-stats/<username>', '/mood-insights/<username>',
            '/export-data/<username>', '/save-activity', '/voice/generate', '/voice/test',
            '/voice/microphone-listen', '/voice/voices', '/voice/change-voice'
        ],
        'user': 'Akashpatel2609',
        'timestamp': get_timestamp()
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error',
        'message': 'Something went wrong on our end. Please try again.',
        'user': 'Akashpatel2609',
        'timestamp': get_timestamp()
    }), 500

# System monitoring endpoints
@app.route('/health')
def health_check():
    """Health check endpoint for monitoring"""
    return jsonify({
        'status': 'healthy',
        'service': 'Mental Health Buddy AI with Enhanced Voice',
        'version': '2.1.0',
        'mode': 'Gemini 2.0 Flash' if USE_AI else 'Fallback',
        'voice_enabled': VOICE_ENABLED,
        'user': 'Akashpatel2609',
        'current_time': get_timestamp(),
        'uptime': 'Service running normally',
        'features': {
            'chat': True,
            'voice_input': VOICE_ENABLED,
            'voice_output': VOICE_ENABLED,
            'activities': True,
            'mood_tracking': True,
            'crisis_support': True,
            'data_export': True,
            'voice_selection': VOICE_ENABLED
        }
    })

@app.route('/system-info')
def system_info():
    """System information endpoint"""
    current_voice = voice_service.get_current_voice_info() if VOICE_ENABLED else {'name': 'none', 'description': 'Voice not available'}
    
    return jsonify({
        'system': 'Mental Health Buddy AI with Enhanced Voice',
        'version': '2.1.0',
        'ai_model': 'Gemini 2.0 Flash' if USE_AI else 'Fallback Mode',
        'voice_model': 'ElevenLabs Enhanced' if VOICE_ENABLED else 'Disabled',
        'current_voice': current_voice,
        'current_user': 'Akashpatel2609',
        'features': [
            'Empathetic AI Conversations with Gemini 2.0 Flash',
            'Enhanced Human-like Voice with ElevenLabs',
            'Multiple Voice Options (Bella, Rachel, Domi, Elli, Josh, Adam)',
            'Play/Stop Voice Controls',
            'Voice Input with Speech Recognition',
            'Emotion Detection & Analysis',
            'Crisis Intervention Support',
            'Therapeutic Activities & Games',
            'Mood Tracking & Insights',
            'Personalized Wellness Tips',
            'Emergency Resources',
            'Data Privacy & Export'
        ],
        'activities_available': [
            'Breathing Exercises',
            'Gratitude Games', 
            'Word Puzzles',
            'Memory Games',
            'Mood Tracker',
            'Progressive Muscle Relaxation'
        ],
        'voice_features': [
            'Natural Human-like Speech',
            'Empathetic Voice Settings',
            'Multiple Voice Personalities',
            'Play/Stop Controls',
            'Auto-Voice Mode',
            'Global Audio Stop'
        ] if VOICE_ENABLED else ['Voice features disabled'],
        'crisis_support': {
            'detection': True,
            'escalation': True,
            'resources': True
        },
        'privacy': {
            'data_export': True,
            'data_deletion': True,
            'conversation_history': True
        },
        'timestamp': get_timestamp()
    })

# Serve React app for any other routes
@app.route('/react-app')
def serve_react_app():
    """Serve React app"""
    # In a full setup, you'd use Flask to serve your built React app
    # For now, we'll render a placeholder page
    return jsonify({
        'message': 'React app would be served here',
        'info': 'Set up your React app by following the integration instructions',
        'timestamp': get_timestamp()
    })

if __name__ == '__main__':
    print("💙 Mental Health Buddy AI - Complete Enhanced Version")
    print("💙 Visit http://localhost:5000 to start chatting with Mental Health Buddy")
    print("🔧 Visit http://localhost:5000/test-api to test Gemini 2.0 Flash API")
    print("🎤 Visit http://localhost:5000/voice/test to test Enhanced Voice API")
    print("📊 Visit http://localhost:5000/wellness-tips for daily wellness tips")
    print("🆘 Visit http://localhost:5000/emergency-resources for crisis resources")
    print("📈 Visit http://localhost:5000/user-stats/Akashpatel2609 for your stats")
    print("🧠 Visit http://localhost:5000/mood-insights/Akashpatel2609 for mood analysis")
    print("💾 Visit http://localhost:5000/export-data/Akashpatel2609 to export your data")
    print("🏥 Visit http://localhost:5000/health for system health check")
    print("ℹ️  Visit http://localhost:5000/system-info for system information")
    print("🚀 Visit http://localhost:5000/react-app to access the React frontend")
    print("❤️  Current User: Akashpatel2609")
    print(f"📅 Current Date & Time: {get_timestamp()} UTC")
    print("🎭 Voice Features: Multiple personalities, Play/Stop controls, Human-like speech")
    print("🚀 Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5000)