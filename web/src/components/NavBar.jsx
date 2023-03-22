import Nav from "react-bootstrap/Nav";
import NavLink from "react-bootstrap/NavLink";
import BootstrapNavbar from "react-bootstrap/Navbar";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import { BiBell } from "react-icons/bi";
import { FaRegUserCircle } from "react-icons/fa";
import softinsaSvg from "../assets/softinsa.svg";

export function Navbar({ page }) {
  return (
    <BootstrapNavbar bg="primary" variant="dark">
      <NavbarBrand href="/">
        <img src={softinsaSvg} alt="Softinsa" />
      </NavbarBrand>

      <Nav className="me-auto">
        <NavLink href="/" className={getSelectedClass(page, "/")}>
          Início
        </NavLink>
        <NavLink href="/beneficios" className={getSelectedClass(page, "beneficios")}>
          Benefícios
        </NavLink>
        <NavLink href="/vagas" className={getSelectedClass(page, "vagas")}>
          Vagas
        </NavLink>
        <NavLink href="/oportunidades" className={getSelectedClass(page, "oportunidades")}>
          Oportunidades
        </NavLink>
        <NavLink href="/ideias" className={getSelectedClass(page, "ideias")}>
          Ideias
        </NavLink>
        <NavLink href="/contacto" className={getSelectedClass(page, "contacto")}>
          Contacto
        </NavLink>
      </Nav>

      <Nav>
        <div className="right-icons">
          <BiBell color="white" size={24} />

          <NavLink href="/login">
            <FaRegUserCircle color="white" size={24} />
          </NavLink>
        </div>
      </Nav>
    </BootstrapNavbar>
  );
}

function getSelectedClass(page, path) {
  return page === path ? "navbar-selected" : "";
}
