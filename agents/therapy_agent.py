import google.generativeai as genai
import os
from typing import List, Dict, Any
import time
from datetime import datetime

class TherapyAgent:
    def __init__(self):
        """Initialize the Therapy Agent with Gemini 2.0 Flash"""
        self.api_key = os.getenv('GEMINI_API_KEY')
        self.model = None
        self.is_connected = False
        
        if self.api_key:
            try:
                print("🔧 Configuring Gemini 2.0 Flash...")
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-2.0-flash-exp')  # Updated model
                print("✅ Gemini 2.0 Flash model initialized")
                
                # Quick connection test with timeout
                self.is_connected = self._quick_test()
                
            except Exception as e:
                print(f"⚠️ Gemini initialization failed: {e}")
                self.model = None
                self.is_connected = False
        else:
            print("⚠️ GEMINI_API_KEY not found in environment variables")
    
    def _quick_test(self) -> bool:
        """Quick test with timeout to avoid hanging"""
        try:
            if not self.model:
                return False
            
            print("🧪 Testing Gemini connection (5s timeout)...")
            
            # Set a timeout for the API call
            import signal
            
            def timeout_handler(signum, frame):
                raise TimeoutError("API call timed out")
            
            # Set timeout (only works on Unix systems)
            try:
                signal.signal(signal.SIGALRM, timeout_handler)
                signal.alarm(5)  # 5 second timeout
                
                response = self.model.generate_content("Test")
                signal.alarm(0)  # Cancel the alarm
                
                print("✅ Gemini API test successful!")
                return True
                
            except (TimeoutError, AttributeError):
                # Windows doesn't support signal.alarm, use a different approach
                print("⏰ Testing with alternative method...")
                response = self.model.generate_content("Test")
                print("✅ Gemini API test successful!")
                return True
                
        except Exception as e:
            print(f"❌ Gemini API test failed: {e}")
            return False
    
    def test_api_connection(self) -> bool:
        """Test if Gemini API is working"""
        if not self.is_connected:
            print("🔄 API not initially connected, retrying...")
            self.is_connected = self._quick_test()
        
        return self.is_connected
    
    def generate_empathetic_response(self, message: str, emotion_data: Dict, user_history: List = None, username: str = "Akashpatel2609", context: Dict = None) -> str:
        """Generate an empathetic response using Gemini 2.0 Flash with enhanced context"""
        try:
            if not self.model or not self.is_connected:
                print("⚠️ Gemini not available, using fallback response")
                return self.get_fallback_response(emotion_data.get('primary_emotion', 'neutral'), username)
            
            # Create enhanced context from user history and additional context
            history_context = ""
            if user_history:
                recent_history = user_history[-5:]  # Last 5 conversations for better context
                history_context = "Recent conversation context:\n"
                for msg, resp, emotion, timestamp in recent_history:
                    history_context += f"User: {msg}\nEmotion: {emotion}\n\n"
            
            primary_emotion = emotion_data.get('primary_emotion', 'neutral')
            current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')
            
            # Enhanced context information
            context_info = ""
            if context:
                sentiment = context.get('sentiment_score', 'neutral')
                time_of_day = context.get('time_of_day', 12)
                previous_emotions = context.get('previous_emotions', [])
                
                # Time-based context
                if 5 <= time_of_day < 12:
                    time_context = "morning"
                elif 12 <= time_of_day < 17:
                    time_context = "afternoon"
                elif 17 <= time_of_day < 22:
                    time_context = "evening"
                else:
                    time_context = "night"
                
                context_info = f"""
                Additional Context:
                - Sentiment: {sentiment}
                - Time of day: {time_context}
                - Message length: {context.get('message_length', 0)} characters
                - Conversation history: {context.get('user_history_length', 0)} previous interactions
                - Recent emotions: {', '.join(previous_emotions[-3:]) if previous_emotions else 'none'}
                """
            
            prompt = f"""
            You are Mira, a compassionate AI mental health companion. Current time: {current_time}
            
            You are speaking with {username}, who is experiencing {primary_emotion}.

            Guidelines:
            - Be warm, empathetic, and non-judgmental
            - Use first person ("I understand", "I'm here for you")
            - Address the user by their name ({username}) occasionally to personalize responses
            - Keep responses conversational and natural (150-250 words max)
            - Offer gentle support and validation
            - Suggest coping strategies when appropriate
            - Be more human-like and conversational, not robotic
            - Show understanding of their emotional state
            - Ask follow-up questions to encourage deeper sharing
            - Mention relevant therapeutic activities when helpful:
              * Breathing exercises for anxiety
              * Gratitude games for sadness
              * Word puzzles for distraction
              * Memory games for cognitive engagement
              * Mood tracker for self-awareness
              * Progressive relaxation for tension
            - Never diagnose or provide medical advice
            - If the user seems in crisis, express concern and suggest professional help
            - Use the context information to provide more personalized responses

            {history_context}
            {context_info}

            Current user message: "{message}"
            Detected emotion: {primary_emotion}

            Respond as Mira with empathy, understanding, and support. Make the response feel natural and human-like:
            """
            
            generation_config = {
                'temperature': 0.8,  # Slightly higher for more creative responses
                'top_p': 0.9,
                'top_k': 40,
                'max_output_tokens': 350,  # Slightly longer for more detailed responses
            }
            
            safety_settings = [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
            ]
            
            print(f"🤖 Generating enhanced response for {username}...")
            response = self.model.generate_content(
                prompt,
                generation_config=generation_config,
                safety_settings=safety_settings
            )
            
            if response.candidates and response.candidates[0].content.parts:
                result = response.text.strip()
                print(f"✅ Enhanced response generated: {len(result)} characters")
                return result
            else:
                print("⚠️ Response was filtered, using fallback")
                return self.get_fallback_response(primary_emotion, username)
            
        except Exception as e:
            print(f"❌ Error generating response: {e}")
            return self.get_fallback_response(emotion_data.get('primary_emotion', 'neutral'), username)
    
    def get_fallback_response(self, emotion: str, username: str = "Akashpatel2609") -> str:
        """Fallback responses when AI is unavailable"""
        responses = {
            'sadness': f"I can hear that you're going through a difficult time right now, {username}. Your feelings are valid, and I'm here to listen. Sometimes our gratitude activities can help shift focus to positive moments. Would you like to talk more about what's happening?",
            'anxiety': f"It sounds like you're feeling overwhelmed right now, {username}. That can be really tough. Let's take this one step at a time. Our breathing exercises are specifically designed to help with anxiety - would you like to try one, or would you prefer to talk through what's making you anxious?",
            'anger': f"I can sense you're feeling frustrated, {username}. It's completely normal to feel angry sometimes. Sometimes our word puzzles can help redirect that intense energy. Would it help to talk through what's bothering you?",
            'loneliness': f"Feeling lonely can be really hard, {username}. I want you to know that you're not alone - I'm here with you right now. Our activities are always available when you need a sense of connection or accomplishment. Would you like to share what's making you feel this way?",
            'happiness': f"It's wonderful to hear some positivity in your message, {username}! I'm glad you're feeling good. How can I support you in maintaining this positive energy? Maybe our mood tracker could help you reflect on what's working well?",
            'fear': f"I can sense you're feeling afraid, {username}. Fear can be overwhelming, but you're safe here with me. Our progressive relaxation exercises might help you feel more grounded. What's been causing you to feel scared?",
            'neutral': f"Thank you for sharing with me, {username}. I'm here to listen and support you. We have various therapeutic activities available if you'd like to try something engaging. How are you feeling right now?"
        }
        
        return responses.get(emotion, responses['neutral'])