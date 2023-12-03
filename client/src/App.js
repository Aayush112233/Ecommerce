import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage.js";
import { LoginSignUp } from "./pages/LoginSignUp.js";

function App() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/login" element={<LoginSignUp />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
