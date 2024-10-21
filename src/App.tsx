import "preline/preline";
import { IStaticMethods } from "preline/preline";
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import AosInit from './components/aos';
import BlankLayout from './layouts/BlankLayout';
import NotFound from './pages/NotFound';
import { publicRoutes } from './routes/route';
import Preline from "./components/preline";
import { AuthContextProvider } from "./context/AuthContext";
import { useEffect } from "react";
import { io } from "socket.io-client";
import SocketContext from "./context/SocketContext";

const socket = io('wss://veltra2.duckdns.org');

function App() {
  


  return (
    <Router>
    <SocketContext.Provider value={socket}>
      <AuthContextProvider>
 
  
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
    
     
      </AuthContextProvider>
      </SocketContext.Provider>
    </Router>
  );
}

export default App;