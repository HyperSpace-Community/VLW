// Notion AI Integration for Notex
// Uses Perplexity API (https://api.perplexity.ai/chat/completions)

class NotionAI {
    constructor() {
        this.API_KEY = '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'; // From spacey.html
        this.API_URL = 'https://api.perplexity.ai/chat/completions';
        this.selectedText = '';
        this.selectionRange = null;
        this.currentResponse = '';
        this.isProcessing = false;

        this.init();
    }

    init() {
        this.injectUI();
        this.attachEventListeners();
        console.log('Notion AI initialized');
    }

    // ============================================
    // UI Injection
    // ============================================
    injectUI() {
        const uiHTML = `
            <!-- AI Selection Toolbar -->
            <div class="ai-selection-toolbar" id="aiSelectionToolbar">
                <svg class="ai-selection-toolbar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <span class="ai-selection-toolbar-text">Ask AI</span>
            </div>

            <!-- AI Command Menu -->
            <div class="ai-command-menu" id="aiCommandMenu">
                <div class="ai-command-menu-header">
                    <svg class="ai-command-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                    <span class="ai-command-menu-title">Ask AI to...</span>
                </div>
                <div class="ai-command-list" id="aiCommandList">
                    ${this.getCommandItems()}
                </div>
                <div class="ai-command-custom-input">
                    <input type="text" id="aiCustomPrompt" placeholder="Type your own instruction..." />
                </div>
            </div>

            <!-- AI Slash Menu -->
            <div class="ai-slash-menu" id="aiSlashMenu">
                <div class="ai-slash-menu-item" data-command="ai">
                    <span class="ai-slash-menu-item-icon">🤖</span>
                    <span class="ai-slash-menu-item-text">Ask AI</span>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', uiHTML);
    }

    getCommandItems() {
        const commands = [
            { icon: '📝', title: 'Improve writing', description: 'Enhance clarity and flow', action: 'improve' },
            { icon: '✏️', title: 'Fix spelling & grammar', description: 'Correct errors', action: 'grammar' },
            { icon: '🔄', title: 'Make longer', description: 'Expand with more details', action: 'longer' },
            { icon: '📉', title: 'Make shorter', description: 'Condense to key points', action: 'shorter' },
            { icon: '🎯', title: 'Change tone', description: 'Professional, casual, etc', action: 'tone' },
            { icon: '🌍', title: 'Translate', description: 'Convert to another language', action: 'translate' },
            { icon: '✨', title: 'Continue writing', description: 'Keep the flow going', action: 'continue' },
            { icon: '📊', title: 'Summarize', description: 'Create a brief summary', action: 'summarize' },
            { icon: '🔍', title: 'Find action items', description: 'Extract tasks and todos', action: 'actionitems' },
            { icon: '💡', title: 'Brainstorm ideas', description: 'Generate creative concepts', action: 'brainstorm' },
            { icon: '✍️', title: 'Help me write', description: 'Generate content from scratch', action: 'write' }
        ];

        return commands.map(cmd => `
            <div class="ai-command-item" data-action="${cmd.action}">
                <span class="ai-command-item-icon">${cmd.icon}</span>
                <div class="ai-command-item-content">
                    <div class="ai-command-item-title">${cmd.title}</div>
                    <div class="ai-command-item-description">${cmd.description}</div>
                </div>
            </div>
        `).join('');
    }

    // ============================================
    // Event Listeners
    // ============================================
    attachEventListeners() {
        // Text selection
        document.addEventListener('mouseup', (e) => this.handleTextSelection(e));
        document.addEventListener('keyup', (e) => this.handleTextSelection(e));

        // Selection toolbar click
        document.getElementById('aiSelectionToolbar').addEventListener('click', () => {
            this.showCommandMenu();
        });

        // Command menu items
        document.getElementById('aiCommandList').addEventListener('click', (e) => {
            const item = e.target.closest('.ai-command-item');
            if (item) {
                const action = item.dataset.action;
                this.executeCommand(action);
            }
        });

        // Custom prompt
        document.getElementById('aiCustomPrompt').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.executeCustomPrompt(e.target.value);
            }
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.ai-selection-toolbar') &&
                !e.target.closest('.ai-command-menu')) {
                this.hideCommandMenu();
            }
        });

        // Editor shortcuts
        const editor = document.querySelector('[contenteditable="true"]');
        if (editor) {
            editor.addEventListener('keydown', (e) => this.handleShortcuts(e));
        }
    }

    // ============================================
    // Text Selection Handler
    // ============================================
    handleTextSelection(e) {
        const selection = window.getSelection();
        const text = selection.toString().trim();

        if (text.length > 0) {
            this.selectedText = text;
            this.selectionRange = selection.getRangeAt(0);
            this.showSelectionToolbar(selection);
        } else {
            this.hideSelectionToolbar();
        }
    }

    showSelectionToolbar(selection) {
        const toolbar = document.getElementById('aiSelectionToolbar');
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        toolbar.style.left = `${rect.left + (rect.width / 2) - (toolbar.offsetWidth / 2)}px`;
        toolbar.style.top = `${rect.top + window.scrollY - toolbar.offsetHeight - 8}px`;
        toolbar.classList.add('active');
    }

    hideSelectionToolbar() {
        document.getElementById('aiSelectionToolbar').classList.remove('active');
    }

    // ============================================
    // Command Menu
    // ============================================
    showCommandMenu() {
        const menu = document.getElementById('aiCommandMenu');
        const toolbar = document.getElementById('aiSelectionToolbar');
        const rect = toolbar.getBoundingClientRect();

        menu.style.left = `${rect.left}px`;
        menu.style.top = `${rect.bottom + 8}px`;
        menu.classList.add('active');
    }

    hideCommandMenu() {
        document.getElementById('aiCommandMenu').classList.remove('active');
    }

    // ============================================
    // Command Execution
    // ============================================
    async executeCommand(action) {
        this.hideCommandMenu();

        const prompts = {
            'improve': `Improve the following text for better clarity and flow:\n\n${this.selectedText}`,
            'grammar': `Fix all spelling and grammar errors in this text:\n\n${this.selectedText}`,
            'longer': `Expand the following text with more details and examples:\n\n${this.selectedText}`,
            'shorter': `Make this text more concise while keeping key points:\n\n${this.selectedText}`,
            'tone': `Rewrite this text in a professional tone:\n\n${this.selectedText}`,
            'translate': `Translate this text to Spanish:\n\n${this.selectedText}`,
            'continue': `Continue writing from where this text left off:\n\n${this.selectedText}`,
            'summarize': `Summarize the following text:\n\n${this.selectedText}`,
            'actionitems': `Extract all action items and tasks from this text:\n\n${this.selectedText}`,
            'brainstorm': `Based on this topic, brainstorm 5 creative ideas:\n\n${this.selectedText}`,
            'write': `Write content about: ${this.selectedText}`
        };

        const prompt = prompts[action];
        if (prompt) {
            await this.processAIRequest(prompt, action);
        }
    }

    async executeCustomPrompt(instruction) {
        if (!instruction.trim()) return;

        const prompt = `${instruction}\n\nText: ${this.selectedText}`;
        await this.processAIRequest(prompt, 'custom');
    }

    // ============================================
    // AI Processing
    // ============================================
    async processAIRequest(prompt, action) {
        if (this.isProcessing) return;
        this.isProcessing = true;

        // Show response box with loading
        this.showResponseBox(action, true);

        try {
            const response = await this.callAPI(prompt);
            this.currentResponse = response;
            this.showResponseBox(action, false, response);
        } catch (error) {
            console.error('AI Error:', error);
            this.showResponseBox(action, false, 'Sorry, there was an error processing your request. Please try again.');
        }

        this.isProcessing = false;
    }

    async callAPI(prompt) {
        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.1-sonar-small-128k-online',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful writing assistant. Provide clear, concise responses.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }

    // ============================================
    // Response Display
    // ============================================
    showResponseBox(action, loading = false, content = '') {
        // Remove existing response box
        const existing = document.querySelector('.ai-response-box');
        if (existing) existing.remove();

        // Create new response box
        const responseBox = document.createElement('div');
        responseBox.className = 'ai-response-box';

        if (loading) {
            responseBox.innerHTML = `
                <div class="ai-response-loading">
                    <div class="ai-response-loading-spinner"></div>
                    <span>AI is thinking...</span>
                </div>
            `;
        } else {
            responseBox.innerHTML = `
                <div class="ai-response-header">
                    <svg class="ai-response-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    <span class="ai-response-label">AI Response</span>
                </div>
                <div class="ai-response-content">${this.formatResponse(content)}</div>
                <div class="ai-action-buttons">
                    <button class="ai-action-btn primary" onclick="notionAI.replaceText()">
                        <svg class="ai-action-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        Replace
                    </button>
                    <button class="ai-action-btn" onclick="notionAI.insertBelow()">
                        <svg class="ai-action-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m0 0l-4-4m4 4l4-4"/>
                        </svg>
                        Insert below
                    </button>
                    <button class="ai-action-btn" onclick="notionAI.tryAgain()">
                        <svg class="ai-action-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                        Try again
                    </button>
                    <button class="ai-action-btn danger" onclick="notionAI.discardResponse()">
                        <svg class="ai-action-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                        Discard
                    </button>
                </div>
            `;
        }

        // Insert after selection
        if (this.selectionRange) {
            const container = this.selectionRange.commonAncestorContainer;
            const element = container.nodeType === 3 ? container.parentElement : container;
            element.parentNode.insertBefore(responseBox, element.nextSibling);
        }
    }

    formatResponse(text) {
        // Basic markdown-like formatting
        return text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    // ============================================
    // Response Actions
    // ============================================
    replaceText() {
        if (this.selectionRange && this.currentResponse) {
            this.selectionRange.deleteContents();
            const textNode = document.createTextNode(this.currentResponse);
            this.selectionRange.insertNode(textNode);
            this.discardResponse();
        }
    }

    insertBelow() {
        if (this.selectionRange && this.currentResponse) {
            const container = this.selectionRange.commonAncestorContainer;
            const element = container.nodeType === 3 ? container.parentElement : container;

            const newPara = document.createElement('p');
            newPara.textContent = this.currentResponse;
            element.parentNode.insertBefore(newPara, element.nextSibling);
            this.discardResponse();
        }
    }

    tryAgain() {
        // Implement re-execution of last command
        const responseBox = document.querySelector('.ai-response-box');
        if (responseBox) {
            responseBox.remove();
        }
        // Re-execute would need to store last action
    }

    discardResponse() {
        const responseBox = document.querySelector('.ai-response-box');
        if (responseBox) {
            responseBox.style.animation = 'fadeOut 0.2s ease-out';
            setTimeout(() => responseBox.remove(), 200);
        }
        this.currentResponse = '';
        this.hideSelectionToolbar();
    }

    // ============================================
    // Keyboard Shortcuts
    // ============================================
    handleShortcuts(e) {
        // Ctrl/Cmd + K to open AI
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const selection = window.getSelection();
            if (selection.toString().trim()) {
                this.selectedText = selection.toString().trim();
                this.selectionRange = selection.getRangeAt(0);
                this.showCommandMenu();
            }
        }

        // Detect /ai command
        if (e.key === '/') {
            setTimeout(() => this.checkForSlashCommand(), 10);
        }
    }

    checkForSlashCommand() {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const textBefore = range.startContainer.textContent.substring(0, range.startOffset);

        if (textBefore.endsWith('/ai')) {
            // Show AI menu
            this.showCommandMenu();
        }
    }
}

// Initialize on page load
let notionAI;
document.addEventListener('DOMContentLoaded', () => {
    notionAI = new NotionAI();
});

// Fade out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(8px); }
    }
`;
document.head.appendChild(style);
