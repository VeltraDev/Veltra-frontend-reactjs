import "preline/preline";
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';


import { Toaster } from 'react-hot-toast';
import AosInit from './components/aos';
import Preline from "./components/preline";
// Thay đổi import
import BlankLayout from './layouts/BlankLayout';
import NotFound from './pages/NotFound';
import { publicRoutes } from './routes/route';


import { SocketProvider } from "./contexts/SocketContext";
import { store } from "./redux/store";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <SocketProvider>
            <ThemeProvider>
              <Toaster position="top-right" />
              <Preline />
              <AosInit />
              <Routes>
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
                <Route
                  path="*"
                  element={
                    <BlankLayout>
                      <NotFound />
                    </BlankLayout>
                  }
                />
              </Routes>
            </ThemeProvider>
          </SocketProvider>
        </AuthProvider>
      </Router>
    </Provider>
    </QueryClientProvider>
  );
}

export default App;
