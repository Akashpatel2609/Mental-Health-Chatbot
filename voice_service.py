import os
import requests
import json
import speech_recognition as sr
import io
import base64
from typing import Optional
import time

class VoiceService:
    def __init__(self):
        """Initialize ElevenLabs Voice Service with Human-like Settings"""
        self.api_key = os.getenv('ELEVENLABS_API_KEY')
        
        # Multiple voice options - more human-like
        self.voice_options = {
            'rachel': "21m00Tcm4TlvDq8ikWAM",     # Calm, empathetic female
            'bella': "EXAVITQu4vr4xnSDxMaL",      # Gentle, caring female
            'domi': "AZnzlk1XvdvUeBnXmlld",       # Warm, supportive female
            'elli': "MF3mGyEYCl7XYWbV9V6O",      # Soft, kind female
            'josh': "TxGEqnHWrfWFTfGW9XjX",      # Calm, reassuring male
            'adam': "pNInz6obpgDQGcFmaJgB",      # Deep, comforting male
        }
        
        self.current_voice = 'bella'  # Default to Bella - most human-like
        self.voice_id = self.voice_options[self.current_voice]
        
        self.base_url = "https://api.elevenlabs.io/v1"
        self.recognizer = sr.Recognizer()
        
        try:
            self.microphone = sr.Microphone()
            print("✅ Microphone initialized")
        except Exception as e:
            print(f"⚠️ Microphone initialization failed: {e}")
            self.microphone = None
        
        if self.api_key:
            print("✅ ElevenLabs API key found - Human-like voice configured")
        else:
            print("⚠️ ELEVENLABS_API_KEY not found in environment variables")
    
    def text_to_speech(self, text: str, voice_id: Optional[str] = None, voice_style: str = 'empathetic') -> Optional[bytes]:
        """Convert text to speech with human-like natural voice"""
        try:
            if not self.api_key:
                print("❌ ElevenLabs API key not configured")
                return None
            
            # Clean and enhance text for natural speech
            clean_text = self._enhance_text_for_natural_speech(text)
            
            # Use specified voice or current default
            selected_voice_id = voice_id or self.voice_id
            
            print(f"🎤 Generating human-like speech: {clean_text[:50]}...")
            
            # API endpoint
            url = f"{self.base_url}/text-to-speech/{selected_voice_id}"
            
            # Headers
            headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": self.api_key
            }
            
            # Human-like voice settings based on style
            voice_settings = self._get_human_voice_settings(voice_style)
            
            # Enhanced data payload for natural speech
            data = {
                "text": clean_text,
                "model_id": "eleven_multilingual_v2",  # Better model for natural speech
                "voice_settings": voice_settings
            }
            
            # Make request with timeout
            response = requests.post(url, json=data, headers=headers, timeout=50)
            
            if response.status_code == 200:
                audio_data = response.content
                print(f"✅ Human-like speech generated successfully - {len(audio_data)} bytes")
                return audio_data
            else:
                print(f"❌ Failed to generate speech: {response.status_code}")
                print(f"Error details: {response.text}")
                return None
            
        except requests.exceptions.Timeout:
            print("⏰ Speech generation timed out")
            return None
        except Exception as e:
            print(f"❌ Error generating speech: {e}")
            return None
    
    def _get_human_voice_settings(self, style: str) -> dict:
        """Get human-like voice settings based on conversation style"""
        
        if style == 'empathetic':
            # For mental health conversations - warm, caring
            return {
                "stability": 0.85,           # Very stable for therapeutic content
                "similarity_boost": 0.75,    # Natural but consistent
                "style": 0.65,               # More expressive for empathy
                "use_speaker_boost": True,
                "optimize_streaming_latency": 0,
                "output_format": "mp3_44100_128"
            }
        elif style == 'gentle':
            # For sensitive topics - soft, understanding
            return {
                "stability": 0.80,
                "similarity_boost": 0.70,
                "style": 0.45,
                "use_speaker_boost": True,
                "optimize_streaming_latency": 0,
                "output_format": "mp3_44100_128"
            }
        elif style == 'cheerful':
            # For positive interactions - warm, uplifting
            return {
                "stability": 0.75,
                "similarity_boost": 0.80,
                "style": 0.70,
                "use_speaker_boost": True,
                "optimize_streaming_latency": 0,
                "output_format": "mp3_44100_128"
            }
        else:
            # Default balanced settings
            return {
                "stability": 0.80,
                "similarity_boost": 0.75,
                "style": 0.55,
                "use_speaker_boost": True,
                "optimize_streaming_latency": 0,
                "output_format": "mp3_44100_128"
            }
    
    def _enhance_text_for_natural_speech(self, text: str) -> str:
        """Enhance text to make speech sound more natural and human"""
        
        # Clean basic formatting
        text = text.replace('\n', '. ')
        text = text.replace('  ', ' ')
        text = text.strip()
        
        # Add natural pauses and breathing spots
        text = text.replace('. ', '... ')  # Longer pauses between sentences
        text = text.replace('! ', '! ')     # Keep exclamation pauses
        text = text.replace('? ', '? ')     # Keep question pauses
        
        # Replace common abbreviations with full words for better pronunciation
        replacements = {
            "Dr.": "Doctor",
            "Mr.": "Mister",
            "Mrs.": "Missus",
            "Ms.": "Miss",
            "etc.": "etcetera",
            "e.g.": "for example",
            "i.e.": "that is",
            "vs.": "versus",
            "&": "and",
            "%": "percent",
            "AI": "A I",
            "API": "A P I",
            "URL": "U R L",
            "FAQ": "F A Q",
        }
        
        for abbrev, full in replacements.items():
            text = text.replace(abbrev, full)
        
        # Add emphasis for empathetic words
        empathy_words = {
            "understand": "*understand*",
            "support": "*support*", 
            "care": "*care*",
            "help": "*help*",
            "listen": "*listen*",
            "feeling": "*feeling*"
        }
        
        for word, emphasized in empathy_words.items():
            text = text.replace(word, emphasized)
        
        # Limit length for optimal processing
        if len(text) > 1000:
            text = text[:1000] + "..."
        
        return text
    
    def change_voice(self, voice_name: str) -> bool:
        """Change the current voice"""
        if voice_name in self.voice_options:
            self.current_voice = voice_name
            self.voice_id = self.voice_options[voice_name]
            print(f"✅ Voice changed to {voice_name}")
            return True
        else:
            print(f"❌ Voice '{voice_name}' not found")
            return False
    
    def get_current_voice_info(self) -> dict:
        """Get information about the current voice"""
        return {
            'name': self.current_voice,
            'id': self.voice_id,
            'available_voices': list(self.voice_options.keys())
        }
    
    def speech_to_text(self, audio_data: bytes) -> Optional[str]:
        """Convert speech to text using Google Speech Recognition"""
        try:
            if not self.microphone:
                print("❌ Microphone not available")
                return None
            
            # Convert audio data to AudioData object
            audio = sr.AudioData(audio_data, sample_rate=44100, sample_width=2)
            
            # Recognize speech
            text = self.recognizer.recognize_google(audio)
            print(f"✅ Speech recognized: {text}")
            return text
            
        except sr.UnknownValueError:
            print("❌ Speech not recognized")
            return None
        except sr.RequestError as e:
            print(f"❌ Speech recognition service error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error in speech to text: {e}")
            return None
    
    def listen_from_microphone(self, timeout: int = 8) -> Optional[str]:
        """Listen to speech from microphone and convert to text"""
        try:
            if not self.microphone:
                print("❌ Microphone not available")
                return None
            
            print("🎤 Listening... (speak now)")
            
            with self.microphone as source:
                # Adjust for ambient noise
                self.recognizer.adjust_for_ambient_noise(source, duration=0.5)
                
                # Listen for audio
                audio = self.recognizer.listen(source, timeout=timeout, phrase_time_limit=10)
            
            # Recognize speech
            text = self.recognizer.recognize_google(audio)
            print(f"✅ Speech recognized: {text}")
            return text
            
        except sr.WaitTimeoutError:
            print("⏰ No speech detected within timeout")
            return None
        except sr.UnknownValueError:
            print("❌ Speech not recognized")
            return None
        except sr.RequestError as e:
            print(f"❌ Speech recognition service error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error in microphone listening: {e}")
            return None
    
    def get_available_voices(self):
        """Get list of available voices from ElevenLabs"""
        try:
            if not self.api_key:
                return []
            
            url = f"{self.base_url}/voices"
            headers = {"xi-api-key": self.api_key}
            
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                voices = response.json().get('voices', [])
                return [{'name': v['name'], 'id': v['voice_id']} for v in voices]
            else:
                print(f"❌ Failed to get voices: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"❌ Error getting voices: {e}")
            return []
    
    def test_voice_service(self) -> bool:
        """Test the voice service functionality"""
        try:
            if not self.api_key:
                print("❌ ElevenLabs API key not configured")
                return False
            
            # Test text-to-speech
            test_text = "Hello, I'm here to support you."
            audio_data = self.text_to_speech(test_text)
            
            if audio_data:
                print("✅ Voice service test successful")
                return True
            else:
                print("❌ Voice service test failed")
                return False
                
        except Exception as e:
            print(f"❌ Voice service test error: {e}")
            return False

# Create global instance
voice_service = VoiceService()