const API_BASE_URL = localStorage.getItem('apiBaseUrl') || '/api';
let bookings = [];
const currency = (value) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(value);
const dateTime = (value) => new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
const labels = { flight: 'เที่ยวบิน', stay: 'ที่พัก', car: 'รถเช่า' };
const statusLabels = { paid: 'ชำระเงินแล้ว', pending: 'รอชำระเงิน' };

function renderBookings() {
  const search = document.querySelector('#booking-search').value.trim().toLowerCase();
  const type = document.querySelector('#service-filter').value;
  const visible = bookings.filter((booking) => {
    const values = [booking.reference, booking.customer.name, booking.customer.email];
    return (!search || values.some((value) => value.toLowerCase().includes(search))) && (!type || booking.serviceType === type);
  });
  const list = document.querySelector('#booking-list');
  if (!visible.length) { list.innerHTML = '<p class="loading">ยังไม่พบรายการจองที่ตรงกับเงื่อนไข</p>'; return; }
  list.innerHTML = visible.map((booking) => `<article class="provider-booking"><div class="provider-booking-head"><div><span class="booking-kind">${labels[booking.serviceType] || booking.serviceType}</span><h2>${booking.serviceName}</h2><p>${booking.location}</p></div><div class="provider-reference"><small>หมายเลขการจอง</small><strong>${booking.reference}</strong><time>${dateTime(booking.createdAt)}</time></div></div><div class="provider-booking-grid"><div><small>ข้อมูลผู้จอง</small><strong>${booking.customer.name}</strong><span>${booking.customer.email}</span><span>${booking.customer.phone}</span></div><div><small>รายละเอียดบริการ</small><ul>${booking.serviceDetails.map((detail) => `<li>${detail}</li>`).join('')}</ul></div><div><small>การชำระเงิน</small><strong>${currency(booking.totalAmount)}</strong><span>${booking.paymentMethod}</span><span class="payment-badge ${booking.paymentStatus}">${statusLabels[booking.paymentStatus]}</span></div></div></article>`).join('');
}

async function loadBookings() {
  const message = document.querySelector('#provider-message');
  message.textContent = 'กำลังโหลดข้อมูล...';
  try {
    const response = await fetch(`${API_BASE_URL}/service-bookings`);
    if (!response.ok) throw new Error('ไม่สามารถเชื่อมต่อข้อมูลการจองได้');
    ({ bookings } = await response.json());
    message.textContent = `${bookings.length} รายการจอง`;
    renderBookings();
  } catch (error) {
    message.textContent = error.message;
    document.querySelector('#booking-list').innerHTML = '<p class="loading">กรุณาตรวจสอบว่า API server กำลังทำงานอยู่</p>';
  }
}

document.querySelector('#booking-search').addEventListener('input', renderBookings);
document.querySelector('#service-filter').addEventListener('change', renderBookings);
document.querySelector('#refresh-bookings').addEventListener('click', loadBookings);
loadBookings();