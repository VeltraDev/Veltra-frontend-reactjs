import "preline/preline";
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { store } from "./app/store";
import { AuthContextProvider } from "./context/AuthContext";
import { Toaster } from 'react-hot-toast';
import AosInit from './components/aos';
import Preline from "./components/preline";
// Thay đổi import
import BlankLayout from './layouts/BlankLayout';
import NotFound from './pages/NotFound';
import { publicRoutes } from './routes/route';
import { SocketProvider } from "./context/SocketContext";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthContextProvider>
          <SocketProvider>
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
          </SocketProvider>
        </AuthContextProvider>
      </Router>
    </Provider>
  );
}

export default App;
