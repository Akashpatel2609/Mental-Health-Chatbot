<<<<<<< HEAD
class MentalHealthBuddy {
    constructor() {
        this.chatMessages = document.getElementById('chat-messages');
        this.messageInput = document.getElementById('message-input');
        this.sendButton = document.getElementById('send-button');
        this.crisisResources = document.getElementById('crisis-resources');
        this.typingIndicator = document.getElementById('typing-indicator');
        this.apiStatus = document.getElementById('api-status');
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.mainInterface = document.getElementById('main-interface');
        this.activitiesPanel = document.getElementById('activities-panel');
        this.activityModal = document.getElementById('activity-modal');
        
        this.username = this.getStoredUsername() || 'Akashpatel2609';
        this.currentActivity = null;
        
        console.log('🚀 Mental Health Buddy initialized');
        console.log('👤 Username:', this.username);
        console.log('📅 Current Time: 2025-06-25 05:08:12 UTC');
        
        this.init();
    }
    
    init() {
        this.setupWelcomeScreen();
        this.setupMainInterface();
        this.setupActivities();
        
        // Show appropriate screen
        if (this.username && this.username !== 'user_default') {
            this.startMainInterface();
        }
        
        // Test API immediately
        this.testApiConnection();
    }
    
    setupWelcomeScreen() {
        const nameInput = document.getElementById('user-name-input');
        const startButton = document.getElementById('start-chat-button');
        const quickNameBtns = document.querySelectorAll('.quick-name-btn');
        
        // Pre-fill with Akashpatel2609
        nameInput.value = 'Akashpatel2609';
        
        // Enter key in name input
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.startChat();
            }
        });
        
        // Start button
        startButton.addEventListener('click', () => this.startChat());
        
        // Quick name buttons
        quickNameBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.dataset.name;
                nameInput.value = name;
                this.startChat();
            });
        });
    }
    
    setupMainInterface() {
        // Original chat functionality
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Activities button
        const activitiesButton = document.getElementById('activities-button');
        if (activitiesButton) {
            activitiesButton.addEventListener('click', () => this.toggleActivitiesPanel());
        }
        
        // Close activities panel
        const closeActivities = document.getElementById('close-activities');
        if (closeActivities) {
            closeActivities.addEventListener('click', () => this.closeActivitiesPanel());
        }
    }
    
    setupActivities() {
        // Activity cards
        const activityCards = document.querySelectorAll('.activity-card');
        activityCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const activity = e.currentTarget.dataset.activity;
                this.openActivity(activity);
            });
        });
        
        // Close modal
        const closeModal = document.getElementById('close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeActivityModal());
        }
        
        // Click outside modal to close
        if (this.activityModal) {
            this.activityModal.addEventListener('click', (e) => {
                if (e.target === this.activityModal) {
                    this.closeActivityModal();
                }
            });
        }
    }
    
    getStoredUsername() {
        return localStorage.getItem('mira_username');
    }
    
    startChat() {
        const nameInput = document.getElementById('user-name-input');
        let name = nameInput.value.trim();
        
        if (!name) {
            name = 'Akashpatel2609';
        }
        
        this.username = name;
        localStorage.setItem('mira_username', name);
        
        console.log('✅ Starting chat for:', name);
        this.startMainInterface();
    }
    
    startMainInterface() {
        // Hide welcome screen, show main interface
        this.welcomeScreen.style.display = 'none';
        this.mainInterface.style.display = 'flex';
        
        // Update greeting
        const greeting = document.getElementById('user-greeting');
        greeting.textContent = `Hello ${this.username}! I'm here to listen and support you.`;
        
        // Add welcome message
        this.addWelcomeMessage();
        
        // Test API and focus input
        this.testApiConnection();
        this.messageInput.focus();
        
        console.log('✅ Main interface started');
    }
    
    addWelcomeMessage() {
        const welcomeText = `Hello ${this.username}! I'm Mira, your mental health companion powered by Gemini 2.0 Flash AI. I'm here to listen, support, and chat with you about whatever is on your mind. 

I also have some therapeutic activities and games that might help you feel better. Just click the 🎮 button to explore them!

How are you feeling today?`;
        
        this.addMessage(welcomeText, 'bot');
    }
    
    async testApiConnection() {
        try {
            console.log('🧪 Testing API connection...');
            
            const statusDot = this.apiStatus.querySelector('.status-dot');
            const statusText = this.apiStatus.querySelector('.status-text');
            
            // Set to connecting status
            statusDot.className = 'status-dot';
            statusText.textContent = 'Testing Connection...';
            
            const response = await fetch('/test-api?' + new Date().getTime()); // Cache busting
            const data = await response.json();
            
            console.log('📡 API Response:', data);
            
            if (data.api_working) {
                statusDot.className = 'status-dot connected';
                statusText.textContent = data.mode + ' Ready';
                console.log('✅ API Connected:', data.mode);
            } else {
                statusDot.className = 'status-dot error';
                statusText.textContent = 'API Connection Error';
                console.log('❌ API Failed');
            }
        } catch (error) {
            console.error('❌ API Test Error:', error);
            const statusDot = this.apiStatus.querySelector('.status-dot');
            const statusText = this.apiStatus.querySelector('.status-text');
            statusDot.className = 'status-dot error';
            statusText.textContent = 'Connection Failed';
        }
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        console.log('💬 Sending message:', message);
        
        // Disable input while processing
        this.messageInput.disabled = true;
        this.sendButton.disabled = true;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    username: this.username
                })
            });
            
            const data = await response.json();
            
            console.log('🤖 Response received:', {
                emotion: data.emotion_detected,
                crisis: data.crisis_level,
                mode: data.mode
            });
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add bot response
            this.addMessage(data.response, 'bot', data.emotion_detected);
            
            // Handle crisis situation
            if (data.crisis_level === 'high' || data.crisis_level === 'medium') {
                this.showCrisisResources();
            }
            
        } catch (error) {
            console.error('❌ Chat Error:', error);
            this.hideTypingIndicator();
            this.addMessage(`I'm having trouble connecting right now, ${this.username}. Please try again, and remember that if you're in crisis, you can always call 911 or 988.`, 'bot');
        }
        
        // Re-enable input
        this.messageInput.disabled = false;
        this.sendButton.disabled = false;
        this.messageInput.focus();
    }
    
    addMessage(content, sender, emotion = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        // Create avatar
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        
        if (sender === 'user') {
            avatarDiv.textContent = '👤';
        } else {
            // Different emojis based on detected emotion
            const emotionEmojis = {
                'sadness': '💙',
                'anxiety': '🤗',
                'anger': '😌',
                'happiness': '😊',
                'fear': '🫂',
                'loneliness': '💜',
                'hopelessness': '🌟',
                'neutral': '🤖'
            };
            avatarDiv.textContent = emotionEmojis[emotion] || '🤖';
        }
        
        // Create content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = this.formatMessage(content);
        
        // Create time
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = this.formatTime(new Date());
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    formatMessage(message) {
        // Convert line breaks to <br> tags and make URLs clickable
        return message
            .replace(/\n/g, '<br>')
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    }
    
    formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }
    
    toggleActivitiesPanel() {
        const isVisible = this.activitiesPanel.style.display !== 'none';
        this.activitiesPanel.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            this.activitiesPanel.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    closeActivitiesPanel() {
        this.activitiesPanel.style.display = 'none';
    }
    
    openActivity(activityType) {
        console.log('🎮 Opening activity:', activityType);
        // Activity functionality would go here
        this.addMessage(`I'd like to try the ${activityType.replace('-', ' ')} activity!`, 'user');
        setTimeout(() => {
            this.addMessage(`Great choice! The ${activityType.replace('-', ' ')} activity is a wonderful way to support your mental wellness. Let me guide you through it.`, 'bot');
        }, 1000);
        this.closeActivitiesPanel();
    }
    
    closeActivityModal() {
        if (this.activityModal) {
            this.activityModal.style.display = 'none';
        }
        this.currentActivity = null;
    }
    
    showCrisisResources() {
        this.crisisResources.style.display = 'block';
        setTimeout(() => {
            this.crisisResources.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 Mental Health Buddy Loading...');
    console.log('📅 Current Time: 2025-06-25 05:08:12 UTC');
    console.log('👤 User: Akashpatel2609');
    new MentalHealthBuddy();
=======
class MentalHealthBuddy {
    constructor() {
        this.chatMessages = document.getElementById('chat-messages');
        this.messageInput = document.getElementById('message-input');
        this.sendButton = document.getElementById('send-button');
        this.crisisResources = document.getElementById('crisis-resources');
        this.typingIndicator = document.getElementById('typing-indicator');
        this.apiStatus = document.getElementById('api-status');
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.mainInterface = document.getElementById('main-interface');
        this.activitiesPanel = document.getElementById('activities-panel');
        this.activityModal = document.getElementById('activity-modal');
        
        this.username = this.getStoredUsername() || 'Akashpatel2609';
        this.currentActivity = null;
        
        console.log('🚀 Mental Health Buddy initialized');
        console.log('👤 Username:', this.username);
        console.log('📅 Current Time: 2025-06-25 05:08:12 UTC');
        
        this.init();
    }
    
    init() {
        this.setupWelcomeScreen();
        this.setupMainInterface();
        this.setupActivities();
        
        // Show appropriate screen
        if (this.username && this.username !== 'user_default') {
            this.startMainInterface();
        }
        
        // Test API immediately
        this.testApiConnection();
    }
    
    setupWelcomeScreen() {
        const nameInput = document.getElementById('user-name-input');
        const startButton = document.getElementById('start-chat-button');
        const quickNameBtns = document.querySelectorAll('.quick-name-btn');
        
        // Pre-fill with Akashpatel2609
        nameInput.value = 'Akashpatel2609';
        
        // Enter key in name input
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.startChat();
            }
        });
        
        // Start button
        startButton.addEventListener('click', () => this.startChat());
        
        // Quick name buttons
        quickNameBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.dataset.name;
                nameInput.value = name;
                this.startChat();
            });
        });
    }
    
    setupMainInterface() {
        // Original chat functionality
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Activities button
        const activitiesButton = document.getElementById('activities-button');
        if (activitiesButton) {
            activitiesButton.addEventListener('click', () => this.toggleActivitiesPanel());
        }
        
        // Close activities panel
        const closeActivities = document.getElementById('close-activities');
        if (closeActivities) {
            closeActivities.addEventListener('click', () => this.closeActivitiesPanel());
        }
    }
    
    setupActivities() {
        // Activity cards
        const activityCards = document.querySelectorAll('.activity-card');
        activityCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const activity = e.currentTarget.dataset.activity;
                this.openActivity(activity);
            });
        });
        
        // Close modal
        const closeModal = document.getElementById('close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeActivityModal());
        }
        
        // Click outside modal to close
        if (this.activityModal) {
            this.activityModal.addEventListener('click', (e) => {
                if (e.target === this.activityModal) {
                    this.closeActivityModal();
                }
            });
        }
    }
    
    getStoredUsername() {
        return localStorage.getItem('mira_username');
    }
    
    startChat() {
        const nameInput = document.getElementById('user-name-input');
        let name = nameInput.value.trim();
        
        if (!name) {
            name = 'Akashpatel2609';
        }
        
        this.username = name;
        localStorage.setItem('mira_username', name);
        
        console.log('✅ Starting chat for:', name);
        this.startMainInterface();
    }
    
    startMainInterface() {
        // Hide welcome screen, show main interface
        this.welcomeScreen.style.display = 'none';
        this.mainInterface.style.display = 'flex';
        
        // Update greeting
        const greeting = document.getElementById('user-greeting');
        greeting.textContent = `Hello ${this.username}! I'm here to listen and support you.`;
        
        // Add welcome message
        this.addWelcomeMessage();
        
        // Test API and focus input
        this.testApiConnection();
        this.messageInput.focus();
        
        console.log('✅ Main interface started');
    }
    
    addWelcomeMessage() {
        const welcomeText = `Hello ${this.username}! I'm Mira, your mental health companion powered by Gemini 2.0 Flash AI. I'm here to listen, support, and chat with you about whatever is on your mind. 

I also have some therapeutic activities and games that might help you feel better. Just click the 🎮 button to explore them!

How are you feeling today?`;
        
        this.addMessage(welcomeText, 'bot');
    }
    
    async testApiConnection() {
        try {
            console.log('🧪 Testing API connection...');
            
            const statusDot = this.apiStatus.querySelector('.status-dot');
            const statusText = this.apiStatus.querySelector('.status-text');
            
            // Set to connecting status
            statusDot.className = 'status-dot';
            statusText.textContent = 'Testing Connection...';
            
            const response = await fetch('/test-api?' + new Date().getTime()); // Cache busting
            const data = await response.json();
            
            console.log('📡 API Response:', data);
            
            if (data.api_working) {
                statusDot.className = 'status-dot connected';
                statusText.textContent = data.mode + ' Ready';
                console.log('✅ API Connected:', data.mode);
            } else {
                statusDot.className = 'status-dot error';
                statusText.textContent = 'API Connection Error';
                console.log('❌ API Failed');
            }
        } catch (error) {
            console.error('❌ API Test Error:', error);
            const statusDot = this.apiStatus.querySelector('.status-dot');
            const statusText = this.apiStatus.querySelector('.status-text');
            statusDot.className = 'status-dot error';
            statusText.textContent = 'Connection Failed';
        }
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        console.log('💬 Sending message:', message);
        
        // Disable input while processing
        this.messageInput.disabled = true;
        this.sendButton.disabled = true;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    username: this.username
                })
            });
            
            const data = await response.json();
            
            console.log('🤖 Response received:', {
                emotion: data.emotion_detected,
                crisis: data.crisis_level,
                mode: data.mode
            });
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add bot response
            this.addMessage(data.response, 'bot', data.emotion_detected);
            
            // Handle crisis situation
            if (data.crisis_level === 'high' || data.crisis_level === 'medium') {
                this.showCrisisResources();
            }
            
        } catch (error) {
            console.error('❌ Chat Error:', error);
            this.hideTypingIndicator();
            this.addMessage(`I'm having trouble connecting right now, ${this.username}. Please try again, and remember that if you're in crisis, you can always call 911 or 988.`, 'bot');
        }
        
        // Re-enable input
        this.messageInput.disabled = false;
        this.sendButton.disabled = false;
        this.messageInput.focus();
    }
    
    addMessage(content, sender, emotion = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        // Create avatar
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        
        if (sender === 'user') {
            avatarDiv.textContent = '👤';
        } else {
            // Different emojis based on detected emotion
            const emotionEmojis = {
                'sadness': '💙',
                'anxiety': '🤗',
                'anger': '😌',
                'happiness': '😊',
                'fear': '🫂',
                'loneliness': '💜',
                'hopelessness': '🌟',
                'neutral': '🤖'
            };
            avatarDiv.textContent = emotionEmojis[emotion] || '🤖';
        }
        
        // Create content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = this.formatMessage(content);
        
        // Create time
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = this.formatTime(new Date());
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    formatMessage(message) {
        // Convert line breaks to <br> tags and make URLs clickable
        return message
            .replace(/\n/g, '<br>')
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    }
    
    formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }
    
    toggleActivitiesPanel() {
        const isVisible = this.activitiesPanel.style.display !== 'none';
        this.activitiesPanel.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            this.activitiesPanel.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    closeActivitiesPanel() {
        this.activitiesPanel.style.display = 'none';
    }
    
    openActivity(activityType) {
        console.log('🎮 Opening activity:', activityType);
        // Activity functionality would go here
        this.addMessage(`I'd like to try the ${activityType.replace('-', ' ')} activity!`, 'user');
        setTimeout(() => {
            this.addMessage(`Great choice! The ${activityType.replace('-', ' ')} activity is a wonderful way to support your mental wellness. Let me guide you through it.`, 'bot');
        }, 1000);
        this.closeActivitiesPanel();
    }
    
    closeActivityModal() {
        if (this.activityModal) {
            this.activityModal.style.display = 'none';
        }
        this.currentActivity = null;
    }
    
    showCrisisResources() {
        this.crisisResources.style.display = 'block';
        setTimeout(() => {
            this.crisisResources.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 Mental Health Buddy Loading...');
    console.log('📅 Current Time: 2025-06-25 05:08:12 UTC');
    console.log('👤 User: Akashpatel2609');
    new MentalHealthBuddy();
>>>>>>> d4f2d3ec5db6c1dba27c65526dc2726e8002dd96
});