// Initial Data
const INITIAL_VEHICLES = {
  'mercedes': {
    id:'mercedes', name:'Mercedes-Benz E-Class', reg:'FX19FXC', year:2019,
    fuel:'Diesel', mileage:127000, status:'active',
    nextService:'2026-08-26', nextMOT:'2026-07-25', insurance:'2026-09-16',
    notes:'Very good looking addday car',
    services:[
      {id: 1, type:'oil', typeName:'Oil Change', date:'2026-06-25', notes:'Oil changed and was very dirty before', garage:'Auto Surgeon', mileage:120000, cost:50, status:'completed'}
    ]
  },
  'toyota-corolla': {
    id:'toyota-corolla', name:'Toyota Corolla Estate', reg:'LK71 DEF', year:2022,
    fuel:'Hybrid', mileage:600000, status:'in-service',
    nextService:'2026-07-12', nextMOT:'', insurance:'',
    notes:'',
    services:[
      {id: 2, type:'full', typeName:'Full Service', date:'2026-06-25', notes:'Done by auto surgeon', garage:'The Auto Surgeon', mileage:600000, cost:20, status:'completed'}
    ]
  }
};

const INITIAL_MILEAGE = [
  {
    id: 1,
    driver: 'Areeb',
    vehicleId: 'mercedes',
    startMiles: 120000,
    currentMiles: 124000,
    allowance: 5000,
    startDate: '2026-07-25',
    logs: [
        {date: '2026-07-25', miles: 120000},
        {date: '2026-07-26', miles: 124000}
    ]
  }
];

// Data Management
const DataStore = {
    get: (key) => JSON.parse(localStorage.getItem('vch_' + key)),
    set: (key, val) => localStorage.setItem('vch_' + key, JSON.stringify(val)),
    init: () => {
        if (!DataStore.get('vehicles')) DataStore.set('vehicles', INITIAL_VEHICLES);
        if (!DataStore.get('mileage')) DataStore.set('mileage', INITIAL_MILEAGE);
        if (!DataStore.get('user')) DataStore.set('user', null);
    }
};

// Initialize
DataStore.init();

// UI Utilities
function showToast(msg, type='success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    const icon = toast.querySelector('.toast-icon');
    document.getElementById('toast-text').textContent = msg;
    toast.className = 'toast ' + type + ' show';
    icon.className = 'fa-solid toast-icon ' + (type==='success'?'fa-circle-check':type==='error'?'fa-circle-xmark':'fa-circle-info');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebar-overlay').classList.toggle('open');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('open');
}

function checkAuth() {
    const user = DataStore.get('user');
    const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    if (!user && !isLoginPage) {
        window.location.href = 'index.html';
    } else if (user && isLoginPage) {
        window.location.href = 'vehicles.html';
    }
}

function signOut() {
    DataStore.set('user', null);
    window.location.href = 'index.html';
}

// Confirm Delete Utility
let deleteCallback = null;
function confirmDelete(message, callback) {
    const modal = document.getElementById('delete-modal');
    document.getElementById('delete-modal-text').textContent = message;
    deleteCallback = callback;
    modal.classList.add('open');
}

function executeDelete() {
    if (deleteCallback) deleteCallback();
    closeModal('delete-modal');
    deleteCallback = null;
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

// Vehicle Lookup Simulation (Faster)
async function lookupVehicle(reg) {
    return new Promise(resolve => {
        setTimeout(() => {
            const mockData = {
                'FX19FXC': { make: 'Mercedes-Benz', model: 'E-Class', year: 2019, fuel: 'Diesel' },
                'LK71DEF': { make: 'Toyota', model: 'Corolla Estate', year: 2022, fuel: 'Hybrid' },
                'LP74GHI': { make: 'Toyota', model: 'Prius', year: 2024, fuel: 'Hybrid' },
                'LN70JKL': { make: 'Hyundai', model: 'IONIQ', year: 2021, fuel: 'Hybrid' }
            };
            resolve(mockData[reg.replace(/\s/g, '').toUpperCase()] || null);
        }, 300); // Faster lookup
    });
}

// Helper to format vehicle for select
function formatVehicleOption(v) {
    return `${v.reg} (${v.name})`;
}
