import { db } from "./firebase-config.js";
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const urlParams = new URLSearchParams(window.location.search);
let currentCategory = urlParams.get('category');

const container = document.getElementById('details-container');
const pageTitle = document.getElementById('page-title');

const categoryMap = {
  'bus': ['bus'],
  'car': ['car', 'car_rent'],
  'car_rent': ['car', 'car_rent'],
  'courier': ['courier'],
  'hospital': ['hospital'],
  'doctor': ['doctor'],
  'ambulance': ['ambulance'],
  'blood': ['blood'],
  'school': ['school'],
  'tutor': ['tutor'],
  'jobs': ['jobs'],
  'union': ['union'],
  'upazila': ['upazila'],
  'land': ['land'],
  'digital': ['digital', 'digital_center'],
  'digital_center': ['digital', 'digital_center'],
  'police': ['police'],
  'fire': ['fire', 'fire_service'],
  'fire_service': ['fire', 'fire_service'],
  'electricity': ['electricity'],
  'internet': ['internet'],
  'place': ['place', 'tourist_place'],
  'tourist_place': ['place', 'tourist_place'],
  'park': ['park'],
  'agriculture': ['agriculture', 'krishi'],
  'krishi': ['agriculture', 'krishi'],
  'vet': ['vet', 'vet_doctor'],
  'vet_doctor': ['vet', 'vet_doctor'],
  'agri_product': ['agri_product'],
  'shop': ['shop'],
  'technician': ['technician'],
  'restaurant': ['restaurant'],
  'lawyer': ['lawyer'],
  'kazi': ['kazi'],
  'volunteer': ['volunteer'],
  'events': ['events']
};

const categoryNamesBn = {
  'bus': 'বাস সেবা', 'car': 'গাড়ি ভাড়া', 'courier': 'কুরিয়ার সেবা',
  'hospital': 'হাসপাতাল', 'doctor': 'ডাক্তার', 'ambulance': 'এম্বুলেন্স', 'blood': 'রক্তদান',
  'school': 'শিক্ষা প্রতিষ্ঠান', 'tutor': 'টিউটর ও কোচিং', 'jobs': 'চাকরির খবর',
  'union': 'ইউনিয়ন ও পৌরসভা', 'upazila': 'উপজেলা প্রশাসন', 'land': 'ভূমি ও রেজিস্ট্রি', 'digital': 'ডিজিটাল সেবা',
  'police': 'পুলিশ', 'fire': 'ফায়ার সার্ভিস', 'electricity': 'বিদ্যুৎ সেবা', 'internet': 'ইন্টারনেট সেবা',
  'place': 'দর্শনীয় স্থান', 'park': 'পার্ক', 'agriculture': 'কৃষি সেবা', 'vet': 'পশু চিকিৎসক',
  'agri_product': 'কৃষি-পণ্য', 'shop': 'দোকানপাট', 'technician': 'দক্ষ কারিগর', 'restaurant': 'রেস্তোরাঁ',
  'lawyer': 'আইনজীবী', 'kazi': 'কাজী অফিস', 'volunteer': 'স্বেচ্ছাসেবক', 'events': 'ইভেন্ট নোটিশ'
};

if (currentCategory && pageTitle) {
  const cleanCat = currentCategory.toLowerCase();
  const titleBn = categoryNamesBn[cleanCat] || cleanCat.toUpperCase();
  pageTitle.innerText = titleBn + " এর তথ্য";
}

function listenToCategoryData() {
  if (!currentCategory) {
    if (container) container.innerHTML = `<p class="text-center py-10 text-red-500 font-medium">কোনো ক্যাটাগরি নির্বাচন করা হয়নি!</p>`;
    return;
  }

  if (container) container.innerHTML = `<p class="text-center py-10 text-gray-500">তথ্য লোড হচ্ছে...</p>`;

  const cleanCategory = currentCategory.toLowerCase();
  const targetCategories = categoryMap[cleanCategory] || [cleanCategory];

  const q = query(
    collection(db, "services"), 
    where("category", "in", targetCategories)
  );

  onSnapshot(q, (querySnapshot) => {
    if (querySnapshot.empty) {
      if (container) container.innerHTML = `<p class="text-center py-10 text-gray-500">এই ক্যাটাগরিতে কোনো তথ্য পাওয়া যায়নি।</p>`;
      return;
    }

    let html = '';
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      const title = data.title || data.name || 'শিরোনাম নেই';
      const phoneNumber = data.phone || data.Contact;
      const description = data.description || '';
      const address = data.address || '';
      const specialty = data.specialty || '';

      html += `
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3 relative border-l-4 border-emerald-600">
          <h4 class="font-bold text-gray-800 text-base">${title}</h4>
          
          ${address ? `<p class="text-xs text-gray-600 mt-1"><i class="fa-solid fa-location-dot mr-1 text-emerald-600"></i>${address}</p>` : ''}
          ${specialty ? `<p class="text-xs text-gray-600 mt-1"><i class="fa-solid fa-user-doctor mr-1 text-emerald-600"></i>${specialty}</p>` : ''}
          ${description ? `<p class="text-xs text-gray-600 mt-1">${description}</p>` : ''}
          
          <div class="mt-3 flex items-center justify-between">
            ${phoneNumber ? `
              <a href="tel:${phoneNumber}" class="inline-block text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors">
                <i class="fa-solid fa-phone mr-1"></i> ${phoneNumber}
              </a>
            ` : '<span></span>'}
          </div>
        </div>
      `;
    });

    if (container) container.innerHTML = html;

  }, (error) => {
    console.error("Error fetching live data: ", error);
    if (container) container.innerHTML = `<p class="text-center py-10 text-red-500">ডাটা লোড করতে সমস্যা হয়েছে!</p>`;
  });
}

listenToCategoryData();
