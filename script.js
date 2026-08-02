// ==========================================
// ১. "আরও" বাটন টগল করার লজিক (Section Toggle)
// ==========================================
function toggleSection(containerId, btn) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const textSpan = btn.querySelector('span');
    const icon = btn.querySelector('i');

    const isOpen = container.classList.toggle('open');
    if (textSpan) textSpan.innerText = isOpen ? 'ঢাকুন' : 'আরও';
    if (icon) icon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
}

// ==========================================
// ২. সার্ভিস কার্ড ক্লিক অ্যানিমেশন (Card Click Animation)
// ==========================================
function handleServiceClick(event, name) {
    const target = event.currentTarget;
    const href = target.getAttribute('href');

    if (href && href !== '#') {
        event.preventDefault(); 
        target.classList.add('scale-95', 'opacity-80');

        setTimeout(() => {
            window.location.href = href;
        }, 120); 
    }
}

// ==========================================
// DOM লোড হওয়ার পর মূল ফাংশনগুলো রান করবে
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // ৩. এডভান্সড রিয়েল-টাইম সার্চ ফিল্টার লজিক (Search Filter)
    // ==========================================
    const searchInput = document.getElementById('search-input');
    const mainContainer = document.querySelector('main');
    
    // "নো সার্ভিস ফাউন্ড" মেসেজ এলিমেন্ট তৈরি
    const noResultMsg = document.createElement('div');
    noResultMsg.id = 'no-result-msg';
    noResultMsg.className = 'hidden text-center py-12 px-4';
    noResultMsg.innerHTML = `
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400 text-2xl">
            <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <p class="text-sm font-bold text-gray-700 mb-1">কোনো সেবা খুঁজে পাওয়া যায়নি!</p>
        <p class="text-xs text-gray-400">বানান সঠিক আছে কিনা নিশ্চিত হয়ে আবার চেষ্টা করুন।</p>
    `;
    if (mainContainer) mainContainer.appendChild(noResultMsg);

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            // ইনপুট ক্লিনআপ (বাংলা 'ড়'/'ড়' এবং ক্যাপিটাল লেটার নরমাল করা)
            const query = e.target.value
                .toLowerCase()
                .replace(/ড়/g, 'ড়')
                .trim();

            const serviceCards = document.querySelectorAll('.service-card');
            const sections = document.querySelectorAll('.service-section');
            let totalMatchCount = 0;

            // প্রতিটি সার্ভিস কার্ড ফিল্টার করা
            serviceCards.forEach(card => {
                const titleText = (card.querySelector('.service-title')?.innerText || '')
                    .toLowerCase()
                    .replace(/ড়/g, 'ড়');
                
                const hrefAttr = (card.getAttribute('href') || '').toLowerCase();

                // বাংলা নাম বা ইংরেজী URL ক্যাটাগরির সাথে মিললে
                if (titleText.includes(query) || hrefAttr.includes(query)) {
                    card.style.display = 'flex';
                    totalMatchCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // খালি সেকশন লুকিয়ে ফেলা
            sections.forEach(section => {
                const visibleCards = section.querySelectorAll('.service-card[style*="display: flex"]');
                if (query !== '' && visibleCards.length === 0) {
                    section.style.display = 'none';
                } else {
                    section.style.display = 'block';
                }
            });

            // কোনো কার্ড না মিললে "No Result" দেখানো
            if (query !== '' && totalMatchCount === 0) {
                noResultMsg.classList.remove('hidden');
            } else {
                noResultMsg.classList.add('hidden');
            }
        });
    }

    // ==========================================
    // ৪. ব্যানার অটো-স্লাইডার ও ডট কন্ট্রোল (Banner Slider)
    // ==========================================
    const slider = document.getElementById('banner-slider');
    const dot0 = document.getElementById('dot-0');
    const dot1 = document.getElementById('dot-1');

    if (slider && dot0 && dot1) {
        let currentSlide = 0;
        let autoSlideTimer;

        // ডট হাইলাইট আপডেট
        function updateDots(index) {
            if (index === 0) {
                dot0.className = "w-2.5 h-1.5 rounded-full bg-green-600 transition-all duration-300";
                dot1.className = "w-1.5 h-1.5 rounded-full bg-gray-300 transition-all duration-300";
            } else {
                dot0.className = "w-1.5 h-1.5 rounded-full bg-gray-300 transition-all duration-300";
                dot1.className = "w-2.5 h-1.5 rounded-full bg-green-600 transition-all duration-300";
            }
        }

        // স্লাইড চালানো
        function startAutoSlide() {
            autoSlideTimer = setInterval(() => {
                currentSlide = currentSlide === 0 ? 1 : 0;
                slider.scrollTo({
                    left: slider.clientWidth * currentSlide,
                    behavior: 'smooth'
                });
                updateDots(currentSlide);
            }, 4000);
        }

        startAutoSlide();

        // ইউজার নিজ থেকে স্ক্রোল করার সময় সিঙ্ক রাখা
        slider.addEventListener('scroll', () => {
            const index = Math.round(slider.scrollLeft / slider.clientWidth);
            if (currentSlide !== index) {
                currentSlide = index;
                updateDots(currentSlide);
            }
        });
    }
});
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}
