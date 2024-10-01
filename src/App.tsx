import "./App.css";
import Home from "./pages/Home";
import LandingLayout from "./layouts/LandingLayout";

function App() {
  return (
    <>
      <LandingLayout>
        <Home />
      </LandingLayout>
    </>
  );
}

export default App;
