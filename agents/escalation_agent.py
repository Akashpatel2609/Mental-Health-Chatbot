from typing import Dict
from config import Config

class EscalationAgent:
    def __init__(self):
        self.crisis_resources = Config.CRISIS_RESOURCES
    
    def handle_crisis(self, crisis_level: str, user_location: str = 'US') -> Dict:
        """Handle crisis situation with appropriate resources"""
        
        if crisis_level == 'high':
            return self.handle_high_crisis(user_location)
        elif crisis_level == 'medium':
            return self.handle_medium_crisis(user_location)
        else:
            return self.handle_low_crisis()
    
    def handle_high_crisis(self, location: str) -> Dict:
        """Handle high-risk crisis situation"""
        resources = self.crisis_resources.get(location, self.crisis_resources['US'])
        
        message = f"""
        Akashpatel2609, I'm really concerned about you right now. Your safety is the most important thing.
        
        Please reach out for immediate help:
        
        🚨 Emergency: {self.crisis_resources['Emergency']}
        📞 Crisis Line: {resources.get('suicide_prevention', resources.get('talk_suicide', 'Contact local emergency services'))}
        💬 Text Support: {resources.get('crisis_text', 'Available')}
        
        You don't have to go through this alone. There are people who want to help you.
        
        If you're in immediate danger, please call emergency services right now.
        """
        
        return {
            'response': message,
            'action_required': 'immediate_intervention',
            'resources': resources,
            'priority': 'critical'
        }
    
    def handle_medium_crisis(self, location: str) -> Dict:
        """Handle medium-risk crisis situation"""
        resources = self.crisis_resources.get(location, self.crisis_resources['US'])
        
        message = f"""
        I'm concerned about how you're feeling right now, Akashpatel2609. It takes courage to reach out, and I'm glad you're here.
        
        Here are some resources that might help:
        
        📞 Talk to someone: {resources.get('suicide_prevention', resources.get('talk_suicide', 'Contact local crisis line'))}
        💬 Text support: {resources.get('crisis_text', 'Available')}
        🌐 More resources: {resources.get('url', 'Contact local mental health services')}
        
        Would you like to talk about what's been making you feel this way? I'm here to listen.
        """
        
        return {
            'response': message,
            'action_required': 'provide_support',
            'resources': resources,
            'priority': 'high'
        }
    
    def handle_low_crisis(self) -> Dict:
        """Handle low-risk situation with gentle support"""
        message = """
        I can hear that you're going through a tough time. It's important that you reached out.
        
        Remember that difficult feelings are temporary, even when they don't feel that way.
        
        Would you like to talk more about what's happening? I'm here to listen and support you.
        """
        
        return {
            'response': message,
            'action_required': 'continue_conversation',
            'priority': 'normal'}
    
from typing import Dict
from config import Config

class EscalationAgent:
    def __init__(self):
        self.crisis_resources = Config.CRISIS_RESOURCES
    
    def handle_crisis(self, crisis_level: str, user_location: str = 'US') -> Dict:
        """Handle crisis situation with appropriate resources"""
        
        if crisis_level == 'high':
            return self.handle_high_crisis(user_location)
        elif crisis_level == 'medium':
            return self.handle_medium_crisis(user_location)
        else:
            return self.handle_low_crisis()
    
    def handle_high_crisis(self, location: str) -> Dict:
        """Handle high-risk crisis situation"""
        resources = self.crisis_resources.get(location, self.crisis_resources['US'])
        
        message = f"""
        Akashpatel2609, I'm really concerned about you right now. Your safety is the most important thing.
        
        Please reach out for immediate help:
        
        🚨 Emergency: {self.crisis_resources['Emergency']}
        📞 Crisis Line: {resources.get('suicide_prevention', resources.get('talk_suicide', 'Contact local emergency services'))}
        💬 Text Support: {resources.get('crisis_text', 'Available')}
        
        You don't have to go through this alone. There are people who want to help you.
        
        If you're in immediate danger, please call emergency services right now.
        """
        
        return {
            'response': message,
            'action_required': 'immediate_intervention',
            'resources': resources,
            'priority': 'critical'
        }
    
    def handle_medium_crisis(self, location: str) -> Dict:
        """Handle medium-risk crisis situation"""
        resources = self.crisis_resources.get(location, self.crisis_resources['US'])
        
        message = f"""
        I'm concerned about how you're feeling right now, Akashpatel2609. It takes courage to reach out, and I'm glad you're here.
        
        Here are some resources that might help:
        
        📞 Talk to someone: {resources.get('suicide_prevention', resources.get('talk_suicide', 'Contact local crisis line'))}
        💬 Text support: {resources.get('crisis_text', 'Available')}
        🌐 More resources: {resources.get('url', 'Contact local mental health services')}
        
        Would you like to talk about what's been making you feel this way? I'm here to listen.
        """
        
        return {
            'response': message,
            'action_required': 'provide_support',
            'resources': resources,
            'priority': 'high'
        }
    
    def handle_low_crisis(self) -> Dict:
        """Handle low-risk situation with gentle support"""
        message = """
        I can hear that you're going through a tough time. It's important that you reached out.
        
        Remember that difficult feelings are temporary, even when they don't feel that way.
        
        Would you like to talk more about what's happening? I'm here to listen and support you.
        """
        
        return {
            'response': message,
            'action_required': 'continue_conversation',
            'priority': 'normal'}

        