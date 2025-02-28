// App.jsx
import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Wrapper/Navbar";
import Footer from "./Wrapper/Footer";
import Loading from "./Wrapper/Loading";
import ProtectedRoute from "./Page/Protected/ProtectedRoute";
import ScrollToTop from "./ScrollToTop";


// Lazy load pages
const Home = lazy(() => import("./Page/Homepage"));
const About = lazy(() => import("./Page/About"));
const BlogPage = lazy(() => import("./Page/Blog/Blog"));
const EventPage = lazy(() => import("./Page/Eventpage"));
const Store = lazy(() => import("./Page/Store/Store"));
const GivePage = lazy(() => import("./Page/Give"));
const Metro = lazy(() => import("./Page/Ministry/MetroMeet"));
const BlogAdmin = lazy(() => import("./Page/Protected/BlogAdmin"));
const Sermon = lazy(() => import("./Page/Sermon/Sermon"));
const Radio = lazy(() => import("./Page/Stream/Radio"));
const PlanVisit = lazy(() => import("./Page/New"));
const ChurchContact = lazy(() => import("./Page/ChurchContact"));
const Prayer = lazy(() => import("./Page/Prayer"));
const Fellowship = lazy(() => import("./Page/Fellowship"));
const Devotional = lazy(() => import("./Page/Devotional"));
const BlogDetails = lazy(() => import("./Page/Blog/BlogDetails"));
const DevAdmin = lazy(() => import("./Page/Protected/DevAdmin"));
const EventAdmin = lazy(() => import("./Page/Protected/EventAdmin"));
const SermonAdmin = lazy(() => import("./Page/Protected/SermonAdmin"));
const RadioAdmin = lazy(() => import("./Page/Protected/RadioAdmin"));
const Subscriber = lazy(() => import("./Page/Protected/Subscriber"));
const Shiftings = lazy(() => import("./Page/Ministry/Shiftings"));
const Acada = lazy(() => import("./Page/Ministry/Acada"));
const Street = lazy(() => import("./Page/Ministry/Street"));
const Sign = lazy(() => import("./Page/Ministry/Signs"));
const Admin = lazy(() => import("./Page/Admin"));
const Login = lazy(() => import("./Page/Protected/Login"));
const PageNotFound = lazy(() => import("./Page/PageNotFound"));
const Register = lazy(() => import("./Page/Protected/Register"));
const SermonV = lazy(() => import("./Page/Sermon/SermonV"));
const Tv = lazy(() => import("./Page/Stream/Tv"));


function App() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        <Suspense fallback={<Loading />}>
        <ScrollToTop/>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/events" element={<EventPage />} />
            <Route path="/store" element={<Store />} />
            <Route path="/give" element={<GivePage />} />
            <Route path="/metro-meet" element={<Metro />} />
            <Route path="/sermons" element={<Sermon />} />
            <Route path="/radio" element={<Radio />} />
            <Route path="/new" element={<PlanVisit />} />
            <Route path="/contact" element={<ChurchContact />} />
            <Route path="/prayer" element={<Prayer />} />
            <Route path="/fellowship" element={<Fellowship />} />
            <Route path="/devotional" element={<Devotional />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/signs-and-wonders" element={<Sign />} />
            <Route path="/street-church" element={<Street />} />
            <Route path="/acada-clinic" element={<Acada />} />
            <Route path="/shiftings-and-turnings" element={<Shiftings />} />
            <Route path="/Sermon-Video" element={<SermonV />} />
            <Route path="/Tv" element={<Tv />} />
            <Route path="/admin" element={<Admin />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/blog"
              element={
                <ProtectedRoute allowedEmails={["operowland@gmail.com", "barryjacob08@gmail.com"]}>
                  <BlogAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/devotional"
              element={
                <ProtectedRoute allowedEmails={["operowland@gmail.com", "barryjacob08@gmail.com"]}>
                  <DevAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/calendar"
              element={
                <ProtectedRoute allowedEmails={["operowland@gmail.com", "barryjacob08@gmail.com"]}>
                  <EventAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/sermon-audio"
              element={
                <ProtectedRoute allowedEmails={["operowland@gmail.com", "barryjacob08@gmail.com"]}>
                  <SermonAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/radio"
              element={
                <ProtectedRoute allowedEmails={["operowland@gmail.com", "barryjacob08@gmail.com"]}>
                  <RadioAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/contacts"
              element={
                <ProtectedRoute allowedEmails={["operowland@gmail.com", "barryjacob08@gmail.com"]}>
                  <Subscriber />
                </ProtectedRoute>
              }
            />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            


            {/* Catch-all for 404 */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </>
  );
}

export default App;