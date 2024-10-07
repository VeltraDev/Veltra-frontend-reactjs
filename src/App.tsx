import "preline/preline";
import { IStaticMethods } from "preline/preline";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AosInit from './components/aos';
import BlankLayout from './layouts/BlankLayout';
import NotFound from './pages/NotFound';
import { publicRoutes } from './routes/route';
import Preline from "./components/preline";

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;