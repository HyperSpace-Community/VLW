const STORAGE_KEY = 'futurED_textbooks';
let textbooks = [];
let currentTextbook = null;
let currentPdfData = null; // Store PDF data temporarily

// Category colors
const categoryColors = {
    'Mathematics': 'bg-blue-500/20 text-blue-300',
    'Science': 'bg-green-500/20 text-green-300',
    'Programming': 'bg-purple-500/20 text-purple-300',
    'Engineering': 'bg-orange-500/20 text-orange-300',
    'Business': 'bg-yellow-500/20 text-yellow-300',
    'Arts': 'bg-pink-500/20 text-pink-300',
    'Other': 'bg-gray-500/20 text-gray-300'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTextbooks();
    renderTextbooks();
    setupDropZone();
});

// Load textbooks from localStorage
function loadTextbooks() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        textbooks = stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Error loading textbooks:', e);
        textbooks = [];
    }
}

// Save textbooks to localStorage
function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(textbooks));
}

// Render textbooks
function renderTextbooks() {
    const grid = document.getElementById('textbooksGrid');
    const emptyState = document.getElementById('emptyState');
    const count = document.getElementById('textbookCount');

    if (textbooks.length === 0) {
        grid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        count.textContent = '0 textbooks';
        return;
    }

    grid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    count.textContent = `${textbooks.length} textbook${textbooks.length !== 1 ? 's' : ''}`;

    grid.innerHTML = textbooks.map(book => `
        <div class="textbook-card glass-morphism rounded-xl p-6 cursor-pointer" onclick="viewTextbook('${book.id}')">
            <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-16 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-lg shadow-lg flex items-center justify-center relative">
                    ${book.pdfData ? '<span class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></span>' : ''}
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <button onclick="deleteTextbook('${book.id}', event)" class="text-gray-400 hover:text-red-400 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2 line-clamp-2">${escapeHtml(book.title)}</h3>
            <p class="text-gray-400 text-sm mb-3">${escapeHtml(book.author)}</p>
            <div class="flex items-center gap-2 mb-3">
                <span class="category-badge ${categoryColors[book.category] || categoryColors['Other']}">
                    ${book.category}
                </span>
                ${book.edition ? `<span class="text-gray-500 text-xs">${escapeHtml(book.edition)}</span>` : ''}
            </div>
            ${book.notes ? `<p class="text-gray-500 text-sm line-clamp-2 mt-3">${escapeHtml(book.notes)}</p>` : ''}
            <div class="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
                <span>${book.year || 'Year N/A'}</span>
                <span>${new Date(book.created).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');
}

// Open add textbook modal
function openAddTextbookModal() {
    document.getElementById('modalTitle').textContent = 'Add Textbook';
    document.getElementById('textbookForm').reset();
    document.getElementById('textbookId').value = '';
    document.getElementById('textbookModal').classList.add('active');
}

// Close textbook modal
function closeTextbookModal() {
    document.getElementById('textbookModal').classList.remove('active');
    currentPdfData = null;
    document.getElementById('pdfStatus').classList.add('hidden');
}

// Save textbook
function saveTextbook(event) {
    event.preventDefault();

    const id = document.getElementById('textbookId').value;
    const textbook = {
        id: id || 'book_' + Date.now(),
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        category: document.getElementById('bookCategory').value,
        edition: document.getElementById('bookEdition').value,
        year: document.getElementById('bookYear').value,
        url: document.getElementById('bookUrl').value,
        notes: document.getElementById('bookNotes').value,
        pdfData: currentPdfData || (id ? textbooks.find(b => b.id === id)?.pdfData : null),
        created: id ? textbooks.find(b => b.id === id).created : new Date().toISOString(),
        modified: new Date().toISOString()
    };

    if (id) {
        const index = textbooks.findIndex(b => b.id === id);
        textbooks[index] = textbook;
    } else {
        textbooks.unshift(textbook);
    }

    saveToStorage();
    renderTextbooks();
    closeTextbookModal();
    currentPdfData = null;
}

// Delete textbook
function deleteTextbook(id, event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this textbook?')) {
        textbooks = textbooks.filter(b => b.id !== id);
        saveToStorage();
        renderTextbooks();
    }
}

// View textbook
function viewTextbook(id) {
    currentTextbook = textbooks.find(b => b.id === id);
    if (!currentTextbook) return;

    document.getElementById('viewTitle').textContent = currentTextbook.title;
    document.getElementById('viewContent').innerHTML = `
        <div class="space-y-4">
            <div>
                <h3 class="text-sm font-semibold text-gray-400 mb-1">Author</h3>
                <p class="text-white">${escapeHtml(currentTextbook.author)}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <h3 class="text-sm font-semibold text-gray-400 mb-1">Subject</h3>
                    <span class="category-badge ${categoryColors[currentTextbook.category] || categoryColors['Other']}">
                        ${currentTextbook.category}
                    </span>
                </div>
                ${currentTextbook.edition ? `
                <div>
                    <h3 class="text-sm font-semibold text-gray-400 mb-1">Edition</h3>
                    <p class="text-white">${escapeHtml(currentTextbook.edition)}</p>
                </div>
                ` : ''}
            </div>
            ${currentTextbook.year ? `
            <div>
                <h3 class="text-sm font-semibold text-gray-400 mb-1">Year</h3>
                <p class="text-white">${escapeHtml(currentTextbook.year)}</p>
            </div>
            ` : ''}
            ${currentTextbook.url || currentTextbook.pdfData ? `
            <div>
                <h3 class="text-sm font-semibold text-gray-400 mb-1">File Location</h3>
                <p class="text-white text-sm break-all">${currentTextbook.pdfData ? '📄 Embedded PDF' : escapeHtml(currentTextbook.url)}</p>
            </div>
            ` : ''}
            ${currentTextbook.notes ? `
            <div>
                <h3 class="text-sm font-semibold text-gray-400 mb-1">Notes</h3>
                <p class="text-white">${escapeHtml(currentTextbook.notes)}</p>
            </div>
            ` : ''}
            <div class="pt-4 border-t border-white/10 text-xs text-gray-500">
                <p>Added: ${new Date(currentTextbook.created).toLocaleString()}</p>
                ${currentTextbook.modified ? `<p>Modified: ${new Date(currentTextbook.modified).toLocaleString()}</p>` : ''}
            </div>
        </div>
    `;

    const openBtn = document.getElementById('openBookBtn');
    openBtn.style.display = (currentTextbook.url || currentTextbook.pdfData) ? 'block' : 'none';

    document.getElementById('viewModal').classList.add('active');
}

// Close view modal
function closeViewModal() {
    document.getElementById('viewModal').classList.remove('active');
    currentTextbook = null;
}

// Edit from view
function editFromView() {
    closeViewModal();
    if (!currentTextbook) return;

    document.getElementById('modalTitle').textContent = 'Edit Textbook';
    document.getElementById('textbookId').value = currentTextbook.id;
    document.getElementById('bookTitle').value = currentTextbook.title;
    document.getElementById('bookAuthor').value = currentTextbook.author;
    document.getElementById('bookCategory').value = currentTextbook.category;
    document.getElementById('bookEdition').value = currentTextbook.edition || '';
    document.getElementById('bookYear').value = currentTextbook.year || '';
    document.getElementById('bookUrl').value = currentTextbook.url || '';
    document.getElementById('bookNotes').value = currentTextbook.notes || '';
    document.getElementById('textbookModal').classList.add('active');
}

// Open textbook file
function openTextbookFile() {
    if (currentTextbook) {
        if (currentTextbook.pdfData) {
            const pdfWindow = window.open('', '_blank');
            pdfWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${escapeHtml(currentTextbook.title)}</title>
                    <style>
                        body { margin: 0; padding: 0; }
                        iframe { width: 100%; height: 100vh; border: none; }
                    </style>
                </head>
                <body>
                    <iframe src="${currentTextbook.pdfData}"></iframe>
                </body>
                </html>
            `);
        } else if (currentTextbook.url) {
            window.open(currentTextbook.url, '_blank');
        }
    }
}

