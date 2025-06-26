import google.generativeai as genai
import os
from typing import List, Dict, Any
import time
from datetime import datetime
import random

class TherapyAgent:
    def __init__(self):
        """Initialize the Therapy Agent with Gemini 2.0 Flash"""
        self.api_key = os.getenv('GEMINI_API_KEY')
        self.model = None
        self.is_connected = False
        self.response_cache = {}  # Cache to avoid immediate repetition
        
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
                return self.get_fallback_response(emotion_data.get('primary_emotion', 'neutral'), username, message)
            
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
            You are Dr. Mira, a licensed clinical psychologist with 15+ years of experience specializing in cognitive behavioral therapy, anxiety disorders, depression, and trauma-informed care. You provide evidence-based therapeutic interventions.

            THERAPEUTIC APPROACH:
            - Use active listening and reflective statements
            - Apply CBT techniques: identify thoughts, feelings, behaviors
            - Practice Socratic questioning to promote insight
            - Validate emotions while exploring underlying thoughts
            - Use mindfulness and grounding techniques when appropriate
            - Maintain professional therapeutic boundaries
            - Apply motivational interviewing principles
            - Use person-centered therapy warmth and genuineness

            EVIDENCE-BASED TECHNIQUES TO INCORPORATE:
            For Anxiety: Cognitive restructuring, exposure concepts, breathing techniques
            For Depression: Behavioral activation, thought challenging, mood monitoring
            For Anger: Emotion regulation, trigger identification, coping skills
            For Trauma: Grounding techniques, safety, present-moment awareness
            For General Support: Unconditional positive regard, empathic reflection

            THERAPEUTIC LANGUAGE PATTERNS:
            - "I notice..." (observation without judgment)
            - "Help me understand..." (invitation to explore)
            - "What comes up for you when..." (emotional exploration)
            - "I'm curious about..." (gentle inquiry)
            - "Many people in similar situations find..." (normalization)
            - "What would it look like if..." (behavioral experimentation)
            - "How does that sit with you?" (checking in)

            CLIENT INFORMATION:
            Name: {username}
            Current emotional state: {primary_emotion}
            Session timestamp: {current_time}

            {history_context}
            {context_info}

            CLIENT'S CURRENT STATEMENT: "{message}"

            THERAPEUTIC RESPONSE INSTRUCTIONS:
            1. Start with validation and reflection of their emotional experience
            2. Use one therapeutic technique appropriate to their concern
            3. Ask one open-ended question to deepen exploration
            4. Keep response 150-250 words, conversational yet professional
            5. If crisis indicators present, address safety and provide resources
            6. Avoid advice-giving; focus on helping them discover their own insights
            7. Use their name naturally within the conversation

            Provide your therapeutic response as Dr. Mira:
            """
            
            generation_config = {
                'temperature': 0.3,  # Lower temperature for more consistent, professional responses
                'top_p': 0.8,        # Focused on most likely tokens for therapeutic consistency
                'top_k': 20,         # More focused responses
                'max_output_tokens': 400,  # Longer responses for therapeutic depth
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
                return self.get_fallback_response(primary_emotion, username, message)
            
        except Exception as e:
            print(f"❌ Error generating response: {e}")
            return self.get_fallback_response(emotion_data.get('primary_emotion', 'neutral'), username, message)
    
    def get_fallback_response(self, emotion: str, username: str = "Akashpatel2609", message: str = "") -> str:
        """Enhanced professional therapeutic fallback responses when AI is unavailable"""
        import random
        
        # Check message content for specific context
        message_lower = message.lower()
        
        # Determine context from message content
        context = 'neutral'
        if any(phrase in message_lower for phrase in ['not feeling well', 'not good', 'not okay', 'not fine', 'feeling bad', 'feeling terrible', 'feeling awful']):
            context = 'not_well'
        elif any(word in message_lower for word in ['how are you', 'how do you do', 'hello', 'hi', 'hey']):
            context = 'greeting'
        elif any(word in message_lower for word in ['thank you', 'thanks', 'appreciate']):
            context = 'gratitude'
        elif any(word in message_lower for word in ['job', 'work', 'employment', 'career', 'interview']):
            context = 'work_stress'
        elif any(word in message_lower for word in ['sleep', 'bed', 'rest', 'tired', 'exhausted']):
            context = 'sleep_issues'
        elif any(word in message_lower for word in ['overthink', 'overthinking', 'constant thoughts', 'racing mind']):
            context = 'overthinking'
        
        # Multiple response options for each emotion to avoid repetition
        response_options = {
            'sadness': [
                f"I can hear the sadness in what you're sharing, {username}, and I want you to acknowledge how brave it is to reach out when you're struggling. Sadness often carries important information about what matters to us. I'm curious - what thoughts have been most present for you during these difficult moments?",
                
                f"I'm noticing the heaviness in what you're describing, {username}. When we're feeling sad, it can feel like we're carrying a weight that no one else can see. What's been the hardest part about what you're going through? Sometimes just naming the struggle can help us feel less alone in it.",
                
                f"Thank you for trusting me with these feelings, {username}. Sadness can be so isolating, but you're not alone in this experience. What would it feel like to give yourself permission to feel this way without judgment? What do you think your sadness might be trying to tell you?",
                
                f"I can sense the depth of what you're experiencing, {username}. Sadness often comes with a lot of self-criticism, but reaching out like this shows real strength. What's been your experience of trying to cope with these feelings? Sometimes the ways we try to help ourselves can give us important clues about what we really need."
            ],
            
            'anxiety': [
                f"I notice there's a lot of worry and tension in what you're telling me, {username}. Anxiety can feel so overwhelming, like your mind is racing ahead to all the 'what-ifs.' Let's take a moment to ground ourselves in the present. Can you tell me what thoughts are contributing most to these anxious feelings?",
                
                f"I'm hearing the anxiety in your voice, {username}, and I want you to know that anxiety is your brain's way of trying to protect you. It's working overtime, but that doesn't mean the threats are real. What would it feel like to take a few deep breaths together? What's the most immediate thing that's worrying you right now?",
                
                f"Anxiety can feel like being stuck in a loop of worry, {username}. It's exhausting trying to manage all those 'what if' thoughts. Sometimes anxiety is our brain's way of trying to solve a problem, but it's just spinning in circles. What do you think your anxiety is trying to solve for you?",
                
                f"I can hear how overwhelming this anxiety feels, {username}. It's like your nervous system is stuck in high alert. What would it feel like to acknowledge that your anxiety is trying to help, even if it's not being very helpful right now? What's one small thing that might help you feel a bit more grounded?"
            ],
            
            'greeting': [
                f"Hello {username}! I'm here and ready to listen. How are you feeling today? What's been on your mind lately?",
                
                f"Hi {username}! Thank you for reaching out. I'm here to support you. What would you like to talk about today?",
                
                f"Hey {username}! I'm glad you're here. How can I help you today? What's been your experience lately?",
                
                f"Hello {username}! I'm here to listen and support you. What's been on your mind? How are you doing?"
            ],
            
            'gratitude': [
                f"You're very welcome, {username}! I'm here for you whenever you need support. Is there anything else you'd like to talk about?",
                
                f"Thank you for your kind words, {username}. I'm glad I could help. What else is on your mind today?",
                
                f"That means a lot to me, {username}. I'm here to support you. Is there anything else you'd like to explore?",
                
                f"You're welcome, {username}! I'm here whenever you need someone to talk to. What's next for you?"
            ],
            
            'work_stress': [
                f"I can hear how challenging the job search process has been for you, {username}. It's completely normal to feel overwhelmed by the uncertainty and constant applications. What's been the most difficult part about this experience for you?",
                
                f"Job searching can be such a rollercoaster, {username}. The constant overthinking and rejection can really take a toll on your mental health. What do you think might help you feel a bit more grounded during this process?",
                
                f"I understand how stressful this job search journey can be, {username}. It's like you're carrying this constant weight of uncertainty. What would it feel like to acknowledge that this is genuinely hard work?",
                
                f"The job market can feel so overwhelming, {username}. It's okay to feel frustrated and anxious about this. What's one small thing that might help you feel a bit more in control?"
            ],
            
            'sleep_issues': [
                f"Sleep is so crucial for our mental health, {username}. When we're stressed, it can really mess with our sleep patterns. Your brain is probably running through all the 'what ifs' when you're trying to rest. What do you think might help you feel more relaxed before bed?",
                
                f"I hear how difficult the sleep issues have been, {username}. It's exhausting when your mind won't quiet down. What's been your experience of trying to get rest? Sometimes just acknowledging that it's hard can help.",
                
                f"Sleep problems can feel so isolating, {username}. It's like you're the only one awake while everyone else is resting. What would it feel like to be gentle with yourself about this? What do you think your body might need right now?",
                
                f"I can sense how much this is affecting you, {username}. Poor sleep can make everything else feel so much harder. What's been your experience of trying to manage this? Sometimes the ways we try to help ourselves can give us important clues."
            ],
            
            'overthinking': [
                f"Overthinking is like having a broken record in your head, isn't it, {username}? Your brain is trying to solve a problem, but it's just spinning in circles. What do you think your mind is trying to figure out?",
                
                f"I can hear how exhausting this overthinking has been, {username}. It's like your mind is stuck in problem-solving mode. What would it feel like to give your brain permission to take a break? What might help you feel more present?",
                
                f"Overthinking can feel so overwhelming, {username}. It's like you're constantly trying to anticipate every possible outcome. What do you think your overthinking is trying to protect you from?",
                
                f"I understand how challenging this constant thinking can be, {username}. It's exhausting trying to manage all those thoughts. What would it feel like to acknowledge that your mind is working hard, even if it's not being very helpful right now?"
            ],
            
            'not_well': [
                f"I hear that you're not feeling well, {username}. That can be really hard to deal with, especially when you're not sure exactly what's wrong. Sometimes our bodies and minds just feel off, and that's completely normal. What do you think might be contributing to feeling this way?",
                
                f"I'm sorry you're not feeling well, {username}. It's okay to not be okay, and reaching out like this shows real strength. What would it feel like to be gentle with yourself about not feeling well? What kind of support do you think might help you feel a bit better?",
                
                f"I can hear that you're struggling, {username}. Not feeling well can be so frustrating and isolating. What's been the hardest part about what you're experiencing? Sometimes just naming what's difficult can help us feel less alone in it.",
                
                f"Thank you for telling me you're not feeling well, {username}. It takes courage to admit when we're struggling. What would it feel like to give yourself permission to not be okay right now? What do you think you might need to help you through this?"
            ],
            
            'neutral': [
                f"Thank you for taking the time to share with me, {username}. I'm here to listen and understand your experience without judgment. Sometimes it can be helpful to check in with ourselves - what's been on your mind lately? What feels most important for you to explore or work through today?",
                
                f"I appreciate you reaching out, {username}. It takes courage to open up, even when we're not sure what to say. What's been your experience lately? Sometimes just starting with what's present for us right now can lead to important insights.",
                
                f"I'm here to listen, {username}. There's no pressure to have everything figured out - we can simply start wherever you are right now. What feels most present for you in this moment? What would be most helpful for you to explore or work through?",
                
                f"Thank you for trusting me with your thoughts, {username}. I want you to know that whatever you're experiencing is valid and worth exploring. What's been on your mind? Sometimes the things we think are 'small' can actually be quite significant when we give them space."
            ]
        }
        
        # Determine the best response category based on context and emotion
        if context != 'neutral':
            category = context
        elif emotion in response_options:
            category = emotion
        else:
            category = 'neutral'
        
        # Get available responses for this category
        responses = response_options.get(category, response_options['neutral'])
        
        # Use cache to avoid immediate repetition
        cache_key = f"{username}_{category}"
        if cache_key in self.response_cache:
            # Remove the cached response from options to avoid repetition
            cached_response = self.response_cache[cache_key]
            available_responses = [r for r in responses if r != cached_response]
            if available_responses:
                responses = available_responses
        
        # Select a random response and cache it
        selected_response = random.choice(responses)
        self.response_cache[cache_key] = selected_response
        
        # Clear old cache entries to prevent memory buildup
        if len(self.response_cache) > 50:
            self.response_cache.clear()
        
        return selected_response