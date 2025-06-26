import re
from typing import Dict, List

class ListenerAgent:
    def __init__(self):
        """Initialize the Listener Agent for message analysis"""
        self.emotion_keywords = {
            'sad': ['sad', 'depressed', 'down', 'miserable', 'unhappy', 'crying', 'tears', 'empty', 'hopeless', 'lonely'],
            'angry': ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated', 'rage', 'hate', 'pissed'],
            'anxious': ['anxious', 'worried', 'nervous', 'scared', 'afraid', 'panic', 'stress', 'overwhelmed', 'fear'],
            'happy': ['happy', 'joy', 'excited', 'glad', 'cheerful', 'delighted', 'elated', 'pleased', 'content'],
            'fear': ['terrified', 'frightened', 'scared', 'afraid', 'horrified', 'petrified', 'panic', 'dread']
        }
        
        self.crisis_keywords = {
            'high': ['suicide', 'kill myself', 'end it all', 'no point living', 'better off dead', 'want to die'],
            'medium': ['hate myself', 'worthless', 'useless', 'no hope', 'can\'t go on', 'nothing matters'],
            'low': ['really down', 'terrible day', 'everything wrong', 'feel awful', 'can\'t handle']
        }
    
    def analyze_message(self, message: str) -> Dict:
        """Analyze user message for emotions and crisis indicators"""
        message_lower = message.lower()
        
        # Analyze emotions
        emotion_scores = {}
        for emotion, keywords in self.emotion_keywords.items():
            score = sum(1 for keyword in keywords if keyword in message_lower)
            if score > 0:
                emotion_scores[emotion] = score
        
        # Determine primary emotion
        if emotion_scores:
            primary_emotion = max(emotion_scores, key=emotion_scores.get)
            confidence = min(emotion_scores[primary_emotion] / len(message.split()) * 10, 1.0)
        else:
            primary_emotion = 'neutral'
            confidence = 0.5
        
        # Check for crisis indicators
        crisis_level = 'none'
        needs_escalation = False
        
        for level, keywords in self.crisis_keywords.items():
            if any(keyword in message_lower for keyword in keywords):
                crisis_level = level
                if level in ['high', 'medium']:
                    needs_escalation = True
                break
        
        return {
            'emotion': {
                'primary_emotion': primary_emotion,
                'confidence': confidence,
                'all_emotions': emotion_scores
            },
            'crisis': {
                'crisis_level': crisis_level,
                'needs_escalation': needs_escalation
            },
            'message_length': len(message),
            'word_count': len(message.split())
        }