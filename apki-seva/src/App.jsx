import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileBadge, 
  Calendar, 
  Users, 
  Bell, 
  Search, 
  LogOut, 
  Menu,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  QrCode,
  Building,
  Plus,
  Filter,
  Home,
  ArrowRight,
  Lock,
  Mail,
  User,
  ChevronRight,
  AlertCircle,
  ArrowLeft,
  Settings,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

// --- Mock Data & Constants ---

const MOCK_CERTIFICATES = [
  { id: 'CERT-9821', applicant: 'Rahul Sharma', type: 'Volunteering', event: 'Clean City Drive', hours: 20, date: '2023-10-15', status: 'Approved' },
  { id: 'CERT-9822', applicant: 'Priya Singh', type: 'Workshop', event: 'Digital Literacy', hours: 5, date: '2023-10-18', status: 'Pending' },
  { id: 'CERT-9823', applicant: 'Amit Verma', type: 'Internship', event: 'NGO Support', hours: 100, date: '2023-10-20', status: 'Rejected' },
  { id: 'CERT-9824', applicant: 'Sneha Gupta', type: 'Donation', event: 'Winter Cloth Drive', hours: 0, date: '2023-10-22', status: 'Approved' },
];

const MOCK_RESOURCES = [
  { id: 1, name: 'Conference Hall A', type: 'Room', capacity: 50, status: 'Available' },
  { id: 2, name: 'Projector Kit 1', type: 'Equipment', capacity: 0, status: 'Booked' },
  { id: 3, name: 'Community Van', type: 'Vehicle', capacity: 8, status: 'Available' },
  { id: 4, name: 'Meeting Room B', type: 'Room', capacity: 10, status: 'Maintenance' },
];

const ROLES = {
  ADMIN: 'Admin',
  STAFF: 'Staff',
  USER: 'User'
};

// --- Helper Components ---

