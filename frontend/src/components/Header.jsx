import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Helper for active link underline
  const navLinkClass = (path) =>
    `relative px-2 py-1 transition-colors font-medium
     ${location.pathname === path
        ? "text-blue-100 after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-white after:rounded-full"
        : "text-blue-200 hover:text-white"}`;

  return (
    <header className="bg-blue-700 text-white shadow">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6 relative">
        {/* Left: Logo */}
        <div className="flex-1 flex items-center">
          <Link to="/" className="text-2xl font-extrabold tracking-tight hover:opacity-80 transition-opacity">
            BookMySlot
          </Link>
        </div>

        {/* Center: Home & Create Event */}
        <div className="hidden md:flex flex-1 justify-center space-x-8">
          <Link to="/" className={navLinkClass("/")}>Home</Link>
          <Link to="/create-event" className={navLinkClass("/create-event")}>Create Event</Link>
        </div>

        {/* Right: My Bookings */}
        <div className="flex-1 flex justify-end items-center">
          <div className="hidden md:flex">
            <Link to="/my-bookings" className={navLinkClass("/my-bookings")}>My Bookings</Link>
          </div>
          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 ml-2 rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Open menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-800">
          <div className="flex flex-col items-stretch px-6 py-2 space-y-1">
            <Link to="/" className={navLinkClass("/")} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/create-event" className={navLinkClass("/create-event")} onClick={() => setMenuOpen(false)}>Create Event</Link>
            <Link to="/my-bookings" className={navLinkClass("/my-bookings")} onClick={() => setMenuOpen(false)}>My Bookings</Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
