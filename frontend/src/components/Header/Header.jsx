import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import LangSwitcher from "./LangSwitcher/LangSwitcher";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHomeTop = location.pathname === "/" && location.hash === "";
  const isTeams = location.pathname === "/" && location.hash === "#teams";

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-left">
          <Link
            to="/"
            className={`nav-link ${isHomeTop ? "active" : ""}`}
            onClick={(e) => {
              if (location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                navigate("/");
              }
            }}
          >
            Головна
          </Link>

          <Link to="/massagePage" className="nav-link">
            Види масажу
          </Link>

          <NavLink to="/certificates" className="nav-link">
            Сертифікати
          </NavLink>

          <Link
            to="/#teams"
            className={`nav-link ${isTeams ? "active" : ""}`}
          >
            Команда
          </Link>

          <NavLink to="/contacts" className="nav-link">
            Контакти
          </NavLink>

          <NavLink to="/faq" className="nav-link">
            FAQ
          </NavLink>
        </div>

        <div className="nav-center">
          <NavLink
            to="/"
            className="nav-logo"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            <img src="/images/HomePage/logo/logo.png" alt="Logo" />
          </NavLink>
        </div>
{/* Right side */}
          <div className="nav-right">
            <div className="nav-info">
              <span className="nav-item">
                <span className="icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 22s7-7.2 7-13a7 7 0 1 0-14 0c0 5.8 7 13 7 13Z"
                      stroke="#6AA84F"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="9"
                      r="2.5"
                      stroke="#6AA84F"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
                Луцьк
              </span>

              <a href="tel:+48733661128" className="nav-item">
                <span className="icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 16.9v3a2 2 0 0 1-2.2 2
                        19.8 19.8 0 0 1-8.6-3
                        19.5 19.5 0 0 1-6-6
                        19.8 19.8 0 0 1-3-8.6
                        A2 2 0 0 1 4.1 2h3
                        a2 2 0 0 1 2 1.7
                        c.1 1 .4 2 .7 2.9
                        a2 2 0 0 1-.5 2.1L8 9
                        a16 16 0 0 0 7 7
                        l.3-1.3
                        a2 2 0 0 1 2.1-.5
                        c.9.3 1.9.6 2.9.7
                        a2 2 0 0 1 1.7 2Z"
                      stroke="#6AA84F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="header-number">+48 733 661 128</span>
              </a>

              <LangSwitcher />
            </div>
             {/* 🔥 КНОПКА ЗАПИСАТИСЬ */}
  <button
    className="btn btn-success"
    onClick={() => {
      // тимчасово
      console.log("Записатись");
    }}
  >
    ЗАПИСАТИСЬ
  </button>
          </div>
      </nav>
    </header>
  );
};

export default Header;
