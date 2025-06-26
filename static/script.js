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
        
        this.username = this.getStoredUsername() || 'User';
        this.currentActivity = null;
        
        console.log('🚀 Mental Health Buddy initialized');
        console.log('👤 Username:', this.username);
        
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
            name = 'User';
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
        if (greeting) {
        greeting.textContent = `Hello ${this.username}! I'm here to listen and support you.`;
        }
        
        // Add welcome message
        this.addWelcomeMessage();
        
        // Test API and focus input
        this.testApiConnection();
        this.messageInput.focus();
        
        console.log('✅ Main interface started');
    }
    
    addWelcomeMessage() {
        const welcomeText = `Hello ${this.username}! I'm Mira, your mental health companion. I'm here to listen, support, and chat with you about whatever is on your mind. 

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
        
        // Add user message
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
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            if (data.success) {
                this.addMessage(data.response, 'bot', data.emotion);
            
                // Check for crisis keywords
                if (this.detectCrisisKeywords(message)) {
                this.showCrisisResources();
                }
            } else {
                this.addMessage('I apologize, but I\'m having trouble processing your message right now. Please try again in a moment.', 'bot');
            }
        } catch (error) {
            console.error('❌ Error sending message:', error);
            this.hideTypingIndicator();
            this.addMessage('I\'m sorry, but I\'m experiencing some technical difficulties. Please try again later.', 'bot');
        }
    }
    
    addMessage(content, sender, emotion = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? '👤' : '🤖';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = this.formatMessage(content);
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = this.formatTime(new Date());
        
        messageContent.appendChild(timeDiv);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    formatMessage(message) {
        return message.replace(/\n/g, '<br>');
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
        this.activitiesPanel.style.display = this.activitiesPanel.style.display === 'none' ? 'block' : 'none';
    }
    
    closeActivitiesPanel() {
        this.activitiesPanel.style.display = 'none';
    }
    
    openActivity(activityType) {
        this.currentActivity = activityType;
        this.activityModal.style.display = 'block';
        this.loadActivity(activityType);
    }
    
    closeActivityModal() {
            this.activityModal.style.display = 'none';
        this.currentActivity = null;
    }
    
    showCrisisResources() {
        if (this.crisisResources) {
        this.crisisResources.style.display = 'block';
        }
    }
    
    scrollToBottom() {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    detectCrisisKeywords(message) {
        const crisisKeywords = [
            'kill myself', 'suicide', 'want to die', 'end it all', 'no reason to live',
            'better off dead', 'hurt myself', 'self harm', 'cutting myself'
        ];
        
        const lowerMessage = message.toLowerCase();
        return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
    }
    
    loadActivity(activityType) {
        const modalBody = document.querySelector('.modal-body');
        
        switch (activityType) {
            case 'breathing':
                modalBody.innerHTML = this.getBreathingExercise();
                this.initBreathingExercise();
                break;
            case 'puzzle':
                modalBody.innerHTML = this.getWordPuzzle();
                this.initWordPuzzle();
                break;
            case 'memory':
                modalBody.innerHTML = this.getMemoryGame();
                this.initMemoryGame();
                break;
            default:
                modalBody.innerHTML = '<p>Activity not found.</p>';
        }
    }
    
    getBreathingExercise() {
        return `
            <div class="breathing-exercise">
                <div class="breathing-circle" id="breathing-circle">
                    <span>Breathe</span>
                </div>
                <div class="breathing-text" id="breathing-text">Get ready to breathe...</div>
                <div class="breathing-controls">
                    <button class="btn" onclick="mentalHealthBuddy.startBreathing()">Start</button>
                    <button class="btn" onclick="mentalHealthBuddy.stopBreathing()">Stop</button>
                </div>
            </div>
        `;
    }
    
    getWordPuzzle() {
        const words = ['CALM', 'PEACE', 'HOPE', 'JOY', 'LOVE', 'SMILE'];
        const randomWord = words[Math.floor(Math.random() * words.length)];
        
        return `
            <div class="word-puzzle">
                <h3>Word Puzzle</h3>
                <p>Unscramble this positive word:</p>
                <div class="puzzle-word">${this.shuffleWord(randomWord)}</div>
                <input type="text" class="puzzle-input" id="puzzle-input" placeholder="Enter your answer">
                <button class="btn" onclick="mentalHealthBuddy.checkPuzzleAnswer('${randomWord}')">Check Answer</button>
            </div>
        `;
    }
    
    getMemoryGame() {
        const symbols = ['🌟', '💖', '🌈', '🎵', '🌸', '✨', '💫', '🎈'];
        const gameSymbols = [...symbols, ...symbols]; // Duplicate for pairs
        
        return `
            <div class="memory-game">
                <h3>Memory Game</h3>
                <p>Find matching pairs of positive symbols!</p>
                <div class="memory-grid" id="memory-grid">
                    ${this.shuffleArray(gameSymbols).map((symbol, index) => 
                        `<div class="memory-card" data-index="${index}" data-symbol="${symbol}">?</div>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    shuffleWord(word) {
        return word.split('').sort(() => Math.random() - 0.5).join('');
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    initBreathingExercise() {
        this.breathingInterval = null;
        this.breathingPhase = 'inhale';
    }
    
    startBreathing() {
        const circle = document.getElementById('breathing-circle');
        const text = document.getElementById('breathing-text');
        
        this.breathingInterval = setInterval(() => {
            if (this.breathingPhase === 'inhale') {
                circle.classList.add('inhale');
                text.textContent = 'Inhale...';
                this.breathingPhase = 'exhale';
            } else {
                circle.classList.remove('inhale');
                text.textContent = 'Exhale...';
                this.breathingPhase = 'inhale';
            }
        }, 4000);
    }
    
    stopBreathing() {
        if (this.breathingInterval) {
            clearInterval(this.breathingInterval);
            this.breathingInterval = null;
        }
        
        const circle = document.getElementById('breathing-circle');
        const text = document.getElementById('breathing-text');
        
        circle.classList.remove('inhale');
        text.textContent = 'Get ready to breathe...';
        this.breathingPhase = 'inhale';
    }
    
    checkPuzzleAnswer(correctAnswer) {
        const input = document.getElementById('puzzle-input');
        const userAnswer = input.value.trim().toUpperCase();
        
        if (userAnswer === correctAnswer) {
            alert('Correct! Great job! 🎉');
            this.closeActivityModal();
        } else {
            alert('Try again! Think positive! 💪');
        }
    }
    
    initMemoryGame() {
        const cards = document.querySelectorAll('.memory-card');
        let flippedCards = [];
        let matchedPairs = 0;
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                if (flippedCards.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
                    card.classList.add('flipped');
                    card.textContent = card.dataset.symbol;
                    flippedCards.push(card);
                    
                    if (flippedCards.length === 2) {
                        setTimeout(() => {
                            if (flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol) {
                                flippedCards.forEach(c => c.classList.add('matched'));
                                matchedPairs++;
                                
                                if (matchedPairs === 8) {
                                    alert('Congratulations! You found all the pairs! 🎉');
                                    this.closeActivityModal();
                                }
                            } else {
                                flippedCards.forEach(c => {
                                    c.classList.remove('flipped');
                                    c.textContent = '?';
                                });
                            }
                            flippedCards = [];
                        }, 1000);
                    }
                }
            });
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mentalHealthBuddy = new MentalHealthBuddy();
});