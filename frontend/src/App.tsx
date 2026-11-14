import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/store" element={<Store />} />

                    <Route path="/auth/callback" element={<AuthCallback />} />

                    <Route path="/profile" element={
                        <ProtectedRoute loginRequired={true}>
                            <Profile />
                        </ProtectedRoute>
                    } />
                    
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute loginRequired={true} adminOnly={true}>
                                <DashboardHeader />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Dashboard />} />
                        <Route path="products" element={<DashboardProducts />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
