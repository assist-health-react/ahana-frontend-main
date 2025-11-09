import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useState, Suspense, lazy, useEffect } from 'react'
import { FaChevronLeft, FaChevronRight, FaChartBar, FaCompass, 
  FaStar, FaCalendarAlt, FaCog, FaSignOutAlt } from 'react-icons/fa'
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NurseProvider, useNurse } from './context/NurseContext';

// Import components from common directory
import { LoadingSpinner, Header } from './components/common'
import Login from './components/auth/Login'
import ForgotPassword from './components/auth/ForgotPassword'
import { logout } from './services/authService'

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">Please try refreshing the page</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy load components
const Dashboard = lazy(() => import('./components/dashboard'));
const Ahana = lazy(() => import('./components/ahana'));
const Settings = lazy(() => import('./components/Settings'));
const Profile = lazy(() => import('./components/profile/Profile'));

// Protected Layout component
const ProtectedLayout = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const navigate = useNavigate();
  const { loading, initialized } = useNurse();

  const navigation = [
    { name: 'Dashboard', path: '/', icon: <FaChartBar />, color: 'text-purple-500' },
    { name: 'Ahana', path: '/ahana', icon: <FaStar />, color: 'text-yellow-500' },
    { name: 'Settings', path: '/settings', icon: <FaCog />, color: 'text-gray-500' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`bg-white shadow-lg flex-shrink-0 flex flex-col fixed h-screen z-20 transition-all duration-300 ease-in-out
        ${isSidebarExpanded ? 'w-72' : 'w-20'} mobile:hidden tablet:flex`}
      >
        {/* Logo Section */}
        <div className="h-16 px-4 border-b flex items-center justify-between">
          {isSidebarExpanded ? (
            <div className="flex items-center gap-3">
              <img 
                src="/assets/assist-health-logo.png" 
                alt="AssistHealth" 
                className="h-8 w-8 object-contain"
              />
              <div className="text-lg font-semibold">
                <span className="text-gray-800">Assist</span>
                <span className="text-[#38B6FF]">Health</span>
              </div>
            </div>
          ) : (
            <img 
              src="/assets/assist-health-logo.png" 
              alt="AH" 
              className="h-8 w-8 object-contain"
            />
          )}
          <button 
            onClick={() => setSidebarExpanded(!isSidebarExpanded)}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            {isSidebarExpanded ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-4 py-2.5 text-sm font-medium transition-colors
                    ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}
                  `}
                >
                  <span className={`flex-shrink-0 w-5 h-5 mr-3 ${item.color}`}>
                    {item.icon}
                  </span>
                  {isSidebarExpanded && item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FaSignOutAlt className="w-5 h-5 mr-3" />
            {isSidebarExpanded && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'ml-72' : 'ml-20'}`}>
        <Header />
        <div className="p-6">
          <Suspense fallback={<LoadingSpinner />}>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </Suspense>
        </div>
      </main>
    </div>
  );
};

// AppContent component to use hooks inside Router context
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // Protection logic
  const PrivateWrapper = ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const isInTempPasswordFlow = localStorage.getItem('tempAuthFlow') === 'true';
    const currentPath = window.location.pathname;
    
    // Public routes that don't need authentication check
    if (currentPath === '/login' || currentPath === '/forgot-password') {
      return children;
    }
    
    // Allow access to forgot-password route during temp password flow
    if (currentPath === '/forgot-password' && isInTempPasswordFlow) {
      return children;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    return children;
  };

  return (
    <NurseProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route element={<PrivateWrapper><ProtectedLayout /></PrivateWrapper>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ahana/*" element={<Ahana />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" />
    </NurseProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
