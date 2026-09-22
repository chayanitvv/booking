const API_BASE_URL = localStorage.getItem('apiBaseUrl') || 'http://localhost:5000/api';
const tokenKey = 'booking_auth_token';
const authView = document.querySelector('#auth-view');
const profileView = document.querySelector('#profile-view');
const message = document.querySelector('#message');

function showMessage(text, isError = true) {
  message.textContent = text;
  message.classList.toggle('success', !isError);
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
  return data;
}

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((item) => item.classList.toggle('active', item === tab));
    document.querySelector('#login-form').classList.toggle('hidden', tab.dataset.form !== 'login');
    document.querySelector('#register-form').classList.toggle('hidden', tab.dataset.form !== 'register');
    showMessage('');
  });
});

function handleAuth(formId, path) {
  document.querySelector(formId).addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector('button');
    button.disabled = true;
    showMessage('กำลังดำเนินการ...', false);
    try {
      const body = Object.fromEntries(new FormData(event.currentTarget));
      const { token, user } = await request(path, { method: 'POST', body: JSON.stringify(body) });
      localStorage.setItem(tokenKey, token);
      window.location.assign('menu.html');
    } catch (error) {
      showMessage(error.message);
    } finally {
      button.disabled = false;
    }
  });
}

handleAuth('#login-form', '/auth/login');
handleAuth('#register-form', '/auth/register');

(async () => {
  const token = localStorage.getItem(tokenKey);
  if (!token) return;
  try {
    await request('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
    window.location.replace('menu.html');
  } catch {
    localStorage.removeItem(tokenKey);
  }
})();
