import random
from typing import Dict, List
from datetime import datetime

class TherapyAgentFallback:
    def __init__(self):
        self.empathetic_responses = {
            'sadness': [
                "I can hear the pain in your words, {username}. It's completely understandable to feel this way. Sometimes life feels overwhelming, and that's okay. Would you like to talk about what's been weighing on your heart?",
                "Thank you for sharing something so personal with me. Sadness can feel so heavy, but you're not alone in this. I'm here to listen without judgment. What's been the hardest part for you lately?",
                "I notice you're going through a difficult time. Your feelings are completely valid, and it takes courage to reach out. Sometimes just acknowledging our pain is the first step. How long have you been feeling this way?"
            ],
            'anxiety': [
                "I can sense you're feeling overwhelmed right now, {username}. Anxiety can make everything feel so much bigger and scarier. Let's take this one moment at a time. Can you tell me what's been triggering these feelings?",
                "Anxiety can be exhausting, and I want you to know that what you're experiencing is real and valid. You're safe right now, in this moment. Would it help to try a simple breathing exercise together?",
                "I hear that you're feeling anxious. Sometimes our minds race with 'what if' thoughts. Remember, you've gotten through difficult times before, and you can get through this too. What usually helps you feel more grounded?"
            ],
            'anger': [
                "I can feel the frustration in your message, {username}. It's completely normal to feel angry sometimes - it often means something important to you has been affected. What's been building up this anger for you?",
                "Anger can be such a powerful emotion, and it's okay to feel it. Sometimes it's our way of protecting ourselves or standing up for what matters. I'm here to listen. What's been making you feel this way?",
                "I hear your frustration, and I want you to know it's valid. Anger often covers up other emotions like hurt or disappointment. When you're ready, I'd like to understand what's really going on for you."
            ],
            'loneliness': [
                "Feeling lonely can be one of the hardest emotions to bear, {username}. I want you to know that even though it feels like you're alone, you're not. I'm here with you right now. Can you tell me more about what's making you feel isolated?",
                "Loneliness can make the world feel so empty and quiet. But you reached out today, and that shows incredible strength. You matter, and your feelings matter. What's been making you feel most alone lately?",
                "I hear how lonely you're feeling, and I want you to know that this feeling, while painful, is temporary. You're worthy of connection and love. Sometimes reaching out, like you're doing now, is the first step. How can I best support you today?"
            ],
            'fear': [
                "I can sense the fear in your words, {username}. Fear can make everything feel uncertain and scary. You're brave for sharing this with me. What's been causing you to feel afraid?",
                "Fear is such a human emotion, and it's okay to feel scared sometimes. It often means we care deeply about something. You're safe here with me. Can you help me understand what's been frightening you?",
                "I hear that you're feeling afraid. Fear can feel overwhelming, but remember that you don't have to face it alone. I'm here to listen and support you. What would feel most helpful right now?"
            ],
            'hopelessness': [
                "I'm really glad you reached out, {username}. When we feel hopeless, it can seem like things will never get better, but feelings - even the strongest ones - do change. You've shown strength by being here. Can you tell me what's been making you feel this way?",
                "I hear how hopeless you're feeling right now, and I want you to know that these feelings, while incredibly painful, are not permanent. You matter, and your life has value. What's been happening that's brought you to this point?",
                "Hopelessness can feel like being in a dark tunnel with no light. But you're here, talking to me, and that's a sign of your strength. Sometimes we need to take things one moment at a time. How are you feeling right in this moment?"
            ],
            'happiness': [
                "I can hear the joy in your message, {username}! It's wonderful to share in your happiness. What's been bringing you this positive energy today?",
                "It's so lovely to hear you feeling good, {username}. Happiness is precious, and I'm glad you're experiencing it. What's been going well for you?",
                "Your positive energy is contagious! I'm so happy that you're feeling this way, {username}. What would you like to share about what's making you feel so good?"
            ],
            'neutral': [
                "Thank you for reaching out, {username}. I'm here to listen and support you in whatever way you need. How are you feeling today, and what's on your mind?",
                "I'm glad you're here, {username}. Sometimes it's hard to know where to start, and that's completely okay. I'm here to listen without judgment. What would you like to talk about?",
                "Hi {username}, I'm here for you. Whether you're having a good day or a difficult one, I want you to know that your feelings are valid. What's going on for you today?"
            ]
        }
        
        self.follow_up_questions = {
            'sadness': [
                "What would help you feel a little bit better right now?",
                "Is there someone in your life you feel comfortable talking to about this?",
                "Have you been taking care of your basic needs - eating, sleeping, staying hydrated?"
            ],
            'anxiety': [
                "What does your anxiety feel like in your body?",
                "Are there specific situations that tend to trigger your anxiety?",
                "What has helped you cope with anxiety in the past?"
            ],
            'anger': [
                "What do you think is at the root of this anger?",
                "How do you usually express or deal with angry feelings?",
                "Is there something you need that you're not getting?"
            ],
            'loneliness': [
                "When do you feel most lonely?",
                "What kind of connection are you craving right now?",
                "Are there small steps you could take to reach out to someone?"
            ],
            'fear': [
                "What would help you feel safer right now?",
                "Is this fear about something specific or more of a general feeling?",
                "What would you tell a friend who was experiencing this same fear?"
            ],
            'hopelessness': [
                "Can you think of a time when you felt differently than you do now?",
                "What has kept you going during difficult times before?",
                "If you could change one small thing about today, what would it be?"
            ]
        }
        
        self.coping_strategies = {
            'anxiety': [
                "Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
                "Practice deep breathing: Breathe in for 4 counts, hold for 4, out for 6.",
                "Try our breathing exercise activity - it's designed specifically for anxiety relief."
            ],
            'sadness': [
                "It's okay to feel sad. Allow yourself to feel this emotion without judgment.",
                "Try writing in a journal about what you're experiencing.",
                "Our gratitude game might help shift your focus to positive aspects of your day."
            ],
            'anger': [
                "Take some deep breaths and count to 10 before responding.",
                "Try physical exercise to release the energy that anger brings.",
                "Sometimes our word puzzles can help redirect mental energy in a positive way."
            ],
            'loneliness': [
                "Reach out to someone you trust, even with a simple 'hello' message.",
                "Consider joining online communities with people who share your interests.",
                "Our activities are here whenever you need a gentle distraction or sense of accomplishment."
            ]
        }
    
    def generate_empathetic_response(self, message: str, emotion_data: Dict, user_history: List = None, username: str = "Akashpatel2609") -> str:
        """Generate empathetic response using predefined responses"""
        
        primary_emotion = emotion_data.get('primary_emotion', 'neutral')
        
        # Get base response
        responses = self.empathetic_responses.get(primary_emotion, self.empathetic_responses['neutral'])
        base_response = random.choice(responses).format(username=username)
        
        # Add follow-up question occasionally
        if random.random() < 0.7:  # 70% chance to add follow-up
            follow_ups = self.follow_up_questions.get(primary_emotion, [])
            if follow_ups:
                follow_up = random.choice(follow_ups)
                base_response += f"\n\n{follow_up}"
        
        # Add coping strategy occasionally for relevant emotions
        if primary_emotion in self.coping_strategies and random.random() < 0.3:  # 30% chance
            strategy = random.choice(self.coping_strategies[primary_emotion])
            base_response += f"\n\nHere's something that might help: {strategy}"
        
        return base_response
    
    def test_api_connection(self) -> bool:
        """Always returns True for fallback mode"""
        return True