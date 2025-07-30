import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import MainPage from "./pages/MainPage";
import ForgetPassword from "./pages/ForgetPassword";
import BlogDetailsPage from "./pages/BlogDetailsPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/blog/:id" element={<BlogDetailsPage />} />
        <Route
          path="/mainpage"
          element={
              <MainPage />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
