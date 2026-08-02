import { auth } from "./firebase-config.js";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    updateProfile,
    GoogleAuthProvider, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// DOM Elements
const authForm = document.getElementById('auth-form');
const nameInput = document.getElementById('name');
const nameField = document.getElementById('name-field');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const toggleText = document.getElementById('toggle-text');
const googleBtn = document.getElementById('google-btn');

let isLoginMode = true;

// Toggle function
function toggleMode() {
    isLoginMode = !isLoginMode;
    
    if (isLoginMode) {
        if (formTitle) formTitle.innerText = "লগইন করুন";
        if (submitBtn) submitBtn.innerText = "লগইন করুন";
        if (nameField) nameField.classList.add('hidden');
        if (toggleText) toggleText.innerHTML = 'নতুন ব্যবহারকারী? <button type="button" id="toggle-btn" class="text-emerald-600 font-semibold underline">রেজিস্ট্রেশন করুন</button>';
    } else {
        if (formTitle) formTitle.innerText = "নতুন অ্যাকাউন্ট তৈরি করুন";
        if (submitBtn) submitBtn.innerText = "সাইনআপ করুন";
        if (nameField) nameField.classList.remove('hidden');
        if (toggleText) toggleText.innerHTML = 'অলরেডি অ্যাকাউন্ট আছে? <button type="button" id="toggle-btn" class="text-emerald-600 font-semibold underline">লগইন করুন</button>';
    }
}

// Event Delegation for Toggle Button
if (toggleText) {
    toggleText.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'toggle-btn') {
            e.preventDefault();
            toggleMode();
        }
    });
}

// Email/Password Submit Event
if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput ? emailInput.value : '';
        const password = passwordInput ? passwordInput.value : '';
        const name = nameInput ? nameInput.value : '';

        if (isLoginMode) {
            // Login Logic
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    alert('লগইন সফল হয়েছে!');
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    alert('লগইন ত্রুটি: ' + error.message);
                });
        } else {
            // Registration Logic
            if (!name) {
                alert('অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন');
                return;
            }
            
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: name });
                alert('রেজিস্ট্রেশন সফল হয়েছে!');
                window.location.href = 'index.html';
            } catch (error) {
                alert('রেজিস্ট্রেশন ব্যর্থ হয়েছে: ' + error.message);
            }
        }
    });
}

// Google Sign-In Provider
const provider = new GoogleAuthProvider();

if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            alert(`স্বাগতম, ${user.displayName || 'ইউজার'}! গুগল দিয়ে সাইন ইন সফল হয়েছে।`);
            window.location.href = 'index.html';
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            alert('গুগল সাইন ইন ত্রুটি: ' + error.message);
        }
    });
}