const StatusBadge = ({ status }) => {
  const colors = {
    Approved: 'bg-green-100 text-green-800 border-green-200',
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Rejected: 'bg-red-100 text-red-800 border-red-200',
    Available: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Booked: 'bg-orange-100 text-orange-800 border-orange-200',
    Maintenance: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  
  const icons = {
    Approved: <CheckCircle className="w-3 h-3 mr-1" />,
    Pending: <Clock className="w-3 h-3 mr-1" />,
    Rejected: <XCircle className="w-3 h-3 mr-1" />,
  };

  return (
    <span className={`flex items-center w-fit px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {icons[status]}
      {status}
    </span>
  );
};

const Card = ({ title, value, icon: Icon, subtext, colorClass }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {subtext && <p className="text-xs text-slate-400 mt-4">{subtext}</p>}
  </div>
);

// --- Auth Component ---

const AuthScreen = ({ onLogin, registeredUsers, onRegister }) => {
  // view state: 'login' | 'register' | 'forgot'
  const [view, setView] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: ROLES.USER });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    // Simulate Network Delay
    setTimeout(() => {
        if (view === 'login') {
            // LOGIN LOGIC
            const foundUser = registeredUsers.find(
                u => u.email.toLowerCase() === formData.email.toLowerCase() && u.password === formData.password
            );

            if (foundUser) {
                onLogin(foundUser);
            } else {
                setError('Invalid email or password. Please try again or create an account.');
                setLoading(false);
            }
        } else if (view === 'register') {
            // Validation: Check for Capital Letter and Number
            const hasUpperCase = /[A-Z]/.test(formData.password);
            const hasNumber = /[0-9]/.test(formData.password);

            if (!hasUpperCase || !hasNumber) {
                setError('Password must contain at least one capital letter and one number.');
                setLoading(false);
                return;
            }

            // REGISTER LOGIC
            const existingUser = registeredUsers.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
            
            if (existingUser) {
                setError('An account with this email already exists.');
                setLoading(false);
            } else {
                const newUser = { 
                    name: formData.name, 
                    email: formData.email, 
                    password: formData.password, 
                    role: ROLES.USER 
                };
                onRegister(newUser);
                onLogin(newUser); 
            }
        } else if (view === 'forgot') {
            // FORGOT PASSWORD LOGIC
            const existingUser = registeredUsers.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
            
            if (existingUser) {
                setSuccessMsg('Password reset instructions have been sent to your email.');
                setLoading(false);
            } else {
                // For security, usually you don't reveal if email exists, but for demo we show error
                setError('No account found with this email address.');
                setLoading(false);
            }
        }
    }, 800);
  };

  const getTitle = () => {
    if (view === 'login') return 'Welcome Back!';
    if (view === 'register') return 'Create Account';
    return 'Reset Password';
  };

  const getSubtitle = () => {
    if (view === 'login') return 'Please sign in to continue.';
    if (view === 'register') return 'Join us to start managing your services.';
    return 'Enter your email to receive reset instructions.';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Brand */}
        <div className="md:w-1/2 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -ml-16 -mb-16"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                 <span className="font-bold text-white text-xl">AS</span>
               </div>
               <span className="font-bold text-2xl tracking-tight">Apki Seva</span>
            </div>
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Empowering Communities Through Service.
            </h2>
            <p className="text-slate-400 text-lg">
              Manage certificates, allocate resources, and track service activities in one centralized platform.
            </p>
          </div>
          
          <div className="relative z-10 mt-12">
             <div className="flex items-center gap-2 text-sm text-slate-400">
                <CheckCircle className="w-4 h-4 text-blue-500" /> Secure Verification
                <CheckCircle className="w-4 h-4 text-blue-500 ml-4" /> Real-time Tracking
             </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center relative">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{getTitle()}</h3>
            <p className="text-slate-500">{getSubtitle()}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4" />
                {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <CheckCircle className="w-4 h-4" />
                {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {view === 'register' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    required 
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  required 
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {view !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-slate-700">Password</label>
                    {view === 'login' && (
                        <button 
                            type="button" 
                            onClick={() => {
                                setView('forgot');
                                setError('');
                                setSuccessMsg('');
                            }}
                            className="text-xs text-blue-600 hover:underline font-medium"
                        >
                            Forgot Password?
                        </button>
                    )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="password" 
                    required 
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                {view === 'register' && (
                    <p className="text-xs text-slate-400 mt-1">Must contain 1 capital letter & 1 number.</p>
                )}
              </div>
            )}

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (
                view === 'login' ? 'Sign In' : 
                view === 'register' ? 'Create Account' : 
                'Send Reset Link'
              )}
              {!loading && view !== 'forgot' && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* View Switchers */}
          <div className="mt-6 text-center">
            {view === 'login' && (
                <p className="text-slate-500 text-sm">
                  Don't have an account? {' '}
                  <button 
                    onClick={() => {
                        setView('register');
                        setError('');
                        setSuccessMsg('');
                        setFormData({ name: '', email: '', password: '', role: ROLES.USER });
                    }} 
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
            )}

            {view === 'register' && (
                <p className="text-slate-500 text-sm">
                  Already have an account? {' '}
                  <button 
                    onClick={() => {
                        setView('login');
                        setError('');
                        setSuccessMsg('');
                    }} 
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
            )}

            {view === 'forgot' && (
                <button 
                    onClick={() => {
                        setView('login');
                        setError('');
                        setSuccessMsg('');
                    }} 
                    className="text-slate-500 hover:text-slate-800 text-sm font-medium flex items-center justify-center gap-2 mx-auto"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Sign In
                </button>
            )}
          </div>
          
          {/* Test Credentials Hint */}
          {view === 'login' && (
              <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-500 text-center">
                  <p className="font-semibold mb-1">Demo Credentials:</p>
                  <p>Admin: <span className="font-mono">admin@test.com</span> / <span className="font-mono">password</span></p>
                  <p>Staff: <span className="font-mono">staff@test.com</span> / <span className="font-mono">password</span></p>
              </div>
          )}

        </div>
      </div>
    </div>
  );
};

// --- Main Application ---

export default function ApkiSeva() {
  const [currentUser, setCurrentUser] = useState(null); // Auth State: null = logged out
  const [currentRole, setCurrentRole] = useState(ROLES.ADMIN);
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Simulated Database of Users
  const [registeredUsers, setRegisteredUsers] = useState([
    { name: 'Admin User', email: 'admin@test.com', password: 'password', role: ROLES.ADMIN },
    { name: 'Staff User', email: 'staff@test.com', password: 'password', role: ROLES.STAFF }
  ]);

  // State for modules
  const [certificates, setCertificates] = useState(MOCK_CERTIFICATES);
  const [resources, setResources] = useState(MOCK_RESOURCES);
  const [showCertModal, setShowCertModal] = useState(null); 
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Sync role with logged in user
  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setActiveTab('home');
  };

  const handleRegister = (newUser) => {
      setRegisteredUsers([...registeredUsers, newUser]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRole(ROLES.ADMIN); // Reset to default for next login
    setIsProfileOpen(false); // Close dropdown
  };

  // Calculate available roles based on who is logged in
  const getAvailableRoles = () => {
    if (!currentUser) return [];
    if (currentUser.role === ROLES.ADMIN) return [ROLES.ADMIN, ROLES.STAFF, ROLES.USER];
    if (currentUser.role === ROLES.STAFF) return [ROLES.STAFF, ROLES.USER];
    return []; // Regular users see nothing
  };

  const availableRoles = getAvailableRoles();

  // --- Handlers ---

  const handleApproveReject = (id, newStatus) => {
    setCertificates(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleBookResource = (id) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, status: 'Booked' } : r));
  };

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCert = {
      id: `CERT-${Math.floor(1000 + Math.random() * 9000)}`,
      applicant: currentUser ? currentUser.name : 'Current User', 
      type: formData.get('type'),
      event: formData.get('event'),
      hours: formData.get('hours'),
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setCertificates([newCert, ...certificates]);
    setShowRequestModal(false);
    alert('Certificate request submitted successfully!');
  };

  // --- Views ---

  const HomeView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 md:p-12 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 opacity-10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Welcome, {currentUser?.name || 'User'}</h1>
          <p className="text-blue-100 text-lg md:text-xl mb-8 leading-relaxed">
            Your centralized platform for certificate issuance, activity monitoring, and smart resource allocation.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setActiveTab('certificates')}
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-md flex items-center gap-2"
            >
              Manage Certificates <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActiveTab('resources')}
              className="bg-blue-600 bg-opacity-30 border border-blue-400 text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-50 transition-colors backdrop-blur-sm"
            >
              Book Resources
            </button>
          </div>
        </div>
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
            onClick={() => setActiveTab('dashboard')}
            className="group bg-white p-6 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-all hover:border-blue-200"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Live Dashboard</h3>
          <p className="text-slate-500 text-sm">View real-time analytics, pending approvals, and system health.</p>
        </div>

        <div 
            onClick={() => setActiveTab('certificates')}
            className="group bg-white p-6 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-all hover:border-emerald-200"
        >
          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
            <FileBadge className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Certificates</h3>
          <p className="text-slate-500 text-sm">Issue, approve, and verify digital certificates with QR codes.</p>
        </div>

        <div 
            onClick={() => setActiveTab('resources')}
            className="group bg-white p-6 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-all hover:border-orange-200"
        >
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Resource Booking</h3>
          <p className="text-slate-500 text-sm">Manage halls, equipment, and staff allocation efficiently.</p>
        </div>
      </div>

      {/* Recent Updates Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Latest Platform Updates</h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">v1.2.0</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50">
                <div className="p-2 bg-green-100 rounded text-green-700 mt-1"><CheckCircle className="w-4 h-4" /></div>
                <div>
                    <h4 className="font-semibold text-slate-700 text-sm">Automated Email System</h4>
                    <p className="text-xs text-slate-500 mt-1">Certificates are now automatically emailed to applicants upon approval.</p>
                </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50">
                <div className="p-2 bg-blue-100 rounded text-blue-700 mt-1"><Building className="w-4 h-4" /></div>
                <div>
                    <h4 className="font-semibold text-slate-700 text-sm">New Resources Added</h4>
                    <p className="text-xs text-slate-500 mt-1">Conference Hall B and Community Van 2 are now available for booking.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          title="Total Certificates" 
          value={stats.total} 
          icon={FileBadge} 
          subtext="+12% from last month"
          colorClass="bg-blue-500"
        />
        <Card 
          title="Pending Requests" 
          value={stats.pending} 
          icon={Clock} 
          subtext="Requires immediate attention"
          colorClass="bg-yellow-500"
        />
        <Card 
          title="Active Resources" 
          value={stats.activeResources} 
          icon={Building} 
          subtext={`${resources.length} total resources`}
          colorClass="bg-emerald-500"
        />
        <Card 
          title="Total Users" 
          value="1,240" 
          icon={Users} 
          subtext="Active community members"
          colorClass="bg-purple-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Recent Activity Log</h3>
          <button className="text-sm text-blue-600 hover:underline">View All</button>
        </div>
        <div className="divide-y divide-slate-100">
          {certificates.slice(0, 3).map((cert, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <FileBadge className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{cert.applicant} requested a certificate</p>
                  <p className="text-xs text-slate-500">For {cert.event} • {cert.date}</p>
                </div>
              </div>
              <StatusBadge status={cert.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const CertificatesView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by ID or Name..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
           {currentRole === ROLES.USER && (
            <button 
              onClick={() => setShowRequestModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Request New
            </button>
           )}
           <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50">
              <Filter className="w-4 h-4" /> Filter
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Certificate ID</th>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Event Details</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-slate-600">{cert.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{cert.applicant}</td>
                  <td className="px-6 py-4">
                    <p className="text-slate-800">{cert.event}</p>
                    <p className="text-xs text-slate-500">{cert.type} • {cert.hours} Hours</p>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={cert.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {cert.status === 'Approved' && (
                        <button 
                          onClick={() => setShowCertModal(cert)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="View Certificate"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      )}
                      
                      {(currentRole === ROLES.ADMIN || currentRole === ROLES.STAFF) && cert.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleApproveReject(cert.id, 'Approved')}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleApproveReject(cert.id, 'Rejected')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ResourcesView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res) => (
          <div key={res.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${res.type === 'Room' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                  <Building className="w-6 h-6" />
                </div>
                <StatusBadge status={res.status} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">{res.name}</h3>
              <p className="text-sm text-slate-500 mb-2">{res.type} • Capacity: {res.capacity}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">WiFi</span>
                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">AC</span>
                {res.type === 'Room' && <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">Projector</span>}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button 
                disabled={res.status !== 'Available'}
                onClick={() => handleBookResource(res.id)}
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  res.status === 'Available' 
                    ? 'bg-slate-800 text-white hover:bg-slate-700' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {res.status === 'Available' ? 'Book Resource' : 'Unavailable'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- Modals ---

  const CertificateModal = () => {
    if (!showCertModal) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white w-full max-w-2xl shadow-2xl rounded-sm animate-in fade-in zoom-in duration-200">
          {/* Certificate Design */}
          <div className="p-8 md:p-12 text-center border-8 border-double border-slate-200 m-2 relative">
            <div className="absolute top-4 right-4">
                <QrCode className="w-16 h-16 text-slate-800 opacity-80" />
            </div>
            
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-serif text-slate-800 mb-2 font-bold uppercase tracking-widest">Certificate</h1>
              <span className="text-lg text-slate-500 uppercase tracking-[0.2em] block">Of Appreciation</span>
            </div>

            <p className="text-slate-600 italic mb-4">This certificate is proudly presented to</p>
            
            <h2 className="text-3xl font-serif text-blue-900 font-bold mb-4 border-b-2 border-slate-200 inline-block px-8 pb-2">
              {showCertModal.applicant}
            </h2>

            <p className="text-slate-600 mt-6 max-w-lg mx-auto leading-relaxed">
              For their outstanding contribution and dedication during the 
              <span className="font-bold text-slate-800"> {showCertModal.event}</span>. 
              Their efforts contributed <span className="font-bold">{showCertModal.hours} hours</span> of service.
            </p>

            <div className="mt-12 flex justify-between items-end px-8 md:px-16">
              <div className="text-center">
                <div className="w-32 h-0.5 bg-slate-400 mb-2"></div>
                <p className="text-xs font-bold uppercase text-slate-500">Director Signature</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-2 border-yellow-500 flex items-center justify-center mb-2">
                    <span className="text-yellow-600 font-bold text-xs">Apki Seva</span>
                </div>
                <p className="text-xs text-slate-400 font-mono">{showCertModal.id}</p>
              </div>
              <div className="text-center">
                <p className="mb-2 font-serif italic text-slate-800">{showCertModal.date}</p>
                <div className="w-32 h-0.5 bg-slate-400 mb-2"></div>
                <p className="text-xs font-bold uppercase text-slate-500">Date</p>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="bg-slate-50 p-4 flex justify-between items-center border-t border-slate-200">
             <button onClick={() => setShowCertModal(null)} className="text-slate-600 hover:text-slate-900 text-sm font-medium">Close</button>
             <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2" onClick={() => window.print()}>
               <Printer className="w-4 h-4" /> Print PDF
             </button>
          </div>
        </div>
      </div>
    );
  };

  const RequestModal = () => {
    if (!showRequestModal) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden">
          <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
            <h3 className="font-semibold">Request New Certificate</h3>
            <button onClick={() => setShowRequestModal(false)}><XCircle className="w-5 h-5 text-slate-400 hover:text-white"/></button>
          </div>
          <form onSubmit={handleRequestSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Event Name</label>
              <input required name="event" type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. Charity Run" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                    <select name="type" className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option>Volunteering</option>
                        <option>Workshop</option>
                        <option>Internship</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Hours</label>
                    <input required name="hours" type="number" className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="0" />
                </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description/Notes</label>
              <textarea className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none h-24" placeholder="Brief details about the activity..."></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">Submit Request</button>
          </form>
        </div>
      </div>
    );
  };

  // --- Auth Check ---
  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} registeredUsers={registeredUsers} onRegister={handleRegister} />;
  }

  // --- Main App Render ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex-shrink-0 flex flex-col fixed h-full z-10 md:relative`}>
        <div className="p-4 flex items-center gap-3 border-b border-slate-800 h-16">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-white">AS</span>
          </div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight">Apki Seva</span>}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'certificates', label: 'Certificates', icon: FileBadge },
            { id: 'resources', label: 'Resources', icon: Calendar },
            { id: 'users', label: 'User Management', icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button 
             onClick={handleLogout}
             className="flex items-center gap-3 text-slate-400 hover:text-white w-full px-3 py-2 transition-colors"
           >
             <LogOut className="w-5 h-5" />
             {isSidebarOpen && <span>Sign Out</span>}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-100 rounded-md">
               <Menu className="w-5 h-5 text-slate-600" />
             </button>
             <h2 className="text-xl font-semibold capitalize text-slate-800">{activeTab}</h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Role Switcher - DYNAMIC BASED ON PERMISSIONS */}
            {availableRoles.length > 0 && (
              <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-1">
                {availableRoles.map(role => (
                  <button
                    key={role}
                    onClick={() => setCurrentRole(role)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      currentRole === role ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-slate-50 rounded-full">
                <Bell className="w-5 h-5 text-slate-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Profile Section */}
              <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 focus:outline-none hover:bg-slate-50 rounded-lg p-2 transition-colors"
                  >
                     <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                        <p className="text-xs text-slate-500">{currentRole}</p>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm">
                       {currentUser.name.charAt(0)}
                     </div>
                     <ChevronDown className="w-4 h-4 text-slate-400" /> 
                  </button>

                  {/* Dropdown */}
                  {isProfileOpen && (
                     <>
                        <div className="fixed inset-0 z-30" onClick={() => setIsProfileOpen(false)}></div>
                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-40">
                            <div className="px-4 py-2 border-b border-slate-100 mb-1">
                                <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                                <p className="text-xs text-slate-500">{currentUser.email}</p>
                            </div>
                            
                            <button 
                                onClick={() => {
                                    alert("My Profile Clicked!");
                                    setIsProfileOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                                <User className="w-4 h-4" /> My Profile
                            </button>
                            <button 
                                onClick={() => {
                                    alert("Settings Clicked!");
                                    setIsProfileOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                                <Settings className="w-4 h-4" /> Settings
                            </button>
                             <button 
                                onClick={() => {
                                    alert("Help Center Clicked!");
                                    setIsProfileOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                                <HelpCircle className="w-4 h-4" /> Help Center
                            </button>
                            
                            <div className="border-t border-slate-100 my-1"></div>
                            
                            <button 
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                         </div>
                     </>
                  )}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
             {/* Role Indicator Banner */}
             <div className="bg-indigo-50 border border-indigo-100 text-indigo-800 px-4 py-2 rounded-lg mb-6 text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                Viewing as <strong>{currentRole}</strong>. 
                {currentRole === ROLES.USER ? 'You can request certificates.' : 'You can approve/reject requests and manage resources.'}
             </div>

             {activeTab === 'home' && <HomeView />}
             {activeTab === 'dashboard' && <DashboardView />}
             {activeTab === 'certificates' && <CertificatesView />}
             {activeTab === 'resources' && <ResourcesView />}
             {activeTab === 'users' && (
                <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                    <Users className="w-16 h-16 mb-4 opacity-20" />
                    <p>User management module placeholder</p>
                </div>
             )}
          </div>
        </div>
      </main>

      {/* Render Modals */}
      <CertificateModal />
      <RequestModal />
    </div>
  );
}