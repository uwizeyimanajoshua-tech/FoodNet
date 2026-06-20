import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Restaurants } from "./pages/Restaurants";
import { Streams } from "./pages/Streams";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Dashboard } from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import { Admin } from "./pages/Admin";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { FoodDetails } from "./pages/FoodDetails";
import { ChefProfile } from "./pages/ChefProfile";
import SetupAdmin from "./pages/SetupAdmin";
import OrderTracking from "./pages/OrderTracking";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { SupportChat } from "./components/AIChatbot";
import { LoadingScreen } from "./components/LoadingScreen";
import { AuthProvider } from "./components/AuthContext";
import { FirebaseProvider } from "./components/FirebaseProvider";
import { LanguageProvider } from "./components/LanguageContext";
import { CartProvider } from "./components/CartContext";
import { FoodsProvider } from "./components/FoodsContext";
import { Toaster } from "react-hot-toast";

import AdminDashboard from "./pages/AdminDashboard";
import { Profile } from "./pages/Profile";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";

export default function App() {
  return (
    <FirebaseProvider>
      <LanguageProvider>
        <AuthProvider>
          <FoodsProvider>
            <CartProvider>
              <LoadingScreen />
              <Toaster position="top-right" />
              <Router>
              <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans selection:bg-orange-100 selection:text-orange-600">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/restaurants" element={<Restaurants />} />
                  <Route path="/food/:id" element={<FoodDetails />} />
                  <Route path="/chef/:id" element={<ChefProfile />} />
                  <Route path="/streams" element={<Streams />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/track/:orderId" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/setup-admin" element={<SetupAdmin />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/cookies" element={<Cookies />} />
                </Routes>
              </main>
              <SupportChat />
              <Footer />
            </div>
          </Router>
          </CartProvider>
          </FoodsProvider>
        </AuthProvider>
      </LanguageProvider>
    </FirebaseProvider>
  );
}
