
    // Helpers
    const $ = (sel) => document.querySelector(sel);
    const showMessage = (text, type = 'success') => {
      const el = $('#message');
      el.textContent = text;
      el.className = 'msg ' + (type === 'success' ? 'success' : 'error');
      el.style.display = 'block';
      if(window.__messageTimer) clearTimeout(window.__messageTimer);
      window.__messageTimer = setTimeout(() => { el.style.display = 'none'; }, 3800);
    };

    // Password toggle
    const pw = $('#password');
    const toggle = $('#togglePw');
    toggle.addEventListener('click', () => {
      const isHidden = pw.type === 'password';
      pw.type = isHidden ? 'text' : 'password';
      toggle.textContent = isHidden ? 'Hide' : 'Show';
      toggle.setAttribute('aria-pressed', String(isHidden));
    });

    // Form validation rules
    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const minLen = (v, n) => (v || '').length >= n;

    // localStorage key
    const STORAGE_KEY = 'momentum_users_v1';

    // utility: load/save
    function loadUsers(){
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch(e){ return []; }
    }
    function saveUsers(arr){
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    }

    // On submit
    $('#signupForm').addEventListener('submit', (ev) => {
      ev.preventDefault();
      const firstName = $('#firstName').value.trim();
      const lastName = $('#lastName').value.trim();
      const email = $('#email').value.trim().toLowerCase();
      const password = $('#password').value;
      const agree = $('#agree').checked;

      // client-side validation
      if(!firstName || !lastName){
        showMessage('Please enter your full name.', 'error');
        return;
      }
      if(!isEmail(email)){
        showMessage('Please provide a valid email address.', 'error');
        return;
      }
      if(!minLen(password, 8)){
        showMessage('Password must be at least 8 characters.', 'error');
        return;
      }
      if(!agree){
        showMessage('You must agree to the Terms of Service.', 'error');
        return;
      }

      // Save user to localStorage (simple mock)
      const users = loadUsers();
      const duplicate = users.find(u => u.email === email);
      if(duplicate){
        showMessage('An account with this email already exists.', 'error');
        return;
      }

      const newUser = {
        id: Date.now(),
        firstName, lastName, email,
        createdAt: new Date().toISOString()
        // password intentionally not hashed in mock; do NOT do this in production
      };
      users.push(newUser);
      saveUsers(users);

      // Success UX
      showMessage('Account created — welcome to Momentum!', 'success');
      // Clear the form (but keep email prefilled for convenience)
      $('#firstName').value = '';
      $('#lastName').value = '';
      $('#password').value = '';
      $('#agree').checked = false;

      // small celebratory animation (optional)
      flashCard();
    });

    // mock social buttons
    $('#googleBtn').addEventListener('click', () => {
      showMessage('Google sign-in flow not implemented in this mock.', 'error');
    });
    $('#appleBtn').addEventListener('click', () => {
      showMessage('Apple sign-in flow not implemented in this mock.', 'error');
    });

    // Simple focus animation for card when user signs up
    function flashCard(){
      const c = document.querySelector('.card');
      if(!c) return;
      c.animate([
        { boxShadow: '0 8px 30px rgba(11,11,11,0.12)' },
        { boxShadow: '0 14px 40px rgba(214,90,42,0.22)' },
        { boxShadow: '0 8px 30px rgba(11,11,11,0.12)' }
      ], { duration: 700, easing: 'ease-out' });
    }

    // populate form with last-saved email if present (nice touch)
    (function populateFromLastUser(){
      const users = loadUsers();
      if(users.length>0){
        const last = users[users.length-1];
        $('#email').value = last.email || '';
      }
    })();
