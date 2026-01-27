// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGgPLtGauVZqsdY80FANk5zrO5cTeGpyk",
  authDomain: "hostingplatform-test.firebaseapp.com",
  projectId: "hostingplatform-test",
  storageBucket: "hostingplatform-test.appspot.com",
  messagingSenderId: "359809620928"
};

// Initialize Firebase
document.addEventListener('DOMContentLoaded', function() {
  if (typeof firebase !== 'undefined') {
    try {
      const app = firebase.initializeApp(firebaseConfig);
      const auth = firebase.auth();
      console.log("Firebase Auth Initialized");
      
      // Setup login form listener if it exists
      const loginForm = document.getElementById('admin-login-form');
      if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const email = document.getElementById('admin-email').value;
          const password = document.getElementById('admin-password').value;
          
          auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
              // Signed in
              const user = userCredential.user;
              console.log("Logged in:", user);
              alert("Logged in successfully! (Redirect logic would go here)");
              // window.location.href = '/admin/dashboard.html'; 
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.error("Login error:", errorCode, errorMessage);
              alert("Login failed: " + errorMessage);
            });
        });
      }
      
      // Handle Admin Button State
       auth.onAuthStateChanged((user) => {
        const loginButtons = document.querySelectorAll('.admin-login-btn');
        loginButtons.forEach(btn => {
            if (user) {
                btn.querySelector('.w-btn-label').textContent = "Admin (Logout)";
                btn.href = "#";
                btn.classList.add('admin-logged-in');
                
                // Remove old listeners to avoid duplicates if re-attached
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    auth.signOut().then(() => {
                        window.location.reload();
                    });
                });
            } else {
                 btn.querySelector('.w-btn-label').textContent = "Admin Login";
                 // Do not overwrite href here; rely on the static HTML relative path
            } 
                 
                 // If we are in subfolder, we might need ../login.html
                 // Simple logic: key off the base tag or just try /login.html assuming web server
                 // For local file opening, this might be tricky. Let's assume web server.
                 // The python script will try to inject the correct relative path for the button href if possible, 
                 // or we just use absolute '/login.html'
                 
                 btn.href = "/login.html";
            }
        });
      });

    } catch (e) {
      console.error("Firebase initialization failed", e);
    }
  } else {
    // console.error("Firebase SDK not loaded");
  }
});