// Filter textbooks
function filterTextbooks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;

    const filtered = textbooks.filter(book => {
        const matchesSearch = !searchTerm ||
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.category.toLowerCase().includes(searchTerm) ||
            (book.notes && book.notes.toLowerCase().includes(searchTerm));

        const matchesCategory = !category || book.category === category;

        return matchesSearch && matchesCategory;
    });

    renderFilteredBooks(filtered);
}

// Sort textbooks
function sortTextbooks() {
    const sortBy = document.getElementById('sortFilter').value;

    switch (sortBy) {
        case 'newest':
            textbooks.sort((a, b) => new Date(b.created) - new Date(a.created));
            break;
        case 'oldest':
            textbooks.sort((a, b) => new Date(a.created) - new Date(b.created));
            break;
        case 'title':
            textbooks.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'author':
            textbooks.sort((a, b) => a.author.localeCompare(b.author));
            break;
    }

    filterTextbooks();
}

// Render filtered books
function renderFilteredBooks(books) {
    const grid = document.getElementById('textbooksGrid');
    const emptyState = document.getElementById('emptyState');
    const count = document.getElementById('textbookCount');

    if (books.length === 0) {
        grid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        count.textContent = '0 textbooks';
        return;
    }

    grid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    count.textContent = `${books.length} textbook${books.length !== 1 ? 's' : ''}`;

    const originalTextbooks = textbooks;
    textbooks = books;
    renderTextbooks();
    textbooks = originalTextbooks;
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Close modals on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeTextbookModal();
        closeViewModal();
    }
});

// PDF Drag and Drop functionality
function setupDropZone() {
    const dropZone = document.getElementById('dropZone');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('drag-over');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('drag-over');
        }, false);
    });

    dropZone.addEventListener('drop', handleDrop, false);
    dropZone.addEventListener('click', () => {
        document.getElementById('pdfFileInput').click();
    });
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    [...files].forEach(file => {
        if (file.type === 'application/pdf') {
            processPDF(file);
        } else {
            alert('Please upload PDF files only.');
        }
    });
}

function processPDF(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
        const pdfDataUrl = e.target.result;
        currentPdfData = pdfDataUrl;

        const fileName = file.name.replace('.pdf', '');

        openAddTextbookModal();

        const titleInput = document.getElementById('bookTitle');
        if (!titleInput.value) {
            titleInput.value = fileName;
        }

        document.getElementById('pdfStatus').classList.remove('hidden');
        document.getElementById('pdfFileName').textContent = file.name;

        showNotification(`PDF "${file.name}" loaded successfully! File size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    };

    reader.onerror = function() {
        alert('Error reading PDF file. Please try again.');
    };

    reader.readAsDataURL(file);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-50 glass-morphism rounded-lg p-4 text-white shadow-lg';
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
