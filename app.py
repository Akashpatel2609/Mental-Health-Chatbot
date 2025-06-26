from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import os
import secrets
import bcrypt
import jwt
from functools import wraps
import random
from dotenv import load_dotenv
load_dotenv() 
# Import database models
from database.models import db, User, Conversation, Activity, MoodEntry, UserPreferences, Contact
# Import AI therapy agent
from agents.therapy_agent import TherapyAgent
# Import additional AI agents for enhanced capabilities
from agents.listener_agent import ListenerAgent
from agents.escalation_agent import EscalationAgent

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', secrets.token_hex(32))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mental_health_buddy.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
CORS(app)

# Initialize AI Therapy Agent
therapy_agent = TherapyAgent()

# Initialize additional AI agents for enhanced capabilities
listener_agent = ListenerAgent()
escalation_agent = EscalationAgent()

# JWT Configuration
JWT_SECRET = os.getenv('JWT_SECRET', secrets.token_hex(32))
JWT_ALGORITHM = 'HS256'

# AI Configuration
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')

print("💙 Mental Health Buddy AI - Enhanced Multi-Agent System")
print(f"📅 Current Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print(f"🔧 Database: SQLite with SQLAlchemy")
print(f"🤖 AI System: Multi-Agent Coordination")
print(f"   - Therapy Agent: {'Active' if therapy_agent.is_connected else 'Fallback'}")
print(f"   - Listener Agent: Active")
print(f"   - Escalation Agent: Active")
print(f"   - Primary Model: {'Gemini 2.0 Flash' if GOOGLE_API_KEY else 'Enhanced Fallback'}")

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
            current_user = User.query.filter_by(username=data['username']).first()
            if not current_user:
                return jsonify({'error': 'Invalid token'}), 401
        except:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

# AI-powered response generation using multiple agents
def generate_ai_response(message, username, emotion='neutral', sentiment='neutral', history=None, memory=None):
    """Generate AI-powered response using multiple AI agents working together"""
    try:
        # Step 1: Use ListenerAgent for sophisticated emotion and crisis analysis
        listener_analysis = listener_agent.analyze_message(message)
        
        # Extract analysis results
        detected_emotion = listener_analysis['emotion']['primary_emotion']
        emotion_confidence = listener_analysis['emotion']['confidence']
        crisis_level = listener_analysis['crisis']['crisis_level']
        needs_escalation = listener_analysis['crisis']['needs_escalation']
        
        print(f"🎧 ListenerAgent Analysis:")
        print(f"   - Detected Emotion: {detected_emotion} (confidence: {emotion_confidence:.2f})")
        print(f"   - Crisis Level: {crisis_level}")
        print(f"   - Needs Escalation: {needs_escalation}")
        
        # Step 2: Handle crisis situations with EscalationAgent
        if needs_escalation:
            print(f"🚨 Crisis detected! Using EscalationAgent...")
            escalation_response = escalation_agent.handle_crisis(crisis_level, 'CA')  # Canada
            return escalation_response['response']
        
        # Step 3: Use TherapyAgent for normal therapeutic responses
        # Prepare enhanced emotion data for the therapy agent
        emotion_data = {
            'primary_emotion': detected_emotion,
            'sentiment': sentiment,
            'confidence': emotion_confidence,
            'all_emotions': listener_analysis['emotion']['all_emotions']
        }
        
        # Prepare user history for context
        user_history = []
        if history and len(history) > 0:
            for h in history[-5:]:  # Last 5 interactions
                user_history.append((h['text'], '', detected_emotion, datetime.now().isoformat()))
        
        # Prepare enhanced context with listener analysis
        context = {
            'sentiment_score': sentiment,
            'time_of_day': datetime.now().hour,
            'message_length': listener_analysis['message_length'],
            'word_count': listener_analysis['word_count'],
            'user_history_length': len(history) if history else 0,
            'previous_emotions': [detected_emotion] if detected_emotion != 'neutral' else [],
            'emotion_confidence': emotion_confidence,
            'crisis_level': crisis_level
        }
        
        # Add memory context if available
        if memory:
            context['user_preferences'] = memory.get('preferences', {})
            context['last_mood'] = memory.get('last_mood', {})
        
        # Generate response using AI therapy agent
        print(f"🤖 Generating therapeutic response with TherapyAgent...")
        ai_response = therapy_agent.generate_empathetic_response(
            message=message,
            emotion_data=emotion_data,
            user_history=user_history,
            username=username,
            context=context
        )
        
        # Add greeting for first message if needed
        if (not history or len(history) == 0) and memory:
            if memory.get('last_mood') and memory['last_mood'].get('mood_label'):
                greeting = f"Welcome back, {username}! Last time you mentioned feeling {memory['last_mood']['mood_label']}. How are you today?"
                return f"{greeting}\n\n{ai_response}"
            elif memory.get('first_name'):
                greeting = f"Welcome back, {username}! How can I support you today?"
                return f"{greeting}\n\n{ai_response}"
        
        return ai_response
        
    except Exception as e:
        print(f"❌ AI response generation failed: {e}")
        # Fallback to simple empathetic response
        return f"I hear you, {username}. I'm having trouble processing that right now, but I'm here to listen. Can you tell me more about what's on your mind?"

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
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 409
        
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 409
        
        # Create new user
        user = User(
            username=username,
            email=email,
            first_name=data['firstName'],
            last_name=data['lastName'],
            age=data['age'],
            gender=data.get('gender', '')
        )
        user.set_password(data['password'])
        
        # Save to database
        db.session.add(user)
        db.session.commit()
        
        # Create default preferences
        preferences = UserPreferences(user_id=user.id)
        db.session.add(preferences)
        db.session.commit()
        
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
        
        print(f"✅ New user registered: {username}")
        
        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'token': token,
            'user': user.to_dict(),
            'timestamp': datetime.now().isoformat()
        }), 201
        
    except Exception as e:
        print(f"❌ Error in signup: {e}")
        db.session.rollback()
        return jsonify({
            'error': 'Registration failed. Please try again.',
            'timestamp': datetime.now().isoformat()
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
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Generate JWT token
        token = jwt.encode(
            {
                'username': user.username,
                'email': user.email,
                'exp': datetime.utcnow() + timedelta(days=30)
            },
            JWT_SECRET,
            algorithm=JWT_ALGORITHM
        )
        
        print(f"✅ User logged in: {user.username}")
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'token': token,
            'user': user.to_dict(),
            'timestamp': datetime.now().isoformat()
        }), 200
            
    except Exception as e:
        print(f"❌ Error in signin: {e}")
        return jsonify({
            'error': 'Login failed. Please try again.',
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/auth/verify', methods=['POST'])
@token_required
def verify_token(current_user):
    """Verify JWT token and return user info"""
    try:
        return jsonify({
            'success': True,
            'user': current_user.to_dict(),
            'timestamp': datetime.now().isoformat()
        }), 200
            
    except Exception as e:
        print(f"❌ Error in token verification: {e}")
        return jsonify({
            'error': 'Token verification failed',
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/auth/logout', methods=['POST'])
@token_required
def logout(current_user):
    """User logout endpoint"""
    try:
        print(f"✅ User logged out: {current_user.username}")
        
        return jsonify({
            'success': True,
            'message': 'Logout successful',
            'timestamp': datetime.now().isoformat()
        }), 200
            
    except Exception as e:
        print(f"❌ Error in logout: {e}")
        return jsonify({
            'error': 'Logout failed',
            'timestamp': datetime.now().isoformat()
        }), 500

# Chat endpoint
@app.route('/chat', methods=['POST'])
@token_required
def chat(current_user):
    """AI chat endpoint with enhanced multi-agent AI system"""
    try:
        data = request.json
        message = data.get('message', '')
        history = data.get('history', [])

        print(f"💬 Received message from {current_user.username}: {message[:50]}...")

        # Persistent memory
        preferences = UserPreferences.query.filter_by(user_id=current_user.id).first()
        last_mood = MoodEntry.query.filter_by(user_id=current_user.id).order_by(MoodEntry.timestamp.desc()).first()
        last_conversation = Conversation.query.filter_by(user_id=current_user.id).order_by(Conversation.timestamp.desc()).first()
        persistent_memory = {
            'first_name': current_user.first_name,
            'last_name': current_user.last_name,
            'age': current_user.age,
            'gender': current_user.gender,
            'preferences': preferences.to_dict() if preferences else {},
            'last_mood': last_mood.to_dict() if last_mood else {},
            'last_conversation': last_conversation.to_dict() if last_conversation else {}
        }

        # Use enhanced AI system with multiple agents
        response = generate_ai_response(
            message,
            current_user.first_name,
            emotion='neutral',  # Will be detected by ListenerAgent
            sentiment='neutral',  # Will be enhanced by AI analysis
            history=history,
            memory=persistent_memory
        )

        # Get final analysis from ListenerAgent for database storage
        listener_analysis = listener_agent.analyze_message(message)
        final_emotion = listener_analysis['emotion']['primary_emotion']
        final_crisis_level = listener_analysis['crisis']['crisis_level']

        # Debug logging
        print(f"🔍 Message: '{message}'")
        print(f"🔍 Final Emotion: {final_emotion}")
        print(f"🔍 Crisis Level: {final_crisis_level}")
        print(f"🔍 Response: {response[:100]}...")

        # Save conversation
        conversation = Conversation(
            user_id=current_user.id,
            message=message,
            response=response,
            emotion_detected=final_emotion,
            sentiment_score='negative' if final_crisis_level != 'none' else 'neutral',
            crisis_level='high' if final_crisis_level in ['high', 'medium'] else 'none'
        )
        db.session.add(conversation)
        db.session.commit()

        return jsonify({
            'response': response,
            'emotion_detected': final_emotion,
            'crisis_level': 'high' if final_crisis_level in ['high', 'medium'] else 'none',
            'sentiment_score': 'negative' if final_crisis_level != 'none' else 'neutral',
            'timestamp': datetime.now().isoformat(),
            'username': current_user.username
        })

    except Exception as e:
        print(f"❌ Error in chat route: {e}")
        return jsonify({
            'response': f"I'm having trouble right now, but I'm here for you, {current_user.first_name}. Could you try again?",
            'error': str(e)
        }), 500

# User data endpoints
@app.route('/user-stats/<username>')
@token_required
def get_user_stats(current_user, username):
    """Get user statistics and insights"""
    try:
        if current_user.username != username:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Get conversation stats
        conversations = Conversation.query.filter_by(user_id=current_user.id).all()
        activities = Activity.query.filter_by(user_id=current_user.id).all()
        mood_entries = MoodEntry.query.filter_by(user_id=current_user.id).all()
        
        # Calculate stats
        emotions_count = {}
        for conv in conversations:
            emotion = conv.emotion_detected or 'neutral'
            emotions_count[emotion] = emotions_count.get(emotion, 0) + 1
        
        # Calculate wellness score
        wellness_score = 50  # Base score
        if 'happiness' in emotions_count:
            wellness_score += min(emotions_count['happiness'] * 5, 30)
        if 'positive' in emotions_count:
            wellness_score += min(emotions_count['positive'] * 3, 20)
        if len(activities) > 0:
            wellness_score += min(len(activities) * 2, 20)
        if 'sadness' in emotions_count:
            wellness_score -= min(emotions_count['sadness'] * 3, 20)
        if 'anxiety' in emotions_count:
            wellness_score -= min(emotions_count['anxiety'] * 3, 20)
        
        wellness_score = max(0, min(100, wellness_score))
        
        return jsonify({
            'username': current_user.username,
            'total_conversations': len(conversations),
            'activity_count': len(activities),
            'emotions_count': emotions_count,
            'most_common_emotion': max(emotions_count.items(), key=lambda x: x[1])[0] if emotions_count else 'neutral',
            'wellness_score': wellness_score,
            'last_activity': activities[-1].to_dict() if activities else None,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Error getting user stats: {e}")
        return jsonify({
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/history/<username>')
@token_required
def get_history(current_user, username):
    """Get user conversation history"""
    try:
        if current_user.username != username:
            return jsonify({'error': 'Unauthorized'}), 403
        
        conversations = Conversation.query.filter_by(user_id=current_user.id).order_by(Conversation.timestamp.desc()).limit(20).all()
        
        return jsonify({
            'history': [conv.to_dict() for conv in conversations],
            'username': current_user.username,
            'total_conversations': len(conversations),
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        print(f"Error getting history: {e}")
        return jsonify({
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

# Activity endpoints
@app.route('/save-activity', methods=['POST'])
@token_required
def save_activity(current_user):
    """Save activity completion"""
    try:
        data = request.json
        activity_type = data.get('activity_type', '')
        activity_data = data.get('activity_data', {})
        
        activity = Activity(
            user_id=current_user.id,
            activity_type=activity_type,
            activity_data=activity_data
        )
        db.session.add(activity)
        db.session.commit()
        
        print(f"💾 Activity saved for {current_user.username}: {activity_type}")
        
        return jsonify({
            'success': True,
            'message': 'Activity saved successfully',
            'activity_type': activity_type,
            'username': current_user.username,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Error saving activity: {e}")
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

# Wellness tips endpoint
@app.route('/wellness-tips')
def get_wellness_tips():
    """Get daily wellness tips"""
    tips_by_day = {
        0: {  # Monday
            'tip': 'Start your week with intention! Set three small, achievable goals for today.',
            'activity': 'Try our breathing exercise to center yourself for the week ahead.',
            'emoji': '🌟',
            'focus': 'Goal Setting'
        },
        1: {  # Tuesday
            'tip': 'Take breaks between tasks. Even 5 minutes of mindfulness can refresh your mind.',
            'activity': 'Play our memory game to give your brain a fun workout!',
            'emoji': '🧠',
            'focus': 'Mindfulness'
        },
        2: {  # Wednesday
            'tip': 'Midweek check-in: How are you feeling? It\'s okay to adjust your expectations.',
            'activity': 'Use our mood tracker to reflect on your current emotional state.',
            'emoji': '💙',
            'focus': 'Self-Awareness'
        },
        3: {  # Thursday
            'tip': 'Practice gratitude today. What are three things that went well this week?',
            'activity': 'Try our gratitude game to focus on the positive aspects of your life.',
            'emoji': '🙏',
            'focus': 'Gratitude'
        },
        4: {  # Friday
            'tip': 'As the week winds down, celebrate your accomplishments, big or small!',
            'activity': 'Relax with our progressive muscle relaxation exercise.',
            'emoji': '🎉',
            'focus': 'Celebration'
        },
        5: {  # Saturday
            'tip': 'Weekend self-care: Do something that brings you joy and peace.',
            'activity': 'Engage your mind with our word puzzle games.',
            'emoji': '🌸',
            'focus': 'Self-Care'
        },
        6: {  # Sunday
            'tip': 'Sunday reflection: What did you learn about yourself this week?',
            'activity': 'Try all our activities and see which ones resonate with you.',
            'emoji': '🧘',
            'focus': 'Reflection'
        }
    }
    
    current_day = datetime.now().weekday()
    daily_tip = tips_by_day[current_day]
    
    return jsonify({
        'daily_tip': daily_tip,
        'date': datetime.now().strftime('%A, %B %d, %Y'),
        'day_of_week': datetime.now().strftime('%A'),
        'current_focus': daily_tip['focus'],
        'timestamp': datetime.now().isoformat()
    })

# Emergency resources endpoint
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
            }
        ],
        'disclaimer': 'If you are in immediate danger, please call emergency services (911 in US) or go to your nearest emergency room.',
        'timestamp': datetime.now().isoformat()
    }
    
    return jsonify(resources)

# Contact form endpoint
@app.route('/contact', methods=['POST'])
def submit_contact():
    """Handle contact form submissions"""
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['name', 'email', 'subject', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create new contact entry
        contact = Contact(
            name=data['name'],
            email=data['email'].lower(),
            subject=data['subject'],
            message=data['message']
        )
        
        # Save to database
        db.session.add(contact)
        db.session.commit()
        
        print(f"📧 New contact form submission from: {data['name']} ({data['email']})")
        
        return jsonify({
            'success': True,
            'message': 'Thank you for your message! We will get back to you soon.',
            'timestamp': datetime.now().isoformat()
        }), 201
        
    except Exception as e:
        print(f"❌ Error in contact form submission: {e}")
        db.session.rollback()
        return jsonify({
            'error': 'Failed to submit contact form. Please try again.',
            'timestamp': datetime.now().isoformat()
        }), 500

# Health check endpoint
@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Mental Health Buddy AI - Enhanced Multi-Agent System',
        'version': '3.0.0',
        'database': 'SQLite with SQLAlchemy',
        'ai_system': {
            'primary_model': 'Gemini 2.0 Flash' if GOOGLE_API_KEY else 'Enhanced Fallback',
            'therapy_agent': 'Active',
            'listener_agent': 'Active',
            'escalation_agent': 'Active',
            'multi_agent_coordination': 'Enabled'
        },
        'current_time': datetime.now().isoformat(),
        'features': {
            'chat': True,
            'database': True,
            'authentication': True,
            'activities': True,
            'mood_tracking': True,
            'crisis_support': True,
            'emotion_analysis': True,
            'multi_agent_ai': True
        }
    })

# Create database tables
def create_tables():
    with app.app_context():
        db.create_all()
        print("✅ Database tables created successfully")

if __name__ == '__main__':
    # Create database tables
    create_tables()
    
    print("💙 Mental Health Buddy AI - Enhanced Multi-Agent System")
    print("💙 Visit http://localhost:5000/health for system health check")
    print("🔧 Database: SQLite with SQLAlchemy")
    print("🤖 AI System: Multi-Agent Coordination")
    print("🚀 Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5000)
