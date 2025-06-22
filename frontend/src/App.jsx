import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import EventDetailPage from "./pages/EventDetailPage";
import CreateEventPage from "./pages/CreateEventPage";
import MyBookingsPage from "./pages/MyBookingsPage";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="min-h-[80vh]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:eventId" element={<EventDetailPage />} />
          <Route path="/create-event" element={<CreateEventPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
