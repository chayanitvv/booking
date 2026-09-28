const menuToken = localStorage.getItem('booking_auth_token');
if (!menuToken) window.location.replace('login.html');
document.querySelector('#logout').addEventListener('click', () => { localStorage.removeItem('booking_auth_token'); window.location.assign('login.html'); });
