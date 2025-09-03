import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import MainPage from "./pages/MainPage";
import ForgotPassword from "./pages/ForgetPassword";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import SharedBlogPage from "./pages/SharedBlogPage";
import ProfilePage from "./pages/profilePage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/share/:shareid" element={<SharedBlogPage />} />
        <Route
          path="/blog/:id"
          element={
            <ProtectedRoute>
              <BlogDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mainpage"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profilepage"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
