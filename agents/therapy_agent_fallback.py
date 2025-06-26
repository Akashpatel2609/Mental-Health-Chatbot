import random
from typing import Dict, List
from datetime import datetime

class TherapyAgentFallback:
    def __init__(self):
        """Initialize therapeutic responses based on evidence-based practices"""
        self.therapeutic_responses = {
            'sadness': [
                "I can hear the sadness in what you're sharing, {username}, and I want to validate how difficult this must be for you. Depression and sadness often carry important information about losses or unmet needs in our lives. I'm curious - what thoughts tend to go through your mind when you're feeling this low? Sometimes our thinking patterns can intensify our emotional pain.",
                
                "Thank you for trusting me with these vulnerable feelings, {username}. Sadness is one of our most human emotions, and it often signals that something meaningful to us has been affected. When you notice this sadness arising, what does your inner voice tend to tell you about yourself or your situation? I'm wondering if we might explore some of those thoughts together.",
                
                "I notice you're carrying some heavy emotions right now, {username}. In my experience, sadness often comes with a story our minds tell us about why we're feeling this way. Help me understand - what meaning are you making of this difficult time? Sometimes when we examine these stories, we can find new perspectives that feel more balanced and helpful."
            ],
            
            'anxiety': [
                "I can sense the anxiety and worry in what you're telling me, {username}. Anxiety often involves our mind trying to solve problems by thinking through every possible scenario, which can feel exhausting. What I'm curious about is - what specific thoughts or images go through your mind when you notice the anxiety building? Understanding your thought patterns can be the first step in managing anxiety more effectively.",
                
                "It sounds like you're experiencing a lot of worry and tension, {username}. One thing I often notice with anxiety is that our minds can get caught in 'what if' thinking - imagining all the things that could go wrong. I'm wondering, when you're feeling anxious, how much of your worry is about things that are actually happening right now versus things you're imagining might happen?",
                
                "I hear how overwhelming the anxiety feels for you, {username}. Sometimes anxiety can make our world feel very small and threatening. I'm curious - when you think about the situations that make you most anxious, what is it that you're most afraid might happen? And what evidence do you have that this fear is realistic versus your anxiety talking?"
            ],
            
            'anger': [
                "I can feel the anger and frustration in your words, {username}. Anger is often a secondary emotion that protects other, more vulnerable feelings underneath - sometimes hurt, disappointment, or feeling powerless. I'm curious, when you think about what's making you angry, what other emotions might be there as well? What would it look like to honor both the anger and what's beneath it?",
                
                "It sounds like you're feeling really frustrated and perhaps unheard, {username}. Anger often signals that one of our important values or boundaries has been crossed. Help me understand - what feels most unfair or wrong about your situation? What would need to happen for you to feel that your needs were being respected?",
                
                "I hear the intensity of your anger, {username}, and I want you to know that feeling angry doesn't make you a bad person. Often anger is our psyche's way of saying 'this isn't okay' or 'I deserve better.' What I'm curious about is - if this anger could speak, what would it most want the people in your life to understand about your experience?"
            ],
            
            'fear': [
                "I can hear the fear in what you're sharing, {username}, and I want to acknowledge how vulnerable it feels to be afraid. Fear often arises when we perceive a threat to something we value deeply. I'm curious - when you imagine the thing you're most afraid of happening, what would that mean about you or your life? Sometimes exploring the meaning behind our fears can help us understand them better.",
                
                "Fear can make the world feel very unsafe and unpredictable, {username}. One thing I often explore with clients is the difference between realistic concerns and anxiety-driven fears. When you think about what you're afraid of, how likely is it to actually happen? And if it did happen, what resources and strengths do you have to cope with it?",
                
                "I notice you're dealing with some significant fears, {username}. Sometimes when we're afraid, our minds can get stuck in a pattern of trying to control or avoid the things that scare us. I'm wondering - what would it look like to acknowledge the fear while still moving toward the things that matter most to you? What small step might feel manageable today?"
            ],
            
            'hopelessness': [
                "I'm really concerned about you, {username}, and I'm glad you reached out today. When we feel hopeless, it can seem like our current pain will last forever, but I want you to know that feelings, even the most intense ones, are temporary. Right now, in this moment, you're here talking with me, which shows incredible strength. What has kept you going, even when it feels impossible?",
                
                "The hopelessness you're describing sounds overwhelming, {username}. Sometimes when we're in deep emotional pain, our thinking can become very narrow - we can only see the problems and not the possibilities. I'm wondering, if a close friend were in your exact situation, what might you tell them? Sometimes we can offer ourselves the same compassion we'd give others.",
                
                "I hear how dark things feel for you right now, {username}. Hopelessness often comes when we feel trapped with no way forward. But you're here, which means part of you is still fighting, still hoping for something different. What would 'a little bit better' look like for you? We don't need to solve everything today - just take one small step toward something that matters to you."
            ],
            
            'happiness': [
                "I love hearing the joy in what you're sharing, {username}! Positive emotions are just as important to explore as difficult ones. I'm curious - what thoughts or beliefs about yourself and your life are present when you feel this happy? Sometimes understanding what contributes to our well-being can help us cultivate more of these moments.",
                
                "It's wonderful to hear you feeling good, {username}. I often encourage clients to really savor these positive moments and notice what's contributing to them. What specifically about today or your current situation is bringing you this happiness? What does this tell you about what you value or what brings meaning to your life?",
                
                "Your positive energy is really coming through, {username}! When we're feeling good, it can be valuable to pause and reflect on what's working well. What strengths or qualities in yourself do you notice when you're feeling this way? How might you remember this feeling during more challenging times?"
            ],
            
            'neutral': [
                "Thank you for being here with me today, {username}. Sometimes the most important work happens in these quiet moments when we're not in crisis - just checking in with ourselves and being honest about our experience. What's been on your mind lately? What feels most important for you to explore or understand better right now?",
                
                "I appreciate you taking the time to connect, {username}. Even when things feel calm or neutral, there's often a lot happening beneath the surface. I'm curious - how would you describe your overall sense of well-being lately? What aspects of your life feel most balanced, and what areas might need more attention?",
                
                "I'm glad you're here, {username}. Sometimes the most meaningful conversations happen when we're not in a particular emotional state - just being present with whatever is true for us right now. What would be most helpful for you to talk about today? What questions or concerns have been in the background of your thoughts?"
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
        """Generate therapeutic response using evidence-based approaches"""
        
        primary_emotion = emotion_data.get('primary_emotion', 'neutral')
        
        # Get appropriate therapeutic response
        responses = self.therapeutic_responses.get(primary_emotion, self.therapeutic_responses['neutral'])
        therapeutic_response = random.choice(responses).format(username=username)
        
        # Add therapeutic techniques based on emotion and message content
        message_lower = message.lower()
        
        # CBT-based interventions for negative thinking patterns
        if any(word in message_lower for word in ['always', 'never', 'everyone', 'nobody', 'terrible', 'awful']):
            cbt_addition = f"\n\nI notice you're using some very absolute language like 'always' or 'never.' Sometimes when we're struggling, our thinking can become very black-and-white. I'm wondering if there might be some middle ground or exceptions to explore here?"
            therapeutic_response += cbt_addition
        
        # Mindfulness intervention for overwhelm
        elif any(word in message_lower for word in ['overwhelmed', 'too much', 'can\'t handle', 'spinning']):
            mindfulness_addition = f"\n\nIt sounds like you're feeling really overwhelmed right now. Sometimes when everything feels like too much, it can help to come back to this present moment. Right now, you're here, you're breathing, you're safe. What do you notice about your breathing or your body right now?"
            therapeutic_response += mindfulness_addition
        
        # Strength-based intervention for hopelessness
        elif any(word in message_lower for word in ['hopeless', 'can\'t do anything', 'useless', 'worthless']):
            strength_addition = f"\n\nI hear how hopeless you're feeling, {username}. But I want to reflect back something I notice - you reached out today. You're here, communicating with me. That takes strength, even when it doesn't feel like it. What other small acts of courage or care have you shown recently, even if they seemed insignificant at the time?"
            therapeutic_response += strength_addition
        
        # Behavioral activation for depression indicators
        elif any(word in message_lower for word in ['no energy', 'don\'t want to', 'stay in bed', 'motivation']):
            behavioral_addition = f"\n\nLack of energy and motivation are such common experiences when we're struggling. Sometimes the smallest actions can be the most meaningful. I'm wondering - is there one tiny thing you could do today just for yourself? It could be as simple as making a cup of tea or stepping outside for a moment."
            therapeutic_response += behavioral_addition
        
        # Crisis assessment and safety
        crisis_keywords = ['suicide', 'kill myself', 'end it all', 'no point living', 'want to die', 'better off dead']
        if any(keyword in message_lower for keyword in crisis_keywords):
            crisis_response = f"\n\nI'm really concerned about you right now, {username}. What you're sharing tells me you're in significant emotional pain. Before we continue, I need to check - are you having thoughts of hurting yourself? If you're in immediate danger, please call 911 or go to your nearest emergency room. The National Suicide Prevention Lifeline (988) is also available 24/7."
            therapeutic_response = crisis_response
        
        return therapeutic_response
    
    def test_api_connection(self) -> bool:
        """Always returns True for fallback mode"""
        return True