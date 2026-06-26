import React, { useState, useEffect, useMemo } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Link, 
  useNavigate, 
  useParams, 
  useSearchParams,
  Outlet 
} from 'react-router-dom';
import { 
  Car, 
  Wrench, 
  Gauge, 
  PlusCircle, 
  Menu, 
  X, 
  LogOut, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  ChevronRight, 
  Bell, 
  TrendingUp, 
  Settings, 
  ShieldCheck, 
  Droplets, 
  Circle, 
  Zap, 
  BatteryFull, 
  Filter, 
  Snowflake, 
  PaintBucket, 
  MapPin, 
  User, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

// ==========================================
// INJECTED IRONCLAD BACKUP LAYOUT CSS
// ==========================================
const StyleInjection = () => (
  <style>{`
    :root {
      --vch-bg: #07090e;
      --vch-card: #0c0f16;
      --vch-card-hover: #111520;
      --vch-border: rgba(255, 106, 0, 0.15);
      --vch-orange: #ff6a00;
    }
    body {
      background-color: var(--vch-bg) !important;
      color: #f7fafc !important;
      margin: 0 !important;
      font-family: system-ui, -apple-system, sans-serif !important;
    }
    .vch-sidebar {
      width: 260px !important;
      background: var(--vch-card) !important;
      border-right: 1px solid var(--vch-border) !important;
      position: fixed !important;
      top: 0; left: 0; bottom: 0;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      padding: 1.5rem !important;
      z-index: 100;
    }
    .vch-main-content {
      margin-left: 260px !important;
      padding: 2rem !important;
      min-height: 100vh !important;
      background: var(--vch-bg) !important;
    }
    .vch-grid-4 {
      display: grid !important;
      grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
      gap: 1.5rem !important;
    }
    .vch-grid-3 {
      display: grid !important;
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: 1.5rem !important;
    }
    .vch-grid-2 {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 1.5rem !important;
    }
    .vch-card {
      background: var(--vch-card) !important;
      border: 1px solid var(--vch-border) !important;
      border-radius: 1rem !important;
      padding: 1.5rem !important;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    .vch-card:hover {
      border-color: rgba(255, 106, 0, 0.4) !important;
      box-shadow: 0 0 20px rgba(255, 106, 0, 0.15), 0 10px 30px rgba(0,0,0,0.6) !important;
      background: var(--vch-card-hover) !important;
    }
    .vch-btn-orange {
      background: var(--vch-orange) !important;
      color: white !important;
      font-weight: bold !important;
      padding: 0.6rem 1.2rem !important;
      border-radius: 0.75rem !important;
      box-shadow: 0 4px 14px rgba(255, 106, 0, 0.3) !important;
      border: none !important;
      cursor: pointer !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
      text-transform: uppercase !important;
      font-size: 0.75rem !important;
      letter-spacing: 0.05em !important;
    }
    @media (max-width: 1023px) {
      .vch-sidebar { display: none !important; }
      .vch-main-content { margin-left: 0 !important; padding-top: 5rem !important; }
      .vch-grid-4, .vch-grid-3, .vch-grid-2 { grid-template-columns: 1fr !important; }
    }
  `}</style>
);

// ==========================================
// DATA MOCK INFRASTRUCTURE
// ==========================================
const INITIAL_VEHICLES = [
  { id: 'v1', registration: 'RE71 XCV', make: 'Toyota', model: 'Corolla Estate', year: 2021, fuel_type: 'Hybrid', current_mileage: 42500, status: 'Active', next_service_date: '2026-07-15', next_mot_date: '2026-09-20', insurance_expiry: '2026-11-01', notes: 'Primary hire vehicle for long-term contract.' },
  { id: 'v2', registration: 'KV69 LNO', make: 'Tesla', model: 'Model 3 Long Range', year: 2019, fuel_type: 'Electric', current_mileage: 68100, status: 'In Service', next_service_date: '2026-06-20', next_mot_date: '2026-10-12', insurance_expiry: '2026-08-15', notes: 'In shop for routine battery cooling check.' },
  { id: 'v3', registration: 'EA22 UVM', make: 'BMW', model: '320d Touring', year: 2022, fuel_type: 'Diesel', current_mileage: 31000, status: 'Off Road', next_service_date: '2026-05-10', next_mot_date: '2027-03-01', insurance_expiry: '2027-02-25', notes: 'Waiting for mechanical sensor replacement.' }
];

const INITIAL_SERVICES = [
  { id: 's1', vehicle_id: 'v1', service_type: 'Oil Change', service_date: '2026-01-10', mileage_at_service: 38000, cost: 120, garage_name: 'London Auto Repair', description: 'Engine oil and oil filter replaced.', next_service_due: '2026-07-15', status: 'Completed' },
  { id: 's2', vehicle_id: 'v2', service_type: 'Battery Check', service_date: '2026-06-22', mileage_at_service: 68100, cost: 250, garage_name: 'Tesla Service Centre', description: 'Diagnostic test on secondary cell units.', next_service_due: '2026-12-22', status: 'In Progress' },
  { id: 's3', vehicle_id: 'v3', service_type: 'Diagnostic', service_date: '2026-05-10', mileage_at_service: 31000, cost: 95, garage_name: 'Premium Garage West', description: 'Scanned powertrain control module codes.', next_service_due: '2026-06-10', status: 'Completed' }
];

const INITIAL_MILEAGE = [
  { id: 'm1', vehicle_id: 'v1', driver_name: 'Alex Mercer', start_mileage: 40000, current_mileage: 42500, monthly_allowance: 1200, excess_rate_pence: 25, date_started: '2026-04-01', status: 'Active' },
  { id: 'm2', vehicle_id: 'v2', driver_name: 'Sarah Connor', start_mileage: 60000, current_mileage: 68100, monthly_allowance: 2000, excess_rate_pence: 30, date_started: '2026-02-15', status: 'Over Limit' }
];

const loadStorage = (key, initial) => {
  const data = localStorage.getItem(`vch_${key}`);
  return data ? JSON.parse(data) : initial;
};

const saveStorage = (key, data) => {
  localStorage.setItem(`vch_${key}`, JSON.stringify(data));
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const calculateMonthsElapsed = (startDateStr) => {
  const start = new Date(startDateStr);
  const now = new Date();
  const diffTime = Math.abs(now - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.ceil(diffDays / 30.4));
};

const isWithin30DaysOrOverdue = (dateStr) => {
  if (!dateStr) return { matches: false, overdue: false };
  const d = new Date(dateStr);
  const now = new Date();
  now.setHours(0,0,0,0); d.setHours(0,0,0,0);
  const diffDays = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  return { matches: diffDays <= 30, overdue: diffDays < 0 };
};

const AppContext = React.createContext(null);

export function AppProvider({ children }) {
  const [vehicles, setVehicles] = useState(() => loadStorage('vehicles', INITIAL_VEHICLES));
  const [services, setServices] = useState(() => loadStorage('services', INITIAL_SERVICES));
  const [mileages, setMileages] = useState(() => loadStorage('mileages', INITIAL_MILEAGE));
  const [toasts, setToasts] = useState([]);

  useEffect(() => saveStorage('vehicles', vehicles), [vehicles]);
  useEffect(() => saveStorage('services', services), [services]);
  useEffect(() => saveStorage('mileages', mileages), [mileages]);

  const showToast = (title, description) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, title, description }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const computeMileageCalculations = (rec) => {
    const totalMiles = Math.max(0, rec.current_mileage - rec.start_mileage);
    const months = calculateMonthsElapsed(rec.date_started);
    const totalAllowance = (rec.monthly_allowance || 5000) * months;
    const excessMiles = Math.max(0, totalMiles - totalAllowance);
    const rate = rec.excess_rate_pence || 20;
    const excessCharge = (excessMiles * rate) / 100;
    return { totalMiles, months, totalAllowance, excessMiles, excessCharge };
  };

  return (
    <AppContext.Provider value={{
      vehicles, setVehicles, services, setServices, mileages, setMileages,
      toasts, showToast, computeMileageCalculations
    }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 space-y-2 w-72">
        {toasts.map(t => (
          <div key={t.id} className="bg-[#121620] border border-[#ff6a00]/40 p-3 rounded-xl shadow-lg flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-white">{t.title}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{t.description}</p>
            </div>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

const useApp = () => React.useContext(AppContext);

// Premium Neon Glow Logo Component (Matching Your Asset Identity)
function LogoComponent({ inline = false }) {
  return (
    <div className={`flex ${inline ? 'items-center gap-3' : 'flex-col items-center text-center'} p-1 group`}>
      <div className="w-14 h-11 flex items-center justify-center bg-black/50 rounded-xl border border-[#ff6a00]/30 shadow-[0_0_12px_rgba(255,106,0,0.2)]">
        <svg className="w-10 h-7 filter drop-shadow-[0_0_3px_#ff6a00]" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 32C15 32 25 15 50 15C75 15 85 32 85 32" stroke="#ff6a00" strokeWidth="4.5" strokeLinecap="round"/>
          <circle cx="30" cy="32" r="7" stroke="#ff6a00" strokeWidth="3.5" fill="#0c0f16"/>
          <circle cx="70" cy="32" r="7" stroke="#ff6a00" strokeWidth="3.5" fill="#0c0f16"/>
          <path d="M37 32H63" stroke="#ff6a00" strokeWidth="4"/>
        </svg>
      </div>
      <div className={inline ? 'text-left' : 'mt-2'}>
        <h1 className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-white via-[#ffaa66] to-[#ff6a00] bg-clip-text text-transparent">
          Virtual Car Hire
        </h1>
        <p className="text-[8px] tracking-[0.2em] font-bold text-[#ff6a00] uppercase block mt-0.5">
          Fleet Tracker
        </p>
      </div>
    </div>
  );
}

function UKPlate({ registration, size = 'md' }) {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 max-w-[90px]',
    md: 'text-xs px-2.5 py-1 max-w-[120px]',
    lg: 'text-lg px-4 py-1.5 max-w-[180px]'
  };
  return (
    <div className={`flex items-stretch border border-black rounded bg-amber-400 font-bold overflow-hidden select-none ${sizeClasses[size]}`} style={{ fontFamily: 'sans-serif' }}>
      <div className="bg-blue-800 text-white flex flex-col justify-center items-center px-0.5 text-[6px] leading-tight -ml-1.5 mr-1.5">
        <span className="scale-70 block font-bold">UK</span>
      </div>
      <div className="flex-1 text-center tracking-wider uppercase whitespace-nowrap text-slate-900 font-black">
        {registration || 'REG'}
      </div>
    </div>
  );
}

function VehicleStatusBadge({ status }) {
  const configs = {
    'Active': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'In Service': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'Off Road': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Retired': 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${configs[status]}`}>
      <span className="w-1 h-1 rounded-full bg-current" />
      {status}
    </span>
  );
}

function ServiceTypeBadge({ type }) {
  const config = SERVICE_TYPE_CONFIGS[type] || SERVICE_TYPE_CONFIGS['Other'];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${config.color}`}>
      <Icon size={10} />
      {type}
    </span>
  );
}

// ==========================================
// CORE APP WRAPPER & NAV INTERFACE
// ==========================================
function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    { label: 'Dashboard', path: '/', icon: Car },
    { label: 'Vehicles Portfolio', path: '/vehicles', icon: Car },
    { label: 'Service Ledger', path: '/services', icon: Wrench },
    { label: 'Driver Mileage', path: '/mileage', icon: Gauge },
    { label: 'Add Vehicle', path: '/vehicles/new', icon: PlusCircle },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f7fafc] antialiased">
      <StyleInjection />
      
      {/* Structural Desktop Sidebar Container */}
      <aside className="vch-sidebar">
        <div className="space-y-6">
          <LogoComponent />
          <nav className="space-y-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = window.location.pathname === item.path;
              return (
                <Link
                  key={idx} to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                    isActive 
                      ? 'bg-[#ff6a00]/10 text-[#ff6a00] border-[#ff6a00]/30 shadow-md' 
                      : 'text-gray-400 border-transparent hover:bg-[#161b26] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={12} />}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="space-y-3">
          <button onClick={() => alert("Logged Out")} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold uppercase text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent">
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
          
          <a 
            href="https://virtualcarhire.pages.dev/" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-black/40 border border-[#ff6a00]/20 text-[10px] font-black uppercase tracking-widest text-[#ffaa66] hover:text-[#ff6a00] shadow-md transition-all duration-300"
          >
            <span>Powered by</span>
            <span className="underline decoration-[#ff6a00] decoration-2">Virtual Car Hire</span>
            <ExternalLink size={8} />
          </a>
        </div>
      </aside>

      {/* Mobile Header Box */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0c0f16]/95 backdrop-blur-md border-b border-[#ff6a00]/10 z-40 px-4 flex items-center justify-between">
        <LogoComponent inline />
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-[#ff6a00] bg-[#ff6a00]/10 rounded-xl">
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 pt-20 bg-[#07090e] p-6 flex flex-col justify-between">
          <nav className="space-y-2">
            {navItems.map((item, idx) => (
              <Link key={idx} to={item.path} onClick={() => setMobileMenuOpen(false)} className="block p-3 bg-[#0c0f16] rounded-xl text-xs font-bold uppercase tracking-wider">
                {item.label}
              </Link>
            ))}
          </nav>
          <a href="https://virtualcarhire.pages.dev/" target="_blank" rel="noopener noreferrer" className="block text-center py-3 bg-black/40 border border-[#ff6a00]/30 rounded-xl text-xs font-bold text-[#ffaa66]">
            Powered by Virtual Car Hire
          </a>
        </div>
      )}

      {/* Main Container Wrapper */}
      <main className="vch-main-content">
        <Outlet />
      </main>
    </div>
  );
}

// ==========================================
// PANELS & CONTROLLER COMPONENTS
// ==========================================
function Dashboard() {
  const { vehicles, services, mileages } = useApp();
  const navigate = useNavigate();

  const metrics = useMemo(() => {
    const totalSpent = services.reduce((sum, item) => sum + (item.cost || 0), 0);
    const inService = vehicles.filter(v => v.status === 'In Service').length;
    const active = vehicles.filter(v => v.status === 'Active').length;
    const overdue = vehicles.filter(v => v.next_service_date && isWithin30DaysOrOverdue(v.next_service_date).overdue).length;
    return { totalSpent, inService, active, overdue };
  }, [vehicles, services]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black uppercase tracking-tight">Fleet Dashboard</h2>
        <p className="text-xs text-gray-400 mt-0.5">Real-time telematics and master core metrics overview.</p>
      </div>

      <div className="vch-grid-4">
        <StatCard icon={Car} value={vehicles.length} label="Total Hardware" subText={`${metrics.active} live assets`} />
        <StatCard icon={Wrench} value={metrics.inService} label="In Workshop" subText="Active repair status" />
        <StatCard icon={AlertTriangle} value={metrics.overdue} label="Overdue Deadlines" subText="Requires critical focus" />
        <StatCard icon={TrendingUp} value={`£${metrics.totalSpent.toLocaleString()}`} label="Total Expense Log" subText={`Across ${services.length} records`} />
      </div>

      <div className="vch-grid-3">
        <div className="vch-card lg:col-span-1 flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 pb-2 border-b border-[#ff6a00]/10">Maintenance Deadlines</h3>
          <div className="space-y-2 flex-1 overflow-y-auto max-h-[280px]">
            {vehicles.map(v => (
              <div key={v.id} onClick={() => navigate(`/vehicles/${v.id}`)} className="p-3 bg-black/20 rounded-xl border border-white/5 hover:border-[#ff6a00]/30 transition-all cursor-pointer flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-white">{v.make} {v.model}</p>
                  <span className="text-[10px] font-mono text-gray-400">{v.registration}</span>
                </div>
                <span className="text-xs font-bold text-orange-400">{formatDate(v.next_service_date)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="vch-card lg:col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 pb-2 border-b border-[#ff6a00]/10">Core Fleet Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#ff6a00]/10 text-gray-400">
                  <th className="pb-2 font-bold uppercase">Asset</th>
                  <th className="pb-2 font-bold uppercase">Registration</th>
                  <th className="pb-2 font-bold uppercase">Status</th>
                  <th className="pb-2 font-bold uppercase">Odo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {vehicles.map(v => (
                  <tr key={v.id} onClick={() => navigate(`/vehicles/${v.id}`)} className="hover:bg-white/5 cursor-pointer">
                    <td className="py-2.5 font-bold text-white">{v.make} {v.model}</td>
                    <td className="py-2.5 font-mono font-bold text-[#ff9944]">{v.registration}</td>
                    <td className="py-2.5"><VehicleStatusBadge status={v.status} /></td>
                    <td className="py-2.5 font-bold text-gray-300">{v.current_mileage.toLocaleString()} mi</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Vehicles() {
  const { vehicles } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = vehicles.filter(v => 
    `${v.make} ${v.model} ${v.registration}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">Fleet Asset Portfolio</h2>
          <p className="text-xs text-gray-400 mt-0.5">Manage configuration keys, mileage states, and physical targets.</p>
        </div>
        <button onClick={() => navigate('/vehicles/new')} className="vch-btn-orange">
          <PlusCircle size={14} /> Add New Unit
        </button>
      </div>

      <div className="p-3 bg-[#0c0f16] rounded-xl border border-[#ff6a00]/10">
        <input 
          type="text" placeholder="Filter asset parameters indexing matrix..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#111520] border border-[#ff6a00]/10 rounded-xl px-4 py-2 text-xs focus:outline-none text-white"
        />
      </div>

      <div className="vch-grid-3">
        {filtered.map(v => (
          <div key={v.id} onClick={() => navigate(`/vehicles/${v.id}`)} className="vch-card flex flex-col justify-between h-44 cursor-pointer">
            <div>
              <div className="flex justify-between items-start">
                <VehicleStatusBadge status={v.status} />
                <span className="text-[10px] text-gray-400 font-bold">{v.year}</span>
              </div>
              <div className="mt-4">
                <UKPlate registration={v.registration} size="md" />
              </div>
              <h4 className="text-sm font-bold text-white mt-3">{v.make} {v.model}</h4>
            </div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider pt-2 border-t border-white/5 flex justify-between">
              <span>{v.fuel_type}</span>
              <span className="text-white font-black">{v.current_mileage.toLocaleString()} mi</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VehicleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles, setVehicles, showToast } = useApp();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    registration: '', make: '', model: '', year: 2022,
    fuel_type: 'Hybrid', current_mileage: '', status: 'Active',
    next_service_date: '', next_mot_date: '', insurance_expiry: ''
  });

  useEffect(() => {
    if (isEdit) {
      const match = vehicles.find(v => v.id === id);
      if (match) setFormData(match);
    }
  }, [id, isEdit, vehicles]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.registration || !formData.make || !formData.model) return;

    if (isEdit) {
      setVehicles(prev => prev.map(v => v.id === id ? { ...formData, current_mileage: Number(formData.current_mileage) } : v));
      showToast('Asset Restructured', 'Data pool values successfully updated.');
    } else {
      const newId = 'v_' + Math.random().toString(36).substr(2, 9);
      setVehicles(prev => [...prev, { ...formData, id: newId, current_mileage: Number(formData.current_mileage) || 0 }]);
      showToast('Asset Onboarded', 'Telemetry link established.');
    }
    navigate('/vehicles');
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h2 className="text-lg font-black uppercase">{isEdit ? 'Modify Asset Payload' : 'Onboard New Unit'}</h2>
      <form onSubmit={handleSubmit} className="vch-card space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Registration Tag</label>
            <input type="text" value={formData.registration} onChange={e => setFormData({...formData, registration: e.target.value.toUpperCase()})} className="w-full p-2 text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Make Spec</label>
            <input type="text" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} className="w-full p-2 text-xs" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Model Specification</label>
            <input type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full p-2 text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Initial Mileage</label>
            <input type="number" value={formData.current_mileage} onChange={e => setFormData({...formData, current_mileage: e.target.value})} className="w-full p-2 text-xs" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Next Service Date</label>
            <input type="date" value={formData.next_service_date} onChange={e => setFormData({...formData, next_service_date: e.target.value})} className="w-full p-2 text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Status Allocation</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2 text-xs font-bold">
              <option value="Active">Active</option>
              <option value="In Service">In Service</option>
              <option value="Off Road">Off Road</option>
            </select>
          </div>
        </div>
        <button type="submit" className="vch-btn-orange w-full justify-center mt-4">Save Parameter Registry</button>
      </form>
    </div>
  );
}

function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles, services } = useApp();
  const vehicle = vehicles.find(v => v.id === id);

  const history = useMemo(() => services.filter(s => s.vehicle_id === id), [services, id]);

  if (!vehicle) return <p className="text-center py-12 text-xs text-gray-400">Target identity unlisted.</p>;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/vehicles')} className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1"><ArrowLeft size={12}/> Back</button>
      <div className="vch-card flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white">{vehicle.make} {vehicle.model}</h2>
          <div className="mt-2"><UKPlate registration={vehicle.registration} size="md" /></div>
        </div>
        <VehicleStatusBadge status={vehicle.status} />
      </div>

      <div className="vch-grid-4">
        <div className="bg-[#0c0f16] border border-white/5 p-4 rounded-xl text-center">
          <span className="text-[9px] uppercase font-bold text-gray-400 block">Odometers</span>
          <span className="text-base font-black text-[#ff6a00] block mt-1">{vehicle.current_mileage.toLocaleString()} mi</span>
        </div>
        <div className="bg-[#0c0f16] border border-white/5 p-4 rounded-xl text-center">
          <span className="text-[9px] uppercase font-bold text-gray-400 block">Fuel Specs</span>
          <span className="text-sm font-bold text-white block mt-1">{vehicle.fuel_type}</span>
        </div>
        <div className="bg-[#0c0f16] border border-white/5 p-4 rounded-xl text-center">
          <span className="text-[9px] uppercase font-bold text-gray-400 block">Service Due</span>
          <span className="text-xs font-bold text-white block mt-1">{formatDate(vehicle.next_service_date)}</span>
        </div>
        <div className="bg-[#0c0f16] border border-white/5 p-4 rounded-xl text-center">
          <span className="text-[9px] uppercase font-bold text-gray-400 block">MOT Due</span>
          <span className="text-xs font-bold text-white block mt-1">{formatDate(vehicle.next_mot_date)}</span>
        </div>
      </div>

      <div className="vch-card">
        <h3 className="text-xs font-bold uppercase text-gray-400 mb-4 pb-2 border-b border-[#ff6a00]/10">Logged Maintenance Ledger</h3>
        {history.length === 0 ? (
          <p className="text-xs text-center py-6 text-gray-400">No active itemized statements filed.</p>
        ) : (
          <div className="space-y-2">
            {history.map(s => (
              <div key={s.id} className="p-3 bg-black/20 border border-white/5 rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-white">{s.service_type}</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">{s.description}</p>
                </div>
                <span className="text-sm font-black text-[#ff9944]">£{s.cost}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceHistory() {
  const { services, vehicles } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">Maintenance Ledger Matrix</h2>
          <p className="text-xs text-gray-400 mt-0.5">Aggregated pool invoicing controls.</p>
        </div>
        <button onClick={() => navigate('/services/new')} className="vch-btn-orange"><PlusCircle size={14}/> File Entry</button>
      </div>

      <div className="vch-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#111520] border-b border-[#ff6a00]/10 text-gray-400">
                <th className="p-3 font-bold uppercase">Operation</th>
                <th className="p-3 font-bold uppercase">Vehicle Plate</th>
                <th className="p-3 font-bold uppercase">Timeline</th>
                <th className="p-3 font-bold uppercase text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {services.map(s => {
                const matchV = vehicles.find(v => v.id === s.vehicle_id);
                return (
                  <tr key={s.id} className="hover:bg-white/5">
                    <td className="p-3 font-bold text-white">{s.service_type}</td>
                    <td className="p-3 font-mono font-bold text-[#ff9944]">{matchV ? matchV.registration : 'Unlinked'}</td>
                    <td className="p-3 font-medium text-gray-300">{formatDate(s.service_date)}</td>
                    <td className="p-3 text-right font-black text-[#ffaa66] text-sm">£{s.cost}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ServiceForm() {
  const navigate = useNavigate();
  const { vehicles, setServices, showToast } = useApp();

  const [formData, setFormData] = useState({
    vehicle_id: '', service_type: 'Full Service', service_date: new Date().toISOString().split('T')[0], cost: '', description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.vehicle_id || !formData.cost) return;

    setServices(prev => [...prev, { ...formData, id: 's_' + Math.random().toString(36).substr(2, 9), cost: Number(formData.cost) }]);
    showToast('Invoice Saved', 'Financial parameter applied to fleet system pool logs.');
    navigate('/services');
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h2 className="text-lg font-black uppercase">File Service Statement Log</h2>
      <form onSubmit={handleSubmit} className="vch-card space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Target Fleet Car</label>
          <select value={formData.vehicle_id} onChange={e => setFormData({...formData, vehicle_id: e.target.value})} className="w-full p-2 text-xs font-bold">
            <option value="">-- Select Target --</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration} ({v.make})</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Cost Pool (£)</label>
            <input type="number" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} className="w-full p-2 text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Event Date</label>
            <input type="date" value={formData.service_date} onChange={e => setFormData({...formData, service_date: e.target.value})} className="w-full p-2 text-xs" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Diagnostic Notebook</label>
          <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 text-xs resize-none" placeholder="Itemize details..." />
        </div>
        <button type="submit" className="vch-btn-orange w-full justify-center mt-4">Append File</button>
      </form>
    </div>
  );
}

function DriverMileage() {
  const { mileages, vehicles, computeMileageCalculations, setMileages, showToast } = useApp();
  const navigate = useNavigate();
  const [logMilesModal, setLogMilesModal] = useState({ isOpen: false, record: null, inputValue: '' });

  const handleSaveQuickMiles = () => {
    const { record, inputValue } = logMilesModal;
    if (!record) return;
    const nextMiles = Number(inputValue);

    if (isNaN(nextMiles) || nextMiles < record.current_mileage) return;

    setMileages(prev => prev.map(m => m.id === record.id ? { ...m, current_mileage: nextMiles } : m));
    showToast('Telemetry Synchronized', 'Odometer calculations re-evaluated.');
    setLogMilesModal({ isOpen: false, record: null, inputValue: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">Driver Mileage Auditing</h2>
          <p className="text-xs text-gray-400 mt-0.5">Leasing threshold limit calculation desk.</p>
        </div>
        <button onClick={() => navigate('/mileage/new')} className="vch-btn-orange"><PlusCircle size={14}/> Track Lease</button>
      </div>

      <div className="vch-grid-2">
        {mileages.map(m => {
          const matchV = vehicles.find(v => v.id === m.vehicle_id);
          const calcs = computeMileageCalculations(m);
          return (
            <div key={m.id} className="vch-card flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <User className="text-[#ff6a00]" size={16} />
                    <h4 className="text-sm font-bold text-white">{m.driver_name}</h4>
                  </div>
                  <span className="text-[10px] bg-[#ff6a00]/10 text-[#ff6a00] px-2 py-0.5 rounded-full border border-[#ff6a00]/20 font-bold uppercase">{m.status}</span>
                </div>
                <div className="mt-3 flex justify-between items-center bg-black/20 p-2 rounded-xl">
                  <UKPlate registration={matchV ? matchV.registration : ''} size="sm" />
                  <div className="text-right font-mono text-xs">
                    <span className="text-[9px] text-gray-400 block">Dynamic Odo</span>
                    <span className="text-[#ff6a00] font-black">{m.current_mileage.toLocaleString()} mi</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-[#111520] p-3 rounded-xl border border-white/5">
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase">Accrued</span>
                    <span className="font-bold text-white">{calcs.totalMiles.toLocaleString()} mi</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase">Allowed Caps</span>
                    <span className="font-bold text-white">{calcs.totalAllowance.toLocaleString()} mi</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase">Excess Variance</span>
                    <span className={`font-black ${calcs.excessMiles > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{calcs.excessMiles.toLocaleString()} mi</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase">Liability Overage</span>
                    <span className={`font-black ${calcs.excessCharge > 0 ? 'text-red-400' : 'text-emerald-400'}`}>£{calcs.excessCharge.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button onClick={() => setLogMilesModal({ isOpen: true, record: m, inputValue: m.current_mileage.toString() })} className="vch-btn-orange w-full justify-center">Log Odometer Sync</button>
            </div>
          );
        })}
      </div>

      {logMilesModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="vch-card max-w-sm w-full p-6">
            <h3 className="text-sm font-black text-white uppercase">Calibrate Telemetry</h3>
            <input type="number" value={logMilesModal.inputValue} onChange={e => setLogMilesModal({...logMilesModal, inputValue: e.target.value})} className="w-full p-2 text-sm text-[#ff6a00] font-mono font-bold mt-4 focus:outline-none" />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setLogMilesModal({ isOpen: false, record: null, inputValue: '' })} className="px-4 py-2 bg-[#1b2030] text-white text-xs font-bold rounded-xl">Cancel</button>
              <button onClick={handleSaveQuickMiles} className="px-4 py-2 bg-[#ff6a00] text-white font-bold text-xs rounded-xl shadow-md">Save Miles</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DriverMileageForm() {
  const navigate = useNavigate();
  const { vehicles, setMileages, showToast } = useApp();

  const [formData, setFormData] = useState({
    vehicle_id: '', driver_name: '', start_mileage: '', current_mileage: '', monthly_allowance: 5000, excess_rate_pence: 20, date_started: new Date().toISOString().split('T')[0], status: 'Active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.vehicle_id || !formData.driver_name) return;

    const payload = {
      ...formData,
      id: 'm_' + Math.random().toString(36).substr(2, 9),
      start_mileage: Number(formData.start_mileage) || 0,
      current_mileage: Number(formData.current_mileage) || Number(formData.start_mileage) || 0
    };

    setMileages(prev => [...prev, payload]);
    showToast('Lease Activated', 'Contract tracing pipeline added.');
    navigate('/mileage');
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h2 className="text-lg font-black uppercase">Establish Lease Registry Array</h2>
      <form onSubmit={handleSubmit} className="vch-card space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Link Asset Car</label>
            <select value={formData.vehicle_id} onChange={e => setFormData({...formData, vehicle_id: e.target.value})} className="w-full p-2 text-xs font-bold text-white">
              <option value="">-- Select --</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Driver Title Account Name</label>
            <input type="text" value={formData.driver_name} onChange={e => setFormData({...formData, driver_name: e.target.value})} className="w-full p-2 text-xs" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Initial Odo (mi)</label>
            <input type="number" value={formData.start_mileage} onChange={e => setFormData({...formData, start_mileage: e.target.value})} className="w-full p-2 text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Handover Date</label>
            <input type="date" value={formData.date_started} onChange={e => setFormData({...formData, date_started: e.target.value})} className="w-full p-2 text-xs" />
          </div>
        </div>
        <button type="submit" className="vch-btn-orange w-full justify-center mt-4">File Lease Contract</button>
      </form>
    </div>
  );
}

function PageNotFound() {
  return (
    <div className="text-center py-24 space-y-4">
      <AlertTriangle size={36} className="text-[#ff6a00] mx-auto" />
      <h2 className="text-sm font-black uppercase tracking-wider">Unmapped Target Routing Node</h2>
      <Link to="/" className="vch-btn-orange">Return Hub</Link>
    </div>
  );
}

// ==========================================
// CORE APP ROUTER WRAPPER ENTRY
// ==========================================
export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="vehicles/new" element={<VehicleForm />} />
            <Route path="vehicles/:id" element={<VehicleDetail />} />
            <Route path="vehicles/:id/edit" element={<VehicleForm />} />
            <Route path="services" element={<ServiceHistory />} />
            <Route path="services/new" element={<ServiceForm />} />
            <Route path="mileage" element={<DriverMileage />} />
            <Route path="mileage/new" element={<DriverMileageForm />} />
            <Route path="mileage/:id" element={<DriverMileageForm />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}