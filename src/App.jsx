import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './Layout';
import NotFoundPage from '@/components/pages/NotFoundPage';
import { AuthProvider } from '@/context/AuthContext';
import { routes } from '@/config/routes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              {Object.values(routes).map((route) => (
                <Route
                  key={route.id}
                  path={route.path}
                  element={<route.component />}
                />
              ))}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
          <ToastContainer
            position="top-right"
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            className="z-[9999]"
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;