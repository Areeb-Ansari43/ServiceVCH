// ===== DATA STORAGE =====
const CREDENTIALS = {
  'AAnsari100@outlook.com': 'MFvpfkqH9kZckqj',
  'admin@virtualcarhire.com': 'fleet2024',
  'fleet@vch.com': 'fleet2024'
};

// Initialize data from localStorage or use defaults
let VEHICLES = JSON.parse(localStorage.getItem('vehicles')) || {
  'mercedes': {
    id: 'mercedes', name: 'Mercedes-Benz E-Class', reg: 'FX19FXC', year: 2019,
    fuel: 'Diesel', mileage: '127,000 mi', status: 'active',
    nextService: '26 Aug 2026', nextMOT: '25 Jul 2026', insurance: '16 Sep 2026',
    notes: 'Very good looking addday car',
    services: [
      { type: 'oil', typeName: 'Oil Change', date: '25 Jun 2026', notes: 'Oil changed and was very dirty before', garage: 'Auto Surgeon', mileage: '120,000 mi', cost: '£50', status: 'completed' }
    ]
  },
  'toyota-corolla': {
    id: 'toyota-corolla', name: 'Toyota Corolla Estate', reg: 'LK71 DEF', year: 2022,
    fuel: 'Hybrid', mileage: '600,000 mi', status: 'in-service',
    nextService: '12 Jul 2026', nextMOT: '—', insurance: '—',
    notes: '',
    services: [
      { type: 'full', typeName: 'Full Service', date: '25 Jun 2026', notes: 'DOne abyans poo', garage: 'The Auto Surgeon', mileage: '600,000 mi', cost: '£20', status: 'completed' },
      { type: 'full', typeName: 'Full Service', date: '25 Jun 2025', notes: 'Interim service. Oil and filter change, fluid checks, tyre rotation.', garage: 'Toyota Isleworth', mileage: '62,000 mi', cost: '£195', status: 'in-progress' }
    ]
  },
  'toyota-prius': {
    id: 'toyota-prius', name: 'Toyota Prius', reg: 'LP74 GHI', year: 2024,
    fuel: 'Hybrid', mileage: '12,800 mi', status: 'active',
    nextService: '30 Sep 2025', nextMOT: '—', insurance: '—',
    notes: '',
    services: [
      { type: 'battery', typeName: 'Battery Check', date: '5 May 2025', notes: 'Hybrid battery health check — all within spec.', garage: 'Toyota Isleworth', mileage: '11,500 mi', cost: '—', status: 'completed' }
    ]
  },
  'hyundai-ioniq': {
    id: 'hyundai-ioniq', name: 'Hyundai IONIQ', reg: 'LN70 JKL', year: 2021,
    fuel: 'Hybrid', mileage: '78,500 mi', status: 'active',
    nextService: '10 Jul 2025', nextMOT: '—', insurance: '—',
    notes: '',
    services: [
      { type: 'oil', typeName: 'Oil Change', date: '10 Jun 2025', notes: 'Standard oil and filter change.', garage: 'Kwik Fit Feltham', mileage: '77,000 mi', cost: '£89', status: 'completed' },
      { type: 'diag', typeName: 'Diagnostic', date: '18 Feb 2025', notes: 'Diagnostic scan for engine warning light — resolved sensor fault.', garage: 'Hounslow Service Centre', mileage: '72,000 mi', cost: '£65', status: 'completed' }
    ]
  }
};

let MILEAGE_LOGS = JSON.parse(localStorage.getItem('mileageLogs')) || [
  { id: 'log-1', driver: 'Areeb', vehicle: 'mercedes', startMileage: 120000, currentMileage: 124000, allowance: 5000, charge: 0.20, startDate: '25 Jul 2026' }
];

let SERVICE_LOGS = JSON.parse(localStorage.getItem('serviceLogs')) || [];

const TYPE_ICONS = {
  oil: 'fa-oil-can', full: 'fa-star', mot: 'fa-clipboard-check',
  battery: 'fa-battery-full', brake: 'fa-circle-stop', diag: 'fa-stethoscope', other: 'fa-wrench'
};

