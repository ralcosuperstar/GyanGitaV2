<?php
require_once 'config/config.php';
$pageTitle = 'Divine Wisdom from Bhagavad Gita';
$currentPage = 'home';
include 'includes/header.php';
include 'includes/nav.php';
include 'includes/main-content.php';
include 'includes/footer.php';
?>
<!-- Add this section to any page where you want to display personalized recommendations -->
<section class="py-12 bg-orange-50">
    <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
            <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Personalized For You</h2>
            
            <!-- Recommendations Container -->
            <div id="recommendations-container">
                <!-- Content will be populated by recommendations.js -->
                <div class="flex justify-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
            </div>
            
            <!-- Refresh Recommendations -->
            <div class="text-center mt-8">
                <button id="refresh-recommendations" class="px-4 py-2 bg-white text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
                    <i class="fas fa-sync-alt mr-2"></i>
                    <span>Refresh Recommendations</span>
                </button>
            </div>
        </div>
    </div>
</section>

<!-- Add this to the end of the page before </body> -->
<script src="/assets/js/recommendations.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Refresh recommendations when button is clicked
        const refreshBtn = document.getElementById('refresh-recommendations');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                // Show loading state
                const recContainer = document.getElementById('recommendations-container');
                if (recContainer) {
                    recContainer.innerHTML = `
                        <div class="flex justify-center">
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                        </div>
                    `;
                }
                
                // Generate new recommendations
                const newRecommendations = generateRecommendations();
                
                // Render new recommendations
                if (recContainer) {
                    renderRecommendations(newRecommendations, recContainer);
                }
            });
        }
    });
</script>