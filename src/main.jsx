import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="597086366963-urkmlk5dehrvqc3kt1b793gaj587ep51.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
