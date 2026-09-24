import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ShopProvider } from './store/Shop';
import Bag from './pages/Bag';
import { AuthProvider } from './commerce/Auth';
import SignIn from './commerce/SignIn';
import CustomerDashboard from './pages/CustomerDashboard';
import Checkout from './pages/Checkout';
import Policy from './pages/Policy';
import { MotionConfig } from 'framer-motion';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Technology from './pages/Technology';
import Services from './pages/Services';
import Contact from './pages/Contact';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainLayout({ children }) {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin') || pathname === '/account';

  if (isAdminRoute) {
    return <main className="min-h-screen bg-slate-50">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider><ShopProvider><MotionConfig reducedMotion="user"><BrowserRouter>
      <ScrollToTop />
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/account" element={<CustomerDashboard />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/policies/:kind" element={<Policy />} />
          <Route path="/bag" element={<Bag />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          
          <Route path="*" element={<div className="pt-32 pb-12 text-center text-xl font-bold">404 - Page Not Found</div>} />
        </Routes>
      </MainLayout>
    </BrowserRouter></MotionConfig></ShopProvider></AuthProvider>
  );
}

export default App;
