import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="bg-primary py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button className="nav-button-outline min-w-[140px]">
          LOGO
        </button>
        
        <Link 
          to="/search" 
          className="nav-button-outline min-w-[180px] text-center"
        >
          DASHBOARD
        </Link>
        
        <button className="nav-button-outline min-w-[140px]">
          LOGOUT
        </button>
      </div>
    </header>
  );
};

export default Header;
