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
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/Profile';
import DashboardHeader from './pages/dashboard/DashboardHeader';
import DashboardProducts from './pages/dashboard/DashboardProducts';
import DashboardProduct from './pages/dashboard/DashboardProduct';

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
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
