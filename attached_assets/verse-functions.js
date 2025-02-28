// verse-functions.js

// Configuration
const API_BASE_URL = 'https://vedicscriptures.github.io/slok';

// Main Functions
async function fetchVerses(verses) {
    const verseList = document.getElementById("verse-list");
    if (!verseList) return;

    try {
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

        // Process results
        results.forEach((data, index) => {
            if (data.error) {
                const errorElement = document.createElement("div");
                errorElement.className = "text-red-500 p-4 bg-red-50 rounded-lg mb-4";
                errorElement.textContent = `Error loading Chapter ${verses[index].chapter}, Verse ${verses[index].text}`;
                verseList.appendChild(errorElement);
                return;
            }

            const tejTranslation = data.tej?.ht || data.siva?.et || '';
            const mainTranslation = data.purohit?.et || data.chinmay?.hc || '';
            
            const verseItem = document.createElement("div");
            verseItem.className = "bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow mb-6";
            verseItem.innerHTML = `
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold text-orange-800">
                        Chapter ${verses[index].chapter}, Verse ${verses[index].text}
                    </h3>
                    <button onclick="showVerseDetails(${verses[index].chapter}, ${verses[index].text})" 
                            class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                        Read More
                    </button>
                </div>
                <div class="space-y-4">
                    <div class="bg-orange-50 rounded-lg p-4">
                        <p class="text-gray-800 font-sanskrit mb-2">${data.slok}</p>
                        <p class="text-gray-600 text-sm">${data.transliteration}</p>
                    </div>
                    <div class="space-y-2">
                        <p class="text-gray-700">${tejTranslation}</p>
                        ${mainTranslation ? `<p class="text-gray-600 italic text-sm">${mainTranslation}</p>` : ''}
                    </div>
                </div>
            `;
            verseList.appendChild(verseItem);
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
        
        const translations = [
            { author: 'Swami Tejomayananda', text: data.tej?.ht },
            { author: 'Swami Sivananda', text: data.siva?.et },
            { author: 'Shri Purohit Swami', text: data.purohit?.et },
            { author: 'Swami Chinmayananda', text: data.chinmay?.hc },
            { author: 'Dr.S.Sankaranarayan', text: data.san?.et },
            { author: 'Swami Gambirananda', text: data.gambir?.et }
        ].filter(t => t.text);

        verseDetails.innerHTML = `
            <div class="space-y-6">
                <div>
                    <h4 class="text-2xl font-semibold text-orange-800 mb-4">Chapter ${chapter}, Verse ${verse}</h4>
                </div>
                <div>
                    <h5 class="font-semibold text-gray-700 mb-2">Sanskrit</h5>
                    <p class="text-gray-800 bg-orange-50 p-4 rounded-lg font-sanskrit">${data.slok}</p>
                </div>
                <div>
                    <h5 class="font-semibold text-gray-700 mb-2">Transliteration</h5>
                    <p class="text-gray-600 bg-orange-50 p-4 rounded-lg">${data.transliteration || "Not available"}</p>
                </div>
                <div>
                    <h5 class="font-semibold text-gray-700 mb-2">Translations & Commentaries</h5>
                    <div class="space-y-4">
                        ${translations.map(t => `
                            <div class="bg-orange-50 p-4 rounded-lg">
                                <p class="font-medium text-orange-800 mb-2">${t.author}</p>
                                <p class="text-gray-700">${t.text}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ${data.chinmay?.hc ? `
                <div>
                    <h5 class="font-semibold text-gray-700 mb-2">Commentary by Swami Chinmayananda</h5>
                    <div class="bg-orange-50 p-4 rounded-lg">
                        <p class="text-gray-700">${data.chinmay.hc}</p>
                    </div>
                </div>
                ` : ''}
                <div class="flex justify-center mt-6 pt-6 border-t border-gray-200">
                    <button onclick="shareVerse(${chapter}, ${verse})" 
                            class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                        <i class="fab fa-whatsapp"></i>
                        <span>Share Verse</span>
                    </button>
                </div>
            </div>
        `;
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

// Initialize
document.addEventListener("DOMContentLoaded", function() {
    // Initialize mood dropdown
    fetch("moods.json")
        .then(response => response.json())
        .then(data => {
            const moodDropdown = document.getElementById("mood-dropdown");
            if (moodDropdown) {
                moodDropdown.innerHTML = "<option value='' disabled selected>Select your current state of mind...</option>";
                data.moods.forEach(mood => {
                    let option = document.createElement("option");
                    option.value = JSON.stringify(mood.verses);
                    option.textContent = mood.name;
                    moodDropdown.appendChild(option);
                });
            }
        })
        .catch(error => console.error("Error loading moods:", error));

    // Event Listeners
    const moodDropdown = document.getElementById("mood-dropdown");
    if (moodDropdown) {
        moodDropdown.addEventListener("change", function() {
            const selectedVerses = JSON.parse(this.value);
            fetchVerses(selectedVerses);
        });
    }

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