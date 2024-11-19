// src/App.tsx

import "preline/preline";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';
import AosInit from './components/aos';
import Preline from "./components/preline";
import BlankLayout from './layouts/BlankLayout';
import NotFound from './pages/NotFound';
import { publicRoutes, protectedRoutes, adminRoutes } from './routes/route';

import { SocketProvider } from "./contexts/SocketContext";
import { store } from "./redux/store";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";

import ProtectedRoute from './components/routes/ProtectedRoute';
import RoleProtectedRoute from './components/routes/RoleProtectedRoute';
import NotAuthorized from './pages/NotAuthorized';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <SocketProvider>
            <ThemeProvider>
              <Toaster position="top-right" />
              <Preline />
              <AosInit />
              <Routes>
                {/* Public Routes */}
                {publicRoutes.map((route, index) => {
                  const Page = route.component;
                  const Layout = route.layout || BlankLayout;
                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        <Layout>
                          <Page />
                        </Layout>
                      }
                    />
                  );
                })}

                {/* Protected Routes */}
                {protectedRoutes.map((route, index) => {
                  const Page = route.component;
                  const Layout = route.layout || BlankLayout;
                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        <ProtectedRoute>
                          <Layout>
                            <Page />
                          </Layout>
                        </ProtectedRoute>
                      }
                    />
                  );
                })}

                {/* Admin Routes */}
                {adminRoutes.map((route, index) => {
                  const Page = route.component;
                  const Layout = route.layout || BlankLayout;
                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        <RoleProtectedRoute roles={route.roles || []}>
                          <Layout>
                            <Page />
                          </Layout>
                        </RoleProtectedRoute>
                      }
                    />
                  );
                })}

                {/* Not Authorized Route */}
                <Route path="/not-authorized" element={<NotAuthorized />} />

                {/* Fallback Route */}
                <Route path="*" element={<BlankLayout><NotFound /></BlankLayout>} />
              </Routes>
            </ThemeProvider>
          </SocketProvider>
        </AuthProvider>
      </Router>
    </Provider>
  );
}

export default App;