import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
import TermsAndConditions from "./pages/tc";
import UserProfile from "./pages/userProfile";
import Goodbye from "./pages/goodbye";
import NotFound from "./pages/notFound";
import BrowseBooks from "./pages/browse";
import ManageBooks from "./pages/manageBooks";
import Book from "./pages/book";
import Signout from "./pages/signout";
import BorrowHistory from "./pages/borrowHistory";
import AdminProfile from "./pages/adminProfile";
import Wishlist from "./pages/wishlist";

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
        <Route path="/signout" element={<Signout />} />
        <Route path="/goodbye/:deletionToken" element={<Goodbye />} />
        <Route path="/browse" element={<BrowseBooks />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route
          path="/manage-books"
          element={<Navigate to="/manage-books/search" />}
        />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/admin/dashboard" element={<AdminProfile />} />
        <Route path="/book/:isbn" element={<Book />} />
        <Route path="/manage-books/:section" element={<ManageBooks />} />
        <Route path="/borrow-history" element={<BorrowHistory />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
