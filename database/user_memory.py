import sqlite3
import json
from datetime import datetime
import os

class UserMemory:
    def __init__(self, db_path='database/user_data.db'):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Create database tables if they don't exist"""
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create conversations table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                message TEXT,
                response TEXT,
                emotion_detected TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Create user preferences table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_preferences (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                preference_type TEXT,
                preference_value TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def get_or_create_user(self, username):
        """Get existing user or create new one"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Try to get existing user
        cursor.execute('SELECT id FROM users WHERE username = ?', (username,))
        user = cursor.fetchone()
        
        if user:
            user_id = user[0]
        else:
            # Create new user
            cursor.execute('INSERT INTO users (username) VALUES (?)', (username,))
            user_id = cursor.lastrowid
            conn.commit()
        
        conn.close()
        return user_id
    
    def save_conversation(self, user_id, message, response, emotion):
        """Save conversation to database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO conversations (user_id, message, response, emotion_detected)
            VALUES (?, ?, ?, ?)
        ''', (user_id, message, response, emotion))
        
        conn.commit()
        conn.close()
    
    def get_user_history(self, user_id, limit=10):
        """Get recent conversation history"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT message, response, emotion_detected, timestamp
            FROM conversations
            WHERE user_id = ?
            ORDER BY timestamp DESC
            LIMIT ?
        ''', (user_id, limit))
        
        history = cursor.fetchall()
        conn.close()
        return history
    
    def save_preference(self, user_id, pref_type, pref_value):
        """Save user preference"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Update if exists, insert if not
        cursor.execute('''
            INSERT OR REPLACE INTO user_preferences (user_id, preference_type, preference_value)
            VALUES (?, ?, ?)
        ''', (user_id, pref_type, pref_value))
        
        conn.commit()
        conn.close()
    
    def get_preferences(self, user_id):
        """Get all user preferences"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT preference_type, preference_value
            FROM user_preferences
            WHERE user_id = ?
        ''', (user_id,))
        
        prefs = dict(cursor.fetchall())
        conn.close()
        return prefs