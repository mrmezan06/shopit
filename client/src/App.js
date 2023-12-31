import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetails from './components/product/ProductDetails';
import SearchProduct from './pages/SearchProduct';
import Login from './pages/Login';
import Register from './pages/Register';

import { loadUser } from './action/userAction';
import store from './store';
import { useEffect } from 'react';
import Profile from './pages/Profile';
import ProtectedRoute from './components/route/ProtectedRoute';
import { useSelector } from 'react-redux';

function App() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchProduct />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/me"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  loading={loading}
                >
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
