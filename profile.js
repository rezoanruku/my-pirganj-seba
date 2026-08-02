import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const userImg = document.getElementById('user-img');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const imageInput = document.getElementById('image-input');
const adminBtn = document.getElementById('admin-btn');
const logoutBtn = document.getElementById('logout-btn');

const ADMIN_EMAIL = "rezoanhoseenruku@gmail.com"; 

// পেজ লোড হওয়ার সাথে সাথেই নিশ্চিতভাবে অ্যাডমিন বাটন হাইড রাখা (নিরাপত্তার জন্য)
if (adminBtn) {
    adminBtn.classList.add('hidden');
}

// ১. ইউজারের ডাটা এবং লোকাল স্টোরেজ থেকে ছবি লোড করা
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            await user.reload();
        } catch(e) {
            console.log("Reload error:", e);
        }
        
        const currentUser = auth.currentUser;

        if (userName) userName.innerText = currentUser.displayName || "ইউজার নাম নেই";
        if (userEmail) userEmail.innerText = currentUser.email;
        
        const savedLocalImg = localStorage.getItem(`profile_pic_${currentUser.uid}`);

        if (userImg) {
            if (savedLocalImg) {
                userImg.src = savedLocalImg;
            } else if (currentUser.photoURL) {
                userImg.src = currentUser.photoURL;
            } else {
                userImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'User')}&background=10B981&color=fff`;
            }
        }

        // ২. অ্যাডমিন চেক এবং বাটন শো/হাইড করার সঠিক লজিক
        if (adminBtn) {
            if (currentUser.email === ADMIN_EMAIL) {
                adminBtn.classList.remove('hidden'); // শুধু অ্যাডমিন হলে দেখাবে
            } else {
                adminBtn.classList.add('hidden'); // সাধারণ ইউজার হলে নিশ্চিতভাবে লুকিয়ে রাখবে
            }
        }
    } else {
        window.location.href = 'auth.html';
    }
});

// ৩. ছবি সিলেক্ট করে ডিভাইসের LocalStorage-এ স্থায়ীভাবে সেভ করা
if (imageInput) {
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const user = auth.currentUser;

        if (file && user) {
            if (file.size > 2 * 1024 * 1024) {
                alert("ছবিটির সাইজ খুব বড়! ২ MB-এর ছোট ছবি আপলোড করুন।");
                return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                const base64Image = event.target.result;

                if (userImg) userImg.src = base64Image;
                localStorage.setItem(`profile_pic_${user.uid}`, base64Image);

                alert('প্রোফাইল পিকচার আপনার ডিভাইসে স্থায়ীভাবে সেভ হয়েছে!');
            };

            reader.readAsDataURL(file);
        }
    });
}

// ৪. লগআউট
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            alert('লগআউট সফল হয়েছে!');
            window.location.href = 'index.html';
        });
    });
}