// ===== SAVE DATA TO LOCALSTORAGE =====
function saveData() {
  localStorage.setItem('vehicles', JSON.stringify(VEHICLES));
  localStorage.setItem('mileageLogs', JSON.stringify(MILEAGE_LOGS));
  localStorage.setItem('serviceLogs', JSON.stringify(SERVICE_LOGS));
}

// ===== AUTH =====
function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value;
  const err = document.getElementById('login-error');
  if (CREDENTIALS[email] && CREDENTIALS[email] === pass) {
    err.style.display = 'none';
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userEmail', email);
    window.location.href = 'pages/dashboard.html';
  } else {
    err.style.display = 'block';
  }
}

function signOut() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('userEmail');
  window.location.href = '../index.html';
}

// ===== NAVIGATION =====
function navigate(page) {
  window.location.href = page + '.html';
}

// ===== VEHICLE FUNCTIONS =====
function addVehicle() {
  const reg = document.getElementById('new-reg').value.trim().toUpperCase();
  const make = document.getElementById('new-make').value.trim();
  const model = document.getElementById('new-model').value.trim();
  const year = document.getElementById('new-year').value;
  const fuel = document.getElementById('new-fuel').value;
  const mileage = document.getElementById('new-mileage').value;
  const status = document.getElementById('new-status').value;
  const nextService = document.getElementById('new-next-service').value;
  const nextMOT = document.getElementById('new-next-mot').value;
  const insurance = document.getElementById('new-insurance').value;
  const notes = document.getElementById('new-notes').value;

  if (!reg || !make || !model) {
    showToast('Please fill in required fields', 'error');
    return;
  }

  const vehicleId = make.toLowerCase().replace(/\s+/g, '-') + '-' + model.toLowerCase().replace(/\s+/g, '-');
  VEHICLES[vehicleId] = {
    id: vehicleId,
    name: make + ' ' + model,
    reg: reg,
    year: year || new Date().getFullYear(),
    fuel: fuel,
    mileage: mileage ? mileage.toLocaleString() + ' mi' : '0 mi',
    status: status,
    nextService: nextService || '—',
    nextMOT: nextMOT || '—',
    insurance: insurance || '—',
    notes: notes,
    services: []
  };

  saveData();
  showToast('Vehicle added successfully!', 'success');
  setTimeout(() => navigate('vehicles'), 1500);
}

function deleteVehicle(vehicleId) {
  delete VEHICLES[vehicleId];
  saveData();
  showToast('Vehicle deleted successfully!', 'success');
  setTimeout(() => navigate('vehicles'), 1500);
}

function lookupReg() {
  const reg = document.getElementById('new-reg').value.trim().toUpperCase();
  if (!reg) {
    showToast('Enter a registration number first', 'error');
    return;
  }
  showToast('Looking up ' + reg + '...', 'info');
  // Simulate lookup
  setTimeout(() => {
    document.getElementById('new-make').value = 'Toyota';
    document.getElementById('new-model').value = 'Corolla';
    document.getElementById('new-year').value = '2023';
    showToast('Vehicle details populated!', 'success');
  }, 1500);
}

// ===== SERVICE FUNCTIONS =====
function logService() {
  const vehicle = document.getElementById('log-vehicle').value;
  const type = document.getElementById('log-type').value;
  const date = document.getElementById('log-date').value;
  const cost = document.getElementById('log-cost').value;
  const garage = document.getElementById('log-garage').value;
  const mileage = document.getElementById('log-mileage').value;
  const status = document.getElementById('log-status').value;
  const notes = document.getElementById('log-notes').value;

  if (!vehicle || !type || !date) {
    showToast('Please fill in required fields', 'error');
    return;
  }

  const vehicleObj = VEHICLES[vehicle];
  if (vehicleObj) {
    vehicleObj.services.push({
      type: type,
      typeName: getServiceTypeName(type),
      date: formatDate(date),
      notes: notes,
      garage: garage,
      mileage: mileage ? mileage.toLocaleString() + ' mi' : '—',
      cost: cost ? '£' + cost : '—',
      status: status
    });
    saveData();
    showToast('Service logged successfully!', 'success');
    setTimeout(() => navigate('services'), 1500);
  }
}

