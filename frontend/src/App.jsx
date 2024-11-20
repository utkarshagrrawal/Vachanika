import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
import TermsAndConditions from "./pages/tc";
import UserProfile from "./pages/userProfile";
import Goodbye from "./pages/goodbye";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/user/profile"
          element={<Navigate to="/user/profile/personal" />}
        />
        <Route path="/user/profile/:area" element={<UserProfile />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/goodbye/:deletionToken" element={<Goodbye />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
