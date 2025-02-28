// Enhanced verse-functions.js

// Configuration
const API_BASE_URL = 'https://vedicscriptures.github.io/slok';
const FAVORITES_KEY = 'gyangita_favorites';
const HISTORY_KEY = 'gyangita_history';
const MAX_HISTORY_ITEMS = 50;

// Main Functions
async function fetchVerses(verses) {
    const verseList = document.getElementById("verse-list");
    const emptyState = document.getElementById("empty-state");
    const verseActions = document.getElementById("verse-actions");
    const displayOptions = document.getElementById("display-options");
    
    if (!verseList) return;

    try {
        // Show verse actions and display options
        if (verseActions) verseActions.classList.remove('hidden');
        if (displayOptions) displayOptions.classList.remove('hidden');
        
        // Hide empty state
        if (emptyState) emptyState.classList.add('hidden');
        
        // Clear existing content and show loading
        verseList.innerHTML = `
            <div class="flex justify-center items-center p-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        `;

        // Fetch all verses in parallel
        const versePromises = verses.map(verse => 
            fetch(`${API_BASE_URL}/${verse.chapter}/${verse.text}`)
                .then(response => response.json())
                .catch(error => ({ error: true, chapter: verse.chapter, text: verse.text }))
        );

        const results = await Promise.all(versePromises);

        // Clear loading spinner
        verseList.innerHTML = '';

        // Get current view mode
        const viewMode = localStorage.getItem('gyangita_view_mode') || 'card';
        
        // Process results
        results.forEach((data, index) => {
            if (data.error) {
                const errorElement = document.createElement("div");
                errorElement.className = "text-red-500 p-4 bg-red-50 rounded-lg mb-4";
                errorElement.textContent = `Error loading Chapter ${verses[index].chapter}, Verse ${verses[index].text}`;
                verseList.appendChild(errorElement);
                return;
            }

            // Store verse in history
            addToHistory({
                chapter: verses[index].chapter,
                verse: verses[index].text,
                timestamp: new Date().getTime()
            });

            // Clone verse template
            const template = document.getElementById('verse-card-template');
            if (!template) {
                console.error('Verse card template not found');
                return;
            }
            
            const verseCard = template.content.cloneNode(true);
            
            // Set verse data
            verseCard.querySelector('.chapter-num').textContent = verses[index].chapter;
            verseCard.querySelector('.verse-num').textContent = verses[index].text;
            verseCard.querySelector('.verse-sanskrit').textContent = data.slok || 'Sanskrit not available';
            verseCard.querySelector('.verse-transliteration').textContent = data.transliteration || 'Transliteration not available';
            
            // Set translations
            const tejTranslation = data.tej?.ht || data.siva?.et || 'Translation not available';
            verseCard.querySelector('.verse-translation').textContent = tejTranslation;
            
            const commentary = data.purohit?.et || data.chinmay?.hc || '';
            if (commentary) {
                verseCard.querySelector('.verse-commentary').textContent = commentary;
                verseCard.querySelector('.verse-commentary').classList.remove('hidden');
            }
            
            // Set theme tag if available
            if (verses[index].theme) {
                verseCard.querySelector('.verse-theme').textContent = verses[index].theme;
            } else {
                verseCard.querySelector('.verse-theme').parentElement.classList.add('hidden');
            }
            
            // Set verse action buttons
            const readMoreBtn = verseCard.querySelector('.read-more-btn');
            readMoreBtn.addEventListener('click', () => {
                showVerseDetails(verses[index].chapter, verses[index].text);
            });
            
            const bookmarkBtn = verseCard.querySelector('.bookmark-btn');
            if (isFavorite(verses[index].chapter, verses[index].text)) {
                bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
                bookmarkBtn.classList.add('text-orange-600');
            }
            
            bookmarkBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(verses[index].chapter, verses[index].text);
                
                if (isFavorite(verses[index].chapter, verses[index].text)) {
                    bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
                    bookmarkBtn.classList.add('text-orange-600');
                } else {
                    bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i>';
                    bookmarkBtn.classList.remove('text-orange-600');
                }
            });
            
            const shareBtn = verseCard.querySelector('.share-btn');
            shareBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                shareVerse(verses[index].chapter, verses[index].text);
            });
            
            const playAudioBtn = verseCard.querySelector('.play-audio-btn');
            playAudioBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                playVerseAudio(verses[index].chapter, verses[index].text, verseCard);
            });
            
            const practiceBtn = verseCard.querySelector('.practice-btn');
            practiceBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.location.href = `/pages/practice.php?chapter=${verses[index].chapter}&verse=${verses[index].text}`;
            });
            
            // Apply current view mode
            const verseElement = document.createElement('div');
            verseElement.classList.add('verse-item');
            
            if (viewMode === 'compact') {
                verseCard.querySelector('.verse-card').classList.add('flex', 'flex-col', 'md:flex-row', 'md:items-center', 'md:justify-between');
                verseCard.querySelector('.verse-theme').parentElement.classList.add('hidden');
                verseCard.querySelector('.practice-btn').classList.add('hidden');
                verseCard.querySelector('.verse-sanskrit').parentElement.classList.add('md:w-1/3');
            } else if (viewMode === 'focus') {
                // Focus mode shows only one verse at a time
                if (index > 0) {
                    verseCard.querySelector('.verse-card').classList.add('hidden');
                }
                verseCard.querySelector('.verse-card').classList.add('max-w-2xl', 'mx-auto');
                verseCard.querySelector('.verse-sanskrit').classList.add('text-xl');
                verseCard.querySelector('.verse-translation').classList.add('text-lg');
            }
            
            verseElement.appendChild(verseCard);
            verseList.appendChild(verseElement);
        });

    } catch (error) {
        console.error("Error fetching verses:", error);
        verseList.innerHTML = `
            <div class="text-red-500 p-4 bg-red-50 rounded-lg text-center">
                <i class="fas fa-exclamation-circle mr-2"></i>
                Failed to load verses. Please try again later.
            </div>
        `;
    }
}

