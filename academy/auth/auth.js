/* ============================================================
   GATEWAY ACADEMY — AUTH MODULE
   academy/auth/auth.js

   Requires:  ../../assets/js/config.js  (loaded before this file)
              Supabase JS v2 from CDN

   SECURITY RULES:
   - Passwords are never logged or stored beyond what is needed
     for the Supabase call.
   - Auth tokens are handled entirely by Supabase — we do NOT
     manually store tokens in localStorage.
   - Auth state is checked on every protected page load via
     GatewayAuth.requireSession().
   ============================================================ */

// Initialise Supabase client (uses constants from config.js)
const { createClient } = supabase;
const _sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const GatewayAuth = (() => {

  /* ----------------------------------------------------------
     HELPERS
  ---------------------------------------------------------- */
  function _showError(elId, msg) {
    const el = document.getElementById(elId);
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }
  function _clearError(elId) {
    const el = document.getElementById(elId);
    if (el) { el.textContent = ''; el.style.display = 'none'; }
  }
  function _setLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.disabled = loading;
    btn.dataset.originalText = btn.dataset.originalText || btn.textContent;
    btn.textContent = loading ? 'Please wait…' : btn.dataset.originalText;
  }

  /* ----------------------------------------------------------
     SESSION GUARD
     Call on every page that requires a logged-in user.
     Redirects to login.html immediately if no active session.
  ---------------------------------------------------------- */
  async function requireSession() {
    const { data: { session } } = await _sb.auth.getSession();
    if (!session) {
      window.location.href = 'login.html';
    }
    return session;
  }

  /* ----------------------------------------------------------
     GET CURRENT USER (non-redirecting)
  ---------------------------------------------------------- */
  async function getUser() {
    const { data: { user } } = await _sb.auth.getUser();
    return user;
  }

  /* ----------------------------------------------------------
     LOGIN
     elIds: { emailId, passwordId, btnId, errorId }
     onSuccess: callback(session) — default redirects to dashboard
  ---------------------------------------------------------- */
  async function login({ emailId, passwordId, btnId, errorId, onSuccess }) {
    _clearError(errorId);
    const email    = document.getElementById(emailId)?.value?.trim();
    const password = document.getElementById(passwordId)?.value;

    if (!email || !password) {
      _showError(errorId, 'Please enter your email and password.');
      return;
    }

    _setLoading(btnId, true);
    const { data, error } = await _sb.auth.signInWithPassword({ email, password });
    _setLoading(btnId, false);

    if (error) {
      _showError(errorId, error.message || 'Login failed. Please try again.');
      return;
    }

    if (onSuccess) {
      onSuccess(data.session);
    } else {
      window.location.href = '../dashboard.html';
    }
  }

  /* ----------------------------------------------------------
     SIGN UP
     elIds: { fullNameId, emailId, phoneId, passwordId, confirmPasswordId, btnId, errorId, successId }
     onSuccess: callback(user) — default shows email confirmation message
  ---------------------------------------------------------- */
  async function signup({ fullNameId, emailId, phoneId, passwordId, confirmPasswordId, btnId, errorId, successId, onSuccess }) {
    _clearError(errorId);
    const fullName = document.getElementById(fullNameId)?.value?.trim();
    const email    = document.getElementById(emailId)?.value?.trim();
    const phone    = document.getElementById(phoneId)?.value?.trim();
    const password = document.getElementById(passwordId)?.value;
    const confirm  = document.getElementById(confirmPasswordId)?.value;

    if (!fullName || !email || !password || !confirm) {
      _showError(errorId, 'Please fill in all required fields.');
      return;
    }
    if (password !== confirm) {
      _showError(errorId, 'Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      _showError(errorId, 'Password must be at least 8 characters.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      _showError(errorId, 'Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[0-9]/.test(password)) {
      _showError(errorId, 'Password must contain at least one number.');
      return;
    }

    _setLoading(btnId, true);
    const { data, error } = await _sb.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone: phone || '' }
      }
    });
    _setLoading(btnId, false);

    if (error) {
      _showError(errorId, error.message || 'Sign-up failed. Please try again.');
      return;
    }

    if (onSuccess) {
      onSuccess(data.user);
    } else {
      // Show email-confirmation message; hide the form
      const formEl = document.getElementById('signup-form');
      if (formEl) formEl.style.display = 'none';
      const successEl = document.getElementById(successId);
      if (successEl) successEl.style.display = 'block';
    }
  }

  /* ----------------------------------------------------------
     FORGOT PASSWORD
     Sends a password-reset email.
     Never confirms/denies whether the email exists.
  ---------------------------------------------------------- */
  async function forgotPassword({ emailId, btnId, errorId, successId }) {
    _clearError(errorId);
    const email = document.getElementById(emailId)?.value?.trim();

    if (!email) {
      _showError(errorId, 'Please enter your email address.');
      return;
    }

    _setLoading(btnId, true);
    // We fire the request regardless of whether the address exists
    await _sb.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/academy/auth/reset-password.html'
    });
    _setLoading(btnId, false);

    // Always show the same success message
    const formEl  = document.getElementById('forgot-form');
    if (formEl)  formEl.style.display = 'none';
    const successEl = document.getElementById(successId);
    if (successEl) successEl.style.display = 'block';
  }

  /* ----------------------------------------------------------
     RESET PASSWORD
     Must be called after detecting the SIGNED_IN recovery event
     via onAuthStateChange (see reset-password.html).
  ---------------------------------------------------------- */
  async function resetPassword({ passwordId, confirmPasswordId, btnId, errorId, successId }) {
    _clearError(errorId);
    const password = document.getElementById(passwordId)?.value;
    const confirm  = document.getElementById(confirmPasswordId)?.value;

    if (!password || !confirm) {
      _showError(errorId, 'Please fill in both password fields.');
      return;
    }
    if (password !== confirm) {
      _showError(errorId, 'Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      _showError(errorId, 'Password must be at least 8 characters.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      _showError(errorId, 'Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[0-9]/.test(password)) {
      _showError(errorId, 'Password must contain at least one number.');
      return;
    }

    _setLoading(btnId, true);
    const { error } = await _sb.auth.updateUser({ password });
    _setLoading(btnId, false);

    if (error) {
      _showError(errorId, error.message || 'Could not update password. Please try again.');
      return;
    }

    const formEl = document.getElementById('reset-form');
    if (formEl) formEl.style.display = 'none';
    const successEl = document.getElementById(successId);
    if (successEl) successEl.style.display = 'block';
  }

  /* ----------------------------------------------------------
     SIGN OUT
  ---------------------------------------------------------- */
  async function signOut(redirectTo = '../../index.html') {
    await _sb.auth.signOut();
    window.location.href = redirectTo;
  }

  /* ----------------------------------------------------------
     LISTEN FOR AUTH STATE CHANGES
     Used by reset-password.html to detect the recovery token.
  ---------------------------------------------------------- */
  function onAuthStateChange(callback) {
    return _sb.auth.onAuthStateChange(callback);
  }

  return { requireSession, getUser, login, signup, forgotPassword, resetPassword, signOut, onAuthStateChange, _sb };
})();
