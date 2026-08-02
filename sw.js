const CACHE_NAME = 'amar-pirganj-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/details.html',
  '/admin.html',
  '/profile.html',
  '/script.js',
  '/profile.js',
  '/admin.js',
  '/manifest.json'
  // আপনার প্রয়োজনীয় অন্যান্য CSS বা ইমেজ ফাইল এখানে যোগ করতে পারেন
];

// ১. ইনস্টল ইভেন্ট (ফাইলগুলো ক্যাশ করা)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// ২. অ্যাক্টিভেট ইভেন্ট (পুরোনো ক্যাশ ডিলিট বা ক্লিন করা)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ৩. ফেচ ইভেন্ট (অফলাইনে ক্যাশ থেকে ডাটা সার্ভ করা)
self.addEventListener('fetch', (event) => {
  // ফায়ারবেস বা এক্সটার্নাল এপিআই রিকোয়েস্টগুলোর ক্ষেত্রে ক্যাশ বাইপাস করতে পারেন
  if (event.request.url.includes('firestore.googleapis.com') || 
      event.request.url.includes('identitytoolkit') ||
      event.request.url.includes('firebase')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // ক্যাশে পেলে ক্যাশ রিটার্ন করবে, না হলে নেটওয়ার্ক থেকে আনবে
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