async function showVerseDetails(chapter, verse) {
    const modal = document.getElementById('verseModal');
    const verseDetails = document.getElementById('verse-details');
    
    if (!modal || !verseDetails) return;

    try {
        // Show loading in modal
        verseDetails.innerHTML = `
            <div class="flex justify-center items-center p-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        `;
        
        // Open modal immediately to show loading
        openModal();

        const response = await fetch(`${API_BASE_URL}/${chapter}/${verse}`);
        if (!response.ok) throw new Error("Verse details not found");
        
        const data = await response.json();
        
        // Store verse in history
        addToHistory({
            chapter: chapter,
            verse: verse,
            timestamp: new Date().getTime()
        });
        
        const translations = [
            { author: 'Swami Tejomayananda', text: data.tej?.ht },
            { author: 'Swami Sivananda', text: data.siva?.et },
            { author: 'Shri Purohit Swami', text: data.purohit?.et },
            { author: 'Swami Chinmayananda', text: data.chinmay?.hc },
            { author: 'Dr.S.Sankaranarayan', text: data.san?.et },
            { author: 'Swami Gambirananda', text: data.gambir?.et }
        ].filter(t => t.text);

        // Check if verse is in favorites
        const isFav = isFavorite(chapter, verse);
        const favBtnIcon = isFav ? 'fas fa-bookmark' : 'far fa-bookmark';
        const favBtnText = isFav ? 'Saved to Favorites' : 'Save to Favorites';
        const favBtnClass = isFav ? 'bg-orange-200 text-orange-800' : 'bg-orange-600 text-white';

        verseDetails.innerHTML = `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <h4 class="text-2xl font-semibold text-orange-800">Chapter ${chapter}, Verse ${verse}</h4>
                    <div class="flex space-x-2">
                        <button id="verse-audio-btn" class="p-2 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors">
                            <i class="fas fa-volume-up"></i>
                        </button>
                        <button id="verse-bookmark-btn" class="p-2 ${favBtnClass} rounded-full hover:opacity-90 transition-colors">
                            <i class="${favBtnIcon}"></i>
                        </button>
                    </div>
                </div>
                
                <div>
                    <h5 class="font-semibold text-gray-700 mb-2">Sanskrit</h5>
                    <div class="bg-orange-50 p-4 rounded-lg">
                        <p class="text-gray-800 font-sanskrit text-lg">${data.slok}</p>
                        
                        <!-- Audio Player (Hidden Initially) -->
                        <div id="verse-audio-player" class="hidden mt-4 pt-4 border-t border-orange-200">
                            <audio controls class="w-full">
                                <source src="" type="audio/mpeg">
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h5 class="font-semibold text-gray-700 mb-2">Transliteration</h5>
                    <p class="text-gray-600 bg-orange-50 p-4 rounded-lg">${data.transliteration || "Not available"}</p>
                </div>
                
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <h5 class="font-semibold text-gray-700">Translations & Commentaries</h5>
                        <div class="flex text-sm">
                            <button id="show-all-trans" class="px-3 py-1 bg-orange-100 text-orange-800 rounded-l-lg hover:bg-orange-200 transition-colors">All</button>
                            <button id="show-concise-trans" class="px-3 py-1 bg-gray-100 text-gray-800 rounded-r-lg hover:bg-gray-200 transition-colors">Concise</button>
                        </div>
                    </div>
                    <div id="translations-container" class="space-y-4">
                        ${translations.map((t, index) => `
                            <div class="bg-orange-50 p-4 rounded-lg ${index > 1 ? 'extended-translation' : ''}">
                                <p class="font-medium text-orange-800 mb-2">${t.author}</p>
                                <p class="text-gray-700">${t.text}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                ${data.chinmay?.hc ? `
                <div id="extended-commentary" class="extended-translation">
                    <h5 class="font-semibold text-gray-700 mb-2">Commentary by Swami Chinmayananda</h5>
                    <div class="bg-orange-50 p-4 rounded-lg">
                        <p class="text-gray-700">${data.chinmay.hc}</p>
                    </div>
                </div>
                ` : ''}
                
                <div class="border-t border-gray-200 pt-6 flex flex-wrap justify-center gap-4">
                    <button id="practice-verse-btn" class="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
                        <i class="fas fa-pen-fancy"></i>
                        <span>Practice This Verse</span>
                    </button>
                    
                    <button id="share-verse-btn" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                        <i class="fas fa-share-alt"></i>
                        <span>Share Verse</span>
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        document.getElementById('verse-audio-btn').addEventListener('click', function() {
            const audioPlayer = document.getElementById('verse-audio-player');
            if (audioPlayer.classList.contains('hidden')) {
                audioPlayer.classList.remove('hidden');
                playVerseAudio(chapter, verse);
            } else {
                audioPlayer.classList.add('hidden');
            }
        });
        
        document.getElementById('verse-bookmark-btn').addEventListener('click', function() {
            toggleFavorite(chapter, verse);
            
            // Update button appearance
            const isFav = isFavorite(chapter, verse);
            this.innerHTML = `<i class="${isFav ? 'fas' : 'far'} fa-bookmark"></i>`;
            this.className = `p-2 ${isFav ? 'bg-orange-200 text-orange-800' : 'bg-orange-600 text-white'} rounded-full hover:opacity-90 transition-colors`;
        });
        
        document.getElementById('practice-verse-btn').addEventListener('click', function() {
            window.location.href = `/pages/practice.php?chapter=${chapter}&verse=${verse}`;
        });
        
        document.getElementById('share-verse-btn').addEventListener('click', function() {
            shareVerse(chapter, verse);
        });
        
        // Translation view toggle
        document.getElementById('show-all-trans').addEventListener('click', function() {
            this.classList.replace('bg-gray-100', 'bg-orange-100');
            this.classList.replace('text-gray-800', 'text-orange-800');
            document.getElementById('show-concise-trans').classList.replace('bg-orange-100', 'bg-gray-100');
            document.getElementById('show-concise-trans').classList.replace('text-orange-800', 'text-gray-800');
            
            document.querySelectorAll('.extended-translation').forEach(el => {
                el.style.display = 'block';
            });
        });
        
        document.getElementById('show-concise-trans').addEventListener('click', function() {
            this.classList.replace('bg-gray-100', 'bg-orange-100');
            this.classList.replace('text-gray-800', 'text-orange-800');
            document.getElementById('show-all-trans').classList.replace('bg-orange-100', 'bg-gray-100');
            document.getElementById('show-all-trans').classList.replace('text-orange-800', 'text-gray-800');
            
            document.querySelectorAll('.extended-translation').forEach(el => {
                el.style.display = 'none';
            });
        });
        
    } catch (error) {
        console.error("Error fetching verse details:", error);
        verseDetails.innerHTML = `
            <div class="text-red-500 p-4 bg-red-50 rounded-lg text-center">
                <i class="fas fa-exclamation-circle mr-2"></i>
                Failed to load verse details. Please try again later.
            </div>
        `;
    }
}

