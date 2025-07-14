import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UIProvider } from './contexts/UIContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Process from './components/Process';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoginForm from './components/auth/LoginForm';

// Componentes de autenticación y dashboard
import AuthCallback from './components/auth/AuthCallback';
import DashboardLayout from './components/dashboard/DashboardLayout';

// Componentes de administración
import AdminDashboard from './components/dashboard/admin/AdminDashboard';
import ClientsManagement from './components/dashboard/admin/ClientsManagement';
import ClientDetail from './components/dashboard/admin/clients/ClientDetail';
import ProjectsManagement from './components/dashboard/admin/ProjectsManagement';
import TasksManagement from './components/dashboard/admin/TasksManagement';
import InvoicesManagement from './components/dashboard/admin/InvoicesManagement';
import RequestsManagement from './components/dashboard/admin/RequestsManagement';
import Settings from './components/dashboard/admin/Settings';
import UserProfile from './components/dashboard/client/UserProfile';
import UserSettings from './components/dashboard/client/UserSettings';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Services />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  return <>{children}</>;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm onSuccess={() => navigate('/dashboard')} />
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <Router>
          <Routes>
            <Route path="/" element={<PublicLayout />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              {/* Rutas anidadas para el dashboard */}
              <Route index element={<AdminDashboard />} />
              <Route path="clients" element={<ClientsManagement />} />
              <Route path="clients/new" element={<ClientDetail />} />
              <Route path="clients/:id" element={<ClientDetail />} />
              <Route path="projects/*" element={<ProjectsManagement />} />
              <Route path="tasks/*" element={<TasksManagement />} />
              <Route path="invoices/*" element={<InvoicesManagement />} />
              <Route path="requests/*" element={<RequestsManagement />} />
              <Route path="settings/*" element={<Settings />} />
              <Route path="profile/*" element={<UserProfile />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </Router>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;