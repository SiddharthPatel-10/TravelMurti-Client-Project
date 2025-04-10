import "./App.css";
import React, { useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { setUser } from "./redux/userSlice";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import ContactForm from "./components/ContactForm";
import PageNotFound from "./components/PageNotFound";
import { toast } from "react-hot-toast";
import SubNavbar from "./components/SubNavbar";
import WeAreHiring from "./components/WeAreHiring";
import UpdateJobForm from "./components/UpdateJobForm";
import ScrollToTop from "./ScrollToTop";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import RequestOtp from "./components/RequestOtp";
import VerifyOtp from "./components/VerifyOtp";
import WeekendTours from "./components/WeekendTours";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndConditions";
import CancellationRefundPolicy from "./components/CancellationRefundPolicy";
import TourPackageBookingTerms from "./components/TourPackageBookingTerms";

// Lazy load your components
const Home = lazy(() => import("./components/Home"));
const SubPackageDetails = lazy(() => import("./components/SubPackageDetails"));
const NestedSubPackageDetails = lazy(() =>
  import("./components/NestedSubPackageDetails")
);
const Login = lazy(() => import("./components/Login"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const RegisterEmployee = lazy(() => import("./components/RegisterEmployee"));
const SubPackageManager = lazy(() => import("./components/SubPackageManager"));
const AdminUsersTable = lazy(() => import("./components/AdminUsersTable"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const AboutUs = lazy(() => import("./components/AboutUs"));
const ContactUs = lazy(() => import("./components/ContactUs"));

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // Fetch user data and set it in Redux (simulate login)
  useEffect(() => {
    const fetchedUserData = { role: "admin", authToken: "sample_token" };
    dispatch(setUser(fetchedUserData));
  }, [dispatch]);

  // Log token and role from Redux
  useEffect(() => {
    // console.log("User Token:", user.authToken);
    // console.log("User Role:", user.role);
  }, [user]);

  // Block shortcuts for opening developer tools
  // useEffect(() => {
  //   const blockDevTools = (event) => {
  //     if (
  //       (event.ctrlKey &&
  //         event.shiftKey &&
  //         (event.key === "I" || event.key === "J" || event.key === "C")) ||
  //       (event.ctrlKey && event.key === "U") ||
  //       event.key === "F12" ||
  //       (event.metaKey &&
  //         event.shiftKey &&
  //         (event.key === "I" || event.key === "J" || event.key === "C")) ||
  //       (event.metaKey && event.key === "U")
  //     ) {
  //       event.preventDefault();
  //       toast.error("Developer tools are disabled on this site.", {
  //         position: "top-right",
  //       });
  //     }
  //   };

  //   const blockContextMenu = (event) => event.preventDefault();

  //   window.addEventListener("keydown", blockDevTools);
  //   window.addEventListener("contextmenu", blockContextMenu);

  //   return () => {
  //     window.removeEventListener("keydown", blockDevTools);
  //     window.removeEventListener("contextmenu", blockContextMenu);
  //   };
  // }, []);

  // Admin dashboard path check is moved into a child component
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

function MainApp() {
  const location = useLocation();
  const isSpecialRoute = [
    "/admin-dashboard",
    "/admin/login",
    "/employee",
    "/create-employee",
    "/update-we-are-hiring",
    "/request-otp",
    "/verify-otp",
    "/reset-password",
  ].includes(location.pathname);

  return (
    <>
      {/* Add ScrollToTop here to monitor route changes */}
      <ScrollToTop />
      {/* Conditionally render Navbar, ContactForm, and Footer based on the current route */}
      {!isSpecialRoute && <Navbar />}
      {!isSpecialRoute && <SubNavbar />}

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/we-are-hiring" element={<WeAreHiring />} />
          <Route path="/update-we-are-hiring" element={<UpdateJobForm />} />
          <Route path="/weekend-tours" element={<WeekendTours />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsAndConditions />} />
          <Route
            path="/cancellation-refund-policy"
            element={<CancellationRefundPolicy />}
          />
          <Route
            path="/tour-booking-t-c"
            element={<TourPackageBookingTerms />}
          />
          <Route
            path="/subpackages/:subPackageId"
            element={<SubPackageDetails />}
          />
          <Route
            path="/subpackages/:subPackageId/:nestedSubPackageId"
            element={<NestedSubPackageDetails />}
          />

          {/* Auth Routes */}
          <Route path="/create-employee" element={<RegisterEmployee />} />
          <Route path="/admin/sub-packages" element={<SubPackageManager />} />
          <Route path="/admin/users" element={<AdminUsersTable />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/request-otp" element={<RequestOtp />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee"
            element={
              <ProtectedRoute roles={["employee"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>

      {/* Conditionally render Chatbot, ContactForm, and Footer */}
      {!isSpecialRoute && <Chatbot />}
      {!isSpecialRoute && <ContactForm />}
      {!isSpecialRoute && <Footer />}
      {/* {!isSpecialRoute && <UpdateJobForm />} */}
    </>
  );
}

export default App;
// perfectly working all done!
