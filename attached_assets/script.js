document.addEventListener("DOMContentLoaded", function () {
    fetch("moods.json")
        .then(response => response.json())
        .then(data => {
            const moodDropdown = document.getElementById("mood-dropdown");

            function populateMoods() {
                moodDropdown.innerHTML = "";
                let defaultOption = document.createElement("option");
                defaultOption.textContent = "Select a Mood for Guidance";
                defaultOption.disabled = true;
                defaultOption.selected = true;
                moodDropdown.appendChild(defaultOption);

                data.moods.forEach(mood => {
                    let option = document.createElement("option");
                    option.value = JSON.stringify(mood.verses);
                    option.textContent = mood.name;
                    moodDropdown.appendChild(option);
                });
            }

            populateMoods();
            moodDropdown.addEventListener("change", function () {
                let selectedVerses = JSON.parse(this.value);
                fetchVerses(selectedVerses);
            });
        })
        .catch(error => console.error("Error loading moods.json:", error));
});

async function fetchVerses(verses) {
    const verseDisplay = document.getElementById("verse-display");
    verseDisplay.innerHTML = "";
    
    for (let verse of verses) {
        try {
            let response = await fetch(`https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${verse.chapter}/verses/${verse.text}/`, {
                method: "GET",
                headers: {
                    "x-rapidapi-key": "7c7c4eb550msh5f63cdc84559c70p1e5f5ajsn7fba957a54f1",
                    "x-rapidapi-host": "bhagavad-gita3.p.rapidapi.com"
                }
            });

            if (!response.ok) {
                throw new Error("Verse not found");
            }

            let data = await response.json();
            
            let verseElement = document.createElement("div");
            verseElement.className = "p-4 bg-white border-l-4 border-orange-500 rounded-lg shadow-md";
            verseElement.innerHTML = `
                <h4 class='text-lg font-bold text-orange-600'>${data.chapter_number}.${data.verse_number}</h4>
                <p class='mt-2 text-gray-800'>${data.text || "Verse text unavailable"}</p>
                <button class='mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg' onclick='showVerseDetails(${verse.chapter}, ${verse.text})'>Read More</button>
            `;
            verseDisplay.appendChild(verseElement);
        } catch (error) {
            console.error("Error fetching verse:", error);
            let errorElement = document.createElement("p");
            errorElement.className = "text-red-500";
            errorElement.textContent = "Error loading verse. Please try again.";
            verseDisplay.appendChild(errorElement);
        }
    }
}

async function showVerseDetails(chapter, verse) {
    try {
        let response = await fetch(`https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapter}/verses/${verse}/`, {
            method: "GET",
            headers: {
                "x-rapidapi-key": "7c7c4eb550msh5f63cdc84559c70p1e5f5ajsn7fba957a54f1",
                "x-rapidapi-host": "bhagavad-gita3.p.rapidapi.com"
            }
        });

        if (!response.ok) {
            throw new Error("Verse details not found");
        }

        let data = await response.json();
        let verseModal = document.getElementById("verseModal");
        document.getElementById("verseModalTitle").textContent = `${data.chapter_number}.${data.verse_number}`;
        document.getElementById("verseModalText").innerHTML = `<p class='text-gray-800 text-lg'>${data.text || "Verse text unavailable"}</p>`;
        
        let translations = data.translations && data.translations.length > 0 ? 
            data.translations.map(t => `<div class='p-3 bg-gray-100 rounded shadow-md'><strong>${t.author}:</strong> ${t.description || "Translation unavailable"}</div>`).join(" ") 
            : "<p class='text-gray-500'>No translations available.</p>";
        
        document.getElementById("verseModalTranslations").innerHTML = translations;
        verseModal.classList.remove("hidden");
    } catch (error) {
        console.error("Error fetching verse details:", error);
    }
}

function closeModal() {
    document.getElementById("verseModal").classList.add("hidden");
}
