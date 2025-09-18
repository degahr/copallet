import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ShipmentProvider } from './contexts/ShipmentContext';
import { TrackingProvider } from './contexts/TrackingContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';

// Public pages
import Landing from './pages/public/Landing';
import About from './pages/public/About';
import Services from './pages/public/Services';
import Pricing from './pages/public/Pricing';
import Contact from './pages/public/Contact';
import FAQ from './pages/public/FAQ';
import CaseStudies from './pages/public/CaseStudies';
import Industries from './pages/public/Industries';
import Blog from './pages/public/Blog';
import BlogPost from './pages/public/BlogPost';

// Auth pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Onboarding from './pages/auth/Onboarding';

// Dashboard pages
import Dashboard from './pages/Dashboard';
import Shipments from './pages/shipments/Shipments';
import CreateShipment from './pages/shipments/CreateShipment';
import ShipmentDetail from './pages/shipments/ShipmentDetail';
import Marketplace from './pages/marketplace/Marketplace';
import Tracking from './pages/tracking/Tracking';
import Profile from './pages/profile/Profile';
import Messaging from './pages/messaging/Messaging';
import PODCapture from './pages/pod/PODCapture';
import StatusWorkflow from './pages/workflow/StatusWorkflow';
import AdminPanel from './pages/admin/AdminPanel';
import AutoBidRules from './pages/autobid/AutoBidRules';
import ShipmentAnalytics from './pages/analytics/ShipmentAnalytics';
import RatingSystem from './pages/rating/RatingSystem';
import ShipmentTemplates from './pages/templates/ShipmentTemplates';
import CarrierCostModelPage from './pages/costmodel/CarrierCostModel';
import ShipperProfile from './pages/profile/ShipperProfile';
import CarrierVerification from './pages/verification/CarrierVerification';
import BlogEditor from './pages/admin/BlogEditor';
import BlogManagement from './components/admin/BlogManagement';
import UserManagement from './pages/admin/UserManagement';
import ShipmentManagement from './pages/admin/ShipmentManagement';
import AnalyticsManagement from './pages/admin/AnalyticsManagement';
import ApiTest from './pages/ApiTest';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes - using /app prefix for nested structure */}
            <Route path="/app" element={
              <ProtectedRoute>
                <ShipmentProvider>
                  <TrackingProvider>
                    <Layout />
                  </TrackingProvider>
                </ShipmentProvider>
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="onboarding" element={<Onboarding />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="shipments" element={<Shipments />} />
              <Route path="shipments/create" element={<CreateShipment />} />
              <Route path="shipments/:id" element={<ShipmentDetail />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="tracking" element={<Navigate to="/app/dashboard" replace />} />
              <Route path="tracking/:id" element={<Tracking />} />
              <Route path="messaging/:id" element={<Messaging />} />
              <Route path="pod/:id" element={<PODCapture />} />
              <Route path="workflow/:id" element={<StatusWorkflow />} />
              <Route path="admin" element={<AdminPanel />} />
              <Route path="admin/users" element={<UserManagement />} />
              <Route path="admin/shipments" element={<ShipmentManagement />} />
              <Route path="admin/analytics" element={<AnalyticsManagement />} />
              <Route path="autobid" element={<AutoBidRules />} />
              <Route path="analytics" element={<ShipmentAnalytics />} />
              <Route path="rating" element={<RatingSystem />} />
              <Route path="templates" element={<ShipmentTemplates />} />
              <Route path="costmodel" element={<CarrierCostModelPage />} />
              <Route path="shipper-profile" element={<ShipperProfile />} />
              <Route path="verification" element={<CarrierVerification />} />
              <Route path="profile" element={<Profile />} />
              <Route path="admin/blog" element={<BlogManagement />} />
              <Route path="admin/blog/create" element={<BlogEditor />} />
              <Route path="admin/blog/edit/:id" element={<BlogEditor />} />
              <Route path="api-test" element={<ApiTest />} />
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Catch-all route for public routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;