import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  // Read username from localStorage (set this in LoginPage on successful login)
  const username = localStorage.getItem("username") || "test";

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-primary py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button className="nav-button-outline min-w-[140px]">LOGO</button>

        <Link to="/search" className="nav-button-outline min-w-[180px] text-center">
          DASHBOARD
        </Link>

        <div className="flex items-center gap-3">
          {/* small text showing who is logged in */}
          <span className="text-primary-foreground/90 text-xs sm:text-sm">
            Signed in as <span className="font-semibold">{username}</span>
          </span>

          <button onClick={handleLogout} className="nav-button-outline min-w-[140px]">
            LOGOUT
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
