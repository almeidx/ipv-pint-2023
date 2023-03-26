import { RiFacebookCircleFill, RiLinkedinBoxLine, RiInstagramLine } from "react-icons/ri";
import softinsaLogoSmall from "../assets/softinsa-logo-small.svg";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer
      className="d-flex flex-wrap justify-content-between align-items-center pt-4 pb-5 border-top px-5"
      style={{ backgroundColor: "#3f51b5" }}
    >
      <div className="col-md-4 d-flex align-items-center">
        <Link to="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
          <img src={softinsaLogoSmall} alt="" />
        </Link>

        <span className="mb-3 mb-md-0 text-white">© {new Date().getFullYear()} Softinsa</span>
      </div>

      <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
        <li className="ms-3">
          <a href="https://www.facebook.com/Softinsa">
            <RiFacebookCircleFill color="white" />
          </a>
        </li>

        <li className="ms-3">
          <a href="https://www.instagram.com/softinsa">
            <RiInstagramLine color="white" />
          </a>
        </li>

        <li className="ms-3">
          <a href="https://www.linkedin.com/company/softinsa">
            <RiLinkedinBoxLine color="white" />
          </a>
        </li>
      </ul>
    </footer>
  );
}
