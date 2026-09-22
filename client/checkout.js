const API_BASE_URL = localStorage.getItem('apiBaseUrl') || '/api';
const token = localStorage.getItem('booking_auth_token');
const checkoutItem = JSON.parse(sessionStorage.getItem('checkout_item') || 'null');

const currency = (value) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(value);

const getData = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'ไม่สามารถดำเนินการได้');
  return data;
};

const orderDetails = document.querySelector('#order-details');
const checkoutView = document.querySelector('#checkout-view');
const confirmationView = document.querySelector('#confirmation-view');

function renderSummary() {
  if (!checkoutItem) {
    orderDetails.innerHTML = '<p class="message">ไม่พบรายการจอง กรุณากลับไปเลือกบริการอีกครั้ง</p>';
    document.querySelector('#payment-form').classList.add('hidden');
    return;
  }
  orderDetails.innerHTML = `<div class="order-icon">✦</div><h2>${checkoutItem.name}</h2><p>${checkoutItem.place}</p><p>${checkoutItem.type || ''}</p><ul>${(checkoutItem.details || []).map((detail) => `<li>${detail}</li>`).join('')}</ul><div class="order-total"><span>ยอดชำระ</span><strong>${currency(checkoutItem.price)}</strong></div>`;
}

function renderConfirmation(booking) {
  checkoutView.classList.add('hidden');
  confirmationView.classList.remove('hidden');
  confirmationView.innerHTML = `<p class="eyebrow">BOOKING CONFIRMED</p><h2>ยืนยันการจองเรียบร้อย</h2><p>หมายเลขการจองของคุณคือ</p><strong class="confirmation-reference">${booking.reference}</strong><p>ผู้ให้บริการจะเห็นข้อมูลการจองและสถานะการชำระเงินจากระบบกลาง</p><a class="primary" href="menu.html">กลับสู่เมนู <span>→</span></a>`;
  sessionStorage.removeItem('checkout_item');
}

document.querySelector('#payment-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button[type="submit"]');
  const paymentMethod = new FormData(event.currentTarget).get('payment');
  button.disabled = true;
  try {
    const { booking } = await getData('/service-bookings', { method: 'POST', body: JSON.stringify({ item: checkoutItem, paymentMethod }) });
    renderConfirmation(booking);
  } catch (error) {
    orderDetails.insertAdjacentHTML('beforeend', `<p class="message">${error.message}</p>`);
    button.disabled = false;
  }
});

if (!token) window.location.replace('login.html');
else renderSummary();