// Play verse audio
function playVerseAudio(chapter, verse, cardElement = null) {
    // In a real implementation, this would fetch the actual audio file
    // For this example, we'll just show a message
    
    const audioPlayer = cardElement 
        ? cardElement.querySelector('.audio-player')
        : document.getElementById('verse-audio-player');
        
    if (!audioPlayer) return;
    
    // Toggle audio player visibility
    if (audioPlayer.classList.contains('hidden')) {
        audioPlayer.classList.remove('hidden');
    }
    
    // Audio player would be implemented here with actual audio files
    alert(`Playing audio for Chapter ${chapter}, Verse ${verse} would happen here in a real implementation.`);
}

// Favorites Management
function toggleFavorite(chapter, verse) {
    const favorites = getFavorites();
    const verseKey = `${chapter}-${verse}`;
    
    if (isFavorite(chapter, verse)) {
        // Remove from favorites
        const index = favorites.findIndex(fav => fav.chapter == chapter && fav.verse == verse);
        if (index !== -1) {
            favorites.splice(index, 1);
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        }
    } else {
        // Add to favorites
        favorites.push({
            chapter: chapter,
            verse: verse,
            timestamp: new Date().getTime()
        });
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
}

function isFavorite(chapter, verse) {
    const favorites = getFavorites();
    return favorites.some(fav => fav.chapter == chapter && fav.verse == verse);
}

function getFavorites() {
    try {
        const favoritesJson = localStorage.getItem(FAVORITES_KEY);
        return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch (e) {
        console.error("Error loading favorites:", e);
        return [];
    }
}

// History Management
function addToHistory(item) {
    try {
        const history = getHistory();
        
        // Check if already in history
        const existingIndex = history.findIndex(h => h.chapter == item.chapter && h.verse == item.verse);
        if (existingIndex !== -1) {
            // Update timestamp
            history[existingIndex].timestamp = item.timestamp;
        } else {
            // Add new item
            history.push(item);
        }
        
        // Keep history limited to MAX_HISTORY_ITEMS
        if (history.length > MAX_HISTORY_ITEMS) {
            // Sort by timestamp (newest first) and trim
            history.sort((a, b) => b.timestamp - a.timestamp);
            history.length = MAX_HISTORY_ITEMS;
        }
        
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
        console.error("Error updating history:", e);
    }
}

function getHistory() {
    try {
        const historyJson = localStorage.getItem(HISTORY_KEY);
        return historyJson ? JSON.parse(historyJson) : [];
    } catch (e) {
        console.error("Error loading history:", e);
        return [];
    }
}

// Modal Functions
function openModal() {
    const modal = document.getElementById('verseModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeModal() {
    const modal = document.getElementById('verseModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Share Functions
function shareVerse(chapter, verse) {
    const text = `Discover this profound verse from Bhagavad Gita - Chapter ${chapter}, Verse ${verse} on GyanGita`;
    const url = `${window.location.origin}?chapter=${chapter}&verse=${verse}`;
    shareOnWhatsApp(text, url);
}

function shareOnWhatsApp(text, url) {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`;
    window.open(whatsappUrl, '_blank');
}

// View Mode Functions
function setViewMode(mode) {
    localStorage.setItem('gyangita_view_mode', mode);
    
    // Update toggle buttons
    document.querySelectorAll('.display-toggle').forEach(btn => {
        if (btn.dataset.view === mode) {
            btn.classList.replace('bg-gray-200', 'bg-orange-600');
            btn.classList.replace('text-gray-700', 'text-white');
        } else {
            btn.classList.replace('bg-orange-600', 'bg-gray-200');
            btn.classList.replace('text-white', 'text-gray-700');
        }
    });
    
    // In a real implementation, this would refresh the verse display
    // For now, we'll just alert
    alert(`View mode changed to ${mode}. This would refresh the verse display in a real implementation.`);
}

// Initialize
document.addEventListener("DOMContentLoaded", function() {
    // Initialize mood selector
    initializeMoodSelector();
    
    // Initialize display mode toggles
    initializeDisplayToggles();
    
    // Add event listeners for modal
    const modal = document.getElementById('verseModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Check for direct verse access from URL
    const urlParams = new URLSearchParams(window.location.search);
    const chapter = urlParams.get('chapter');
    const verse = urlParams.get('verse');
    if (chapter && verse) {
        showVerseDetails(chapter, verse);
    }
});

// Initialize mood selector from JSON data
function initializeMoodSelector() {
    // Fetch moods data
    fetch("/moods.json")
        .then(response => response.json())
        .then(data => {
            // Populate dropdown
            const moodDropdown = document.getElementById("mood-dropdown");
            if (moodDropdown) {
                moodDropdown.innerHTML = "<option value='' disabled selected>Select your current state of mind...</option>";
                data.moods.forEach(mood => {
                    const option = document.createElement("option");
                    option.value = JSON.stringify(mood.verses);
                    option.textContent = mood.name;
                    moodDropdown.appendChild(option);
                });
                
                // Add event listener
                moodDropdown.addEventListener("change", function() {
                    const selectedVerses = JSON.parse(this.value);
                    fetchVerses(selectedVerses);
                });
            }
            
            // Populate mood cards
            const moodCards = document.querySelectorAll('.mood-card');
            if (moodCards.length > 0) {
                moodCards.forEach(card => {
                    const moodName = card.dataset.mood;
                    const mood = data.moods.find(m => m.name === moodName);
                    
                    if (mood) {
                        card.addEventListener('click', function() {
                            fetchVerses(mood.verses);
                            
                            // Highlight selected mood
                            moodCards.forEach(c => c.classList.remove('bg-orange-200'));
                            this.classList.add('bg-orange-200');
                            
                            // Update dropdown to match
                            if (moodDropdown) {
                                moodDropdown.value = JSON.stringify(mood.verses);
                            }
                        });
                    }
                });
            }
            
            // Show more moods toggle
            const showMoreBtn = document.getElementById('show-more-moods');
            const extendedMoods = document.getElementById('extended-moods');
            
            if (showMoreBtn && extendedMoods) {
                showMoreBtn.addEventListener('click', function() {
                    if (extendedMoods.classList.contains('hidden')) {
                        extendedMoods.classList.remove('hidden');
                        this.innerHTML = `<span>Show fewer emotions</span><i class="fas fa-chevron-up ml-2"></i>`;
                    } else {
                        extendedMoods.classList.add('hidden');
                        this.innerHTML = `<span>Show more emotions</span><i class="fas fa-chevron-down ml-2"></i>`;
                    }
                });
            }
        })
        .catch(error => console.error("Error loading moods:", error));
}

// Initialize display toggles
function initializeDisplayToggles() {
    const toggles = document.querySelectorAll('.display-toggle');
    if (toggles.length > 0) {
        toggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const mode = this.dataset.view;
                setViewMode(mode);
            });
        });
        
        // Set initial state
        const currentMode = localStorage.getItem('gyangita_view_mode') || 'card';
        toggles.forEach(toggle => {
            if (toggle.dataset.view === currentMode) {
                toggle.classList.replace('bg-gray-200', 'bg-orange-600');
                toggle.classList.replace('text-gray-700', 'text-white');
            }
        });
    }
}