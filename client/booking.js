const API_BASE_URL = localStorage.getItem('apiBaseUrl') || '/api';
const token = localStorage.getItem('booking_auth_token');
let selectedFlight;
let currentUser;

const getData = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'ไม่สามารถดำเนินการได้');
  return data;
};

const currency = (value) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(value);
const time = (value) => new Intl.DateTimeFormat('th-TH', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));

function selectFlight(flight) {
  selectedFlight = flight;
  const availableSeat = flight.seats.find((seat) => !seat.isBooked);
  document.querySelector('#empty-selection').classList.add('hidden');
  document.querySelector('#selected-flight').classList.remove('hidden');
  document.querySelector('#selection-route').textContent = `${flight.departure.city} → ${flight.arrival.city}`;
  document.querySelector('#selection-flight').textContent = `${flight.airline} · ${flight.flightNumber} · ที่นั่ง ${availableSeat.seatNumber}`;
  document.querySelector('#selection-time').textContent = `${time(flight.departure.time)} – ${time(flight.arrival.time)}`;
  document.querySelector('#selection-price').textContent = currency(availableSeat.price);
  document.querySelector('#booking-message').textContent = '';
}

function renderFlights(flights) {
  const results = document.querySelector('#flight-results');
  document.querySelector('#flight-count').textContent = `${flights.length} เที่ยวบิน`;
  if (!flights.length) { results.innerHTML = '<p class="loading">ไม่พบเที่ยวบินในเส้นทางนี้ ลองเปลี่ยนต้นทางหรือปลายทาง</p>'; return; }
  results.innerHTML = flights.map((flight) => {
    const seat = flight.seats.find((item) => !item.isBooked);
    if (!seat) return '';
    return `<article class="flight-card"><div class="airline"><span>✦</span><div><strong>${flight.airline}</strong><small>${flight.flightNumber} · Economy</small></div></div><div class="flight-times"><strong>${time(flight.departure.time)}</strong><span>${flight.departure.city}</span></div><div class="flight-line"><i></i><small>${flight.durationMinutes} นาที</small><i></i></div><div class="flight-times"><strong>${time(flight.arrival.time)}</strong><span>${flight.arrival.city}</span></div><div class="flight-price"><small>เริ่มต้น</small><strong>${currency(seat.price)}</strong><button type="button" data-flight-id="${flight._id}">เลือก</button></div></article>`;
  }).join('');
  results.querySelectorAll('[data-flight-id]').forEach((button) => button.addEventListener('click', () => selectFlight(flights.find((flight) => flight._id === button.dataset.flightId))));
}

async function searchFlights() {
  const from = document.querySelector('#from').value;
  const to = document.querySelector('#to').value;
  if (from === to) { document.querySelector('#flight-results').innerHTML = '<p class="loading">กรุณาเลือกต้นทางและปลายทางที่ต่างกัน</p>'; return; }
  const { flights } = await getData(`/flights?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  renderFlights(flights);
}

document.querySelector('#search-form').addEventListener('submit', (event) => { event.preventDefault(); searchFlights().catch((error) => { document.querySelector('#flight-results').textContent = error.message; }); });
document.querySelector('#book-button').addEventListener('click', () => { if (!selectedFlight) return; const seat = selectedFlight.seats.find((item) => !item.isBooked); sessionStorage.setItem('checkout_item', JSON.stringify({ kind: 'flight', name: `${selectedFlight.airline} ${selectedFlight.flightNumber}`, place: `${selectedFlight.departure.city} → ${selectedFlight.arrival.city}`, type: `ออกเดินทาง ${time(selectedFlight.departure.time)} · ถึง ${time(selectedFlight.arrival.time)}`, price: seat.price, details: [`เที่ยวบิน ${selectedFlight.flightNumber}`, `ที่นั่ง ${seat.seatNumber} · Economy`, `ระยะเวลา ${selectedFlight.durationMinutes} นาที`] })); window.location.assign('checkout.html'); });
document.querySelector('#close-modal').addEventListener('click', () => document.querySelector('#passenger-modal').classList.add('hidden'));
document.querySelector('#logout').addEventListener('click', () => { localStorage.removeItem('booking_auth_token'); window.location.assign('login.html'); });
document.querySelector('#booking-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button[type="submit"]'); button.disabled = true;
  try {
    const seat = selectedFlight.seats.find((item) => !item.isBooked);
    const { booking } = await getData('/bookings/flight', { method: 'POST', body: JSON.stringify({ flightId: selectedFlight._id, seatNumber: seat.seatNumber, passenger: { firstName: document.querySelector('#passenger-first-name').value, lastName: document.querySelector('#passenger-last-name').value, passportNo: document.querySelector('#passenger-passport').value } }) });
    document.querySelector('#passenger-modal').classList.add('hidden');
    document.querySelector('#booking-message').classList.add('success');
    document.querySelector('#booking-message').textContent = `จองสำเร็จแล้ว · ${booking.flightNumber} ที่นั่ง ${booking.seatNumber}`;
    await searchFlights();
  } catch (error) { document.querySelector('#booking-message').textContent = error.message; } finally { button.disabled = false; }
});

(async () => {
  if (!token) { window.location.replace('login.html'); return; }
  try {
    const { user } = await getData('/auth/me'); currentUser = user;
    document.querySelector('#user-name').textContent = `${user.profile.firstName} ${user.profile.lastName}`;
    document.querySelector('#passenger-first-name').value = user.profile.firstName;
    document.querySelector('#passenger-last-name').value = user.profile.lastName;
    document.querySelector('#passenger-passport').value = user.profile.passportNo || '';
    await searchFlights();
  } catch { localStorage.removeItem('booking_auth_token'); window.location.replace('login.html'); }
})();
