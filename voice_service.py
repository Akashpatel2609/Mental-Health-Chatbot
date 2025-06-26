<<<<<<< HEAD
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
            print("✅ Microphone initialized for Akashpatel2609")
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
            
            print(f"🎤 Generating human-like speech for Akashpatel2609: {clean_text[:50]}...")
            print(f"📅 Current Time: 2025-06-25 15:28:36")
            
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
            "feeling": "*feeling*",
            "Akashpatel2609": "*Akashpatel2609*"  # Emphasize user's name
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
            print(f"✅ Voice changed to {voice_name} for Akashpatel2609")
            return True
        else:
            print(f"❌ Voice {voice_name} not available")
            return False
    
    def get_current_voice_info(self) -> dict:
        """Get current voice information"""
        voice_descriptions = {
            'rachel': "Rachel - Calm and empathetic female voice, perfect for therapy",
            'bella': "Bella - Gentle and caring female voice, very natural sounding",
            'domi': "Domi - Warm and supportive female voice, comforting tone",
            'elli': "Elli - Soft and kind female voice, soothing for anxiety",
            'josh': "Josh - Calm and reassuring male voice, professional yet warm",
            'adam': "Adam - Deep and comforting male voice, stable and trustworthy"
        }
        
        return {
            'name': self.current_voice,
            'voice_id': self.voice_id,
            'description': voice_descriptions.get(self.current_voice, "Unknown voice")
        }
    
    def speech_to_text(self, audio_data: bytes) -> Optional[str]:
        """Convert speech to text using SpeechRecognition"""
        try:
            audio_file = io.BytesIO(audio_data)
            with sr.AudioFile(audio_file) as source:
                audio = self.recognizer.record(source)
            
            text = self.recognizer.recognize_google(audio)
            print(f"🎙️ Speech recognized from Akashpatel2609: {text}")
            print(f"📅 Current Time: 2025-06-25 15:28:36")
            return text
            
        except sr.UnknownValueError:
            print("❌ Could not understand audio from Akashpatel2609")
            return None
        except sr.RequestError as e:
            print(f"❌ Speech recognition error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error in speech recognition: {e}")
            return None
    
    def listen_from_microphone(self, timeout: int = 8) -> Optional[str]:
        """Listen from microphone and convert to text"""
        try:
            if not self.microphone:
                print("❌ Microphone not available")
                return None
            
            print(f"🎙️ Listening from microphone for Akashpatel2609... (timeout: {timeout}s)")
            print(f"📅 Current Time: 2025-06-25 15:28:36")
            
            with self.microphone as source:
                print("🔧 Adjusting for ambient noise...")
                self.recognizer.adjust_for_ambient_noise(source, duration=1)
                print("🔊 Please speak now, Akashpatel2609...")
                
                audio = self.recognizer.listen(source, timeout=timeout, phrase_time_limit=15)
            
            print("🔄 Processing speech...")
            
            text = self.recognizer.recognize_google(audio)
            print(f"✅ Akashpatel2609 said: {text}")
            return text
            
        except sr.WaitTimeoutError:
            print("⏰ Listening timeout - no speech detected from Akashpatel2609")
            return None
        except sr.UnknownValueError:
            print("❌ Could not understand the audio from Akashpatel2609")
            return None
        except sr.RequestError as e:
            print(f"❌ Speech recognition service error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error listening from microphone: {e}")
            return None
    
    def get_available_voices(self):
        """Get available voice options"""
        voice_list = []
        voice_descriptions = {
            'rachel': "Calm and empathetic female voice, perfect for therapy sessions",
            'bella': "Gentle and caring female voice, very natural and human-like",
            'domi': "Warm and supportive female voice, comforting for difficult times",
            'elli': "Soft and kind female voice, excellent for anxiety relief",
            'josh': "Calm and reassuring male voice, professional yet approachable",
            'adam': "Deep and comforting male voice, stable and trustworthy"
        }
        
        for name, voice_id in self.voice_options.items():
            voice_list.append({
                'name': name,
                'voice_id': voice_id,
                'description': voice_descriptions.get(name, "High-quality voice"),
                'current': name == self.current_voice
            })
        
        return voice_list
    
    def test_voice_service(self) -> bool:
        """Test if voice service is working with human-like voice"""
        try:
            print("🧪 Testing human-like voice service for Akashpatel2609...")
            print(f"📅 Current Time: 2025-06-25 15:28:36")
            
            test_text = "Hello Akashpatel2609! This is Mira, your mental health companion. I'm testing my new, more natural voice to make sure our conversations feel warm and human-like. How does this sound to you?"
            test_audio = self.text_to_speech(test_text, voice_style='empathetic')
            
            if test_audio and len(test_audio) > 1000:
                print("✅ Human-like voice test successful")
                return True
            else:
                print("❌ Voice test failed - no audio or audio too small")
                return False
                
        except Exception as e:
            print(f"❌ Voice service test failed: {e}")
            return False

# Test the service if run directly
if __name__ == "__main__":
    print("🧪 Testing Enhanced Voice Service...")
    print(f"📅 Current Time: 2025-06-25 15:28:36")
    print(f"👤 User: Akashpatel2609")
    
    voice = VoiceService()
    
    # Test current voice
    current_voice = voice.get_current_voice_info()
    print(f"🎤 Current voice: {current_voice['description']}")
    
    # Test TTS
    if voice.test_voice_service():
        print("🎉 Enhanced voice service is working for Akashpatel2609!")
    else:
        print("❌ Voice service failed!")
    
    # Show available voices
    voices = voice.get_available_voices()
    print(f"📝 Available voices: {len(voices)}")
    for v in voices:
        status = " (CURRENT)" if v['current'] else ""
=======
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
            print("✅ Microphone initialized for Akashpatel2609")
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
            
            print(f"🎤 Generating human-like speech for Akashpatel2609: {clean_text[:50]}...")
            print(f"📅 Current Time: 2025-06-25 15:28:36")
            
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
            "feeling": "*feeling*",
            "Akashpatel2609": "*Akashpatel2609*"  # Emphasize user's name
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
            print(f"✅ Voice changed to {voice_name} for Akashpatel2609")
            return True
        else:
            print(f"❌ Voice {voice_name} not available")
            return False
    
    def get_current_voice_info(self) -> dict:
        """Get current voice information"""
        voice_descriptions = {
            'rachel': "Rachel - Calm and empathetic female voice, perfect for therapy",
            'bella': "Bella - Gentle and caring female voice, very natural sounding",
            'domi': "Domi - Warm and supportive female voice, comforting tone",
            'elli': "Elli - Soft and kind female voice, soothing for anxiety",
            'josh': "Josh - Calm and reassuring male voice, professional yet warm",
            'adam': "Adam - Deep and comforting male voice, stable and trustworthy"
        }
        
        return {
            'name': self.current_voice,
            'voice_id': self.voice_id,
            'description': voice_descriptions.get(self.current_voice, "Unknown voice")
        }
    
    def speech_to_text(self, audio_data: bytes) -> Optional[str]:
        """Convert speech to text using SpeechRecognition"""
        try:
            audio_file = io.BytesIO(audio_data)
            with sr.AudioFile(audio_file) as source:
                audio = self.recognizer.record(source)
            
            text = self.recognizer.recognize_google(audio)
            print(f"🎙️ Speech recognized from Akashpatel2609: {text}")
            print(f"📅 Current Time: 2025-06-25 15:28:36")
            return text
            
        except sr.UnknownValueError:
            print("❌ Could not understand audio from Akashpatel2609")
            return None
        except sr.RequestError as e:
            print(f"❌ Speech recognition error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error in speech recognition: {e}")
            return None
    
    def listen_from_microphone(self, timeout: int = 8) -> Optional[str]:
        """Listen from microphone and convert to text"""
        try:
            if not self.microphone:
                print("❌ Microphone not available")
                return None
            
            print(f"🎙️ Listening from microphone for Akashpatel2609... (timeout: {timeout}s)")
            print(f"📅 Current Time: 2025-06-25 15:28:36")
            
            with self.microphone as source:
                print("🔧 Adjusting for ambient noise...")
                self.recognizer.adjust_for_ambient_noise(source, duration=1)
                print("🔊 Please speak now, Akashpatel2609...")
                
                audio = self.recognizer.listen(source, timeout=timeout, phrase_time_limit=15)
            
            print("🔄 Processing speech...")
            
            text = self.recognizer.recognize_google(audio)
            print(f"✅ Akashpatel2609 said: {text}")
            return text
            
        except sr.WaitTimeoutError:
            print("⏰ Listening timeout - no speech detected from Akashpatel2609")
            return None
        except sr.UnknownValueError:
            print("❌ Could not understand the audio from Akashpatel2609")
            return None
        except sr.RequestError as e:
            print(f"❌ Speech recognition service error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error listening from microphone: {e}")
            return None
    
    def get_available_voices(self):
        """Get available voice options"""
        voice_list = []
        voice_descriptions = {
            'rachel': "Calm and empathetic female voice, perfect for therapy sessions",
            'bella': "Gentle and caring female voice, very natural and human-like",
            'domi': "Warm and supportive female voice, comforting for difficult times",
            'elli': "Soft and kind female voice, excellent for anxiety relief",
            'josh': "Calm and reassuring male voice, professional yet approachable",
            'adam': "Deep and comforting male voice, stable and trustworthy"
        }
        
        for name, voice_id in self.voice_options.items():
            voice_list.append({
                'name': name,
                'voice_id': voice_id,
                'description': voice_descriptions.get(name, "High-quality voice"),
                'current': name == self.current_voice
            })
        
        return voice_list
    
    def test_voice_service(self) -> bool:
        """Test if voice service is working with human-like voice"""
        try:
            print("🧪 Testing human-like voice service for Akashpatel2609...")
            print(f"📅 Current Time: 2025-06-25 15:28:36")
            
            test_text = "Hello Akashpatel2609! This is Mira, your mental health companion. I'm testing my new, more natural voice to make sure our conversations feel warm and human-like. How does this sound to you?"
            test_audio = self.text_to_speech(test_text, voice_style='empathetic')
            
            if test_audio and len(test_audio) > 1000:
                print("✅ Human-like voice test successful")
                return True
            else:
                print("❌ Voice test failed - no audio or audio too small")
                return False
                
        except Exception as e:
            print(f"❌ Voice service test failed: {e}")
            return False

# Test the service if run directly
if __name__ == "__main__":
    print("🧪 Testing Enhanced Voice Service...")
    print(f"📅 Current Time: 2025-06-25 15:28:36")
    print(f"👤 User: Akashpatel2609")
    
    voice = VoiceService()
    
    # Test current voice
    current_voice = voice.get_current_voice_info()
    print(f"🎤 Current voice: {current_voice['description']}")
    
    # Test TTS
    if voice.test_voice_service():
        print("🎉 Enhanced voice service is working for Akashpatel2609!")
    else:
        print("❌ Voice service failed!")
    
    # Show available voices
    voices = voice.get_available_voices()
    print(f"📝 Available voices: {len(voices)}")
    for v in voices:
        status = " (CURRENT)" if v['current'] else ""
>>>>>>> d4f2d3ec5db6c1dba27c65526dc2726e8002dd96
        print(f"  - {v['name'].title()}: {v['description']}{status}")