function deleteService(vehicleId, serviceIndex) {
  if (VEHICLES[vehicleId] && VEHICLES[vehicleId].services[serviceIndex]) {
    VEHICLES[vehicleId].services.splice(serviceIndex, 1);
    saveData();
    showToast('Service deleted successfully!', 'success');
    location.reload();
  }
}

function getServiceTypeName(type) {
  const names = {
    oil: 'Oil Change', full: 'Full Service', mot: 'MOT',
    battery: 'Battery Check', brake: 'Brake Service', diag: 'Diagnostic', other: 'Other'
  };
  return names[type] || 'Service';
}

// ===== MILEAGE FUNCTIONS =====
function saveMileage() {
  const driver = document.getElementById('track-driver').value.trim();
  const vehicle = document.getElementById('track-vehicle').value;
  const startMileage = parseInt(document.getElementById('track-start').value);
  const currentMileage = parseInt(document.getElementById('track-current').value);
  const allowance = parseInt(document.getElementById('track-allowance').value);
  const charge = parseFloat(document.getElementById('track-charge').value);
  const startDate = document.getElementById('track-start-date').value;

  if (!driver || !vehicle) {
    showToast('Please fill in required fields', 'error');
    return;
  }

  const logId = 'log-' + Date.now();
  MILEAGE_LOGS.push({
    id: logId,
    driver: driver,
    vehicle: vehicle,
    startMileage: startMileage,
    currentMileage: currentMileage,
    allowance: allowance,
    charge: charge,
    startDate: startDate || new Date().toISOString().split('T')[0]
  });

  saveData();
  showToast('Mileage tracking saved!', 'success');
  setTimeout(() => navigate('mileage'), 1500);
}

function logMiles(logId) {
  const newMileage = prompt('Enter current mileage:');
  if (newMileage !== null && newMileage.trim()) {
    const log = MILEAGE_LOGS.find(l => l.id === logId);
    if (log) {
      log.currentMileage = parseInt(newMileage);
      SERVICE_LOGS.push({
        id: 'service-' + Date.now(),
        logId: logId,
        mileage: parseInt(newMileage),
        date: new Date().toISOString().split('T')[0]
      });
      saveData();
      showToast('Mileage logged successfully!', 'success');
      location.reload();
    }
  }
}

function deleteMileageLog(logId) {
  const index = MILEAGE_LOGS.findIndex(l => l.id === logId);
  if (index !== -1) {
    MILEAGE_LOGS.splice(index, 1);
    saveData();
    showToast('Mileage log deleted successfully!', 'success');
    location.reload();
  }
}

// ===== MODALS =====
function confirmDelete(name, callback) {
  const modal = document.getElementById('delete-modal');
  document.getElementById('delete-modal-text').textContent = 'Are you sure you want to delete "' + name + '"? This action cannot be undone.';
  document.getElementById('delete-confirm-btn').onclick = () => {
    callback();
    closeModal('delete-modal');
  };
  modal.classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// ===== TOAST =====
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  const icon = toast.querySelector('.toast-icon');
  document.getElementById('toast-text').textContent = msg;
  toast.className = 'toast ' + type;
  icon.className = 'fa-solid toast-icon ' + (type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== SIDEBAR =====
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}

// ===== UTILITIES =====
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function checkAuth() {
  if (!localStorage.getItem('loggedIn')) {
    window.location.href = '../index.html';
  }
}

// Close modals on overlay click
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => {
      if (e.target === o) o.classList.remove('open');
    });
  });

  // Setup hamburger menu
  const hamburger = document.querySelector('.hamburger');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  if (hamburger) {
    hamburger.addEventListener('click', toggleSidebar);
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // Setup nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', closeSidebar);
  });

  // Setup login
  const loginEmail = document.getElementById('login-email');
  const loginPassword = document.getElementById('login-password');
  if (loginEmail) {
    loginEmail.addEventListener('keydown', e => {
      if (e.key === 'Enter') doLogin();
    });
  }
  if (loginPassword) {
    loginPassword.addEventListener('keydown', e => {
      if (e.key === 'Enter') doLogin();
    });
  }
});
