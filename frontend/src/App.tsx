import './App.css';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './context/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Store from './pages/Store';
import NotFound from './pages/NotFound';
import AuthCallback from './pages/AuthCallback';
import { AuthProvider } from './context/AuthProvider';
import Profile from './pages/Profile';
import DashboardHeader from './pages/dashboard/DashboardHeader';
import Dashboard from './pages/dashboard/Dashboard';
import DashboardPricing from './pages/dashboard/DashboardPricing';
import DashboardProduct from './pages/dashboard/DashboardProduct';
import DashboardProducts from './pages/dashboard/DashboardProducts';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<><Header /><Outlet /><Footer /></>}>
                        <Route path="/" element={<Home />} />
                        <Route path="/store" element={<Store />} />

                        <Route path="/auth/callback" element={<AuthCallback />} />

                        <Route path="/profile" element={
                            <ProtectedRoute loginRequired={true} adminOnly={false}>
                                <Profile />
                            </ProtectedRoute>
                        } />

                        <Route path="*" element={<NotFound />} />
                    </Route>

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute loginRequired={true} adminOnly={true}>
                                <DashboardHeader />
                                <Outlet />
                                <Footer />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Dashboard />} />
                        <Route path="products" element={<DashboardProducts />} />
                        <Route path="products/:productId" element={<DashboardProduct />} />
                        <Route path="pricing" element={<DashboardPricing />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
