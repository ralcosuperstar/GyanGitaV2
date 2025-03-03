const CACHE_NAME = 'bhagavad-gita-cache-v1';
const urlsToCache = [
    '/',
    '/index.php',
    '/pages/browse.php',
    '/pages/practice.php',
    '/pages/about.php',
    '/pages/contact.php',
    '/assets/js/main.js',
    '/assets/js/verse-functions.js',
    '/assets/css/styles.css',
    '/assets/images/om-favicon.png',
    '/assets/images/app-icons/apple-touch-icon.png',
    '/moods.json'
];

// Install Event - Cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch Event - Serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Clone the request
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(
                    response => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                // Add response to cache
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    }
                );
            })
    );
});

// Background Sync for offline form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'sync-forms') {
        event.waitUntil(syncForms());
    }
});

// Function to handle background sync of stored form submissions
function syncForms() {
    return new Promise((resolve, reject) => {
        // Get all stored form submissions
        idbKeyval.get('pendingFormSubmissions')
            .then(submissions => {
                if (!submissions || submissions.length === 0) {
                    return resolve();
                }
                
                // Process each submission
                const promises = submissions.map(submission => {
                    return fetch(submission.url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(submission.data)
                    })
                    .then(response => {
                        if (response.ok) {
                            // Remove successful submission
                            return idbKeyval.get('pendingFormSubmissions')
                                .then(currentSubmissions => {
                                    const updatedSubmissions = currentSubmissions.filter(
                                        item => item.id !== submission.id
                                    );
                                    return idbKeyval.set('pendingFormSubmissions', updatedSubmissions);
                                });
                        }
                    });
                });
                
                return Promise.all(promises).then(() => resolve());
            })
            .catch(error => {
                console.error('Background sync failed:', error);
                reject(error);
            });
    });
}

// Push notifications
self.addEventListener('push', event => {
    const data = event.data.json();
    
    const options = {
        body: data.body,
        icon: '/assets/images/app-icons/icon-192x192.png',
        badge: '/assets/images/app-icons/badge-icon.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Handle notification click
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});