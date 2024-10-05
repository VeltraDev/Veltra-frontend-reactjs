import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes/route';
import LandingLayout from './layouts/LandingLayout';
import BlankLayout from './layouts/BlankLayout';
import NotFound from './pages/NotFound';
import Test from './components/ui/Test';
import AosInit from './components/aos';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;