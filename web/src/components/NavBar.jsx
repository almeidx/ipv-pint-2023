import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import { BiBell } from "react-icons/bi";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import softinsaSvg from "../assets/softinsa.svg";

/**
 * @param {Object} props
 * @param {string} props.page
 */
export function NavBar({ page }) {
	return (
		<BootstrapNavbar bg="primary" variant="dark" style={{ height: "5rem" }}>
			<NavbarBrand href="/">
				<img src={softinsaSvg} alt="Softinsa" />
			</NavbarBrand>

			<Nav className="me-auto">
				<Link to="/" className={getSelectedClass(page, "/")}>
					Início
				</Link>
				<Link to="/beneficios" className={getSelectedClass(page, "beneficios")}>
					Benefícios
				</Link>
				<Link to="/vagas" className={getSelectedClass(page, "vagas")}>
					Vagas
				</Link>
				<Link to="/oportunidades" className={getSelectedClass(page, "oportunidades")}>
					Oportunidades
				</Link>
				<Link to="/ideias" className={getSelectedClass(page, "ideias")}>
					Ideias
				</Link>
				<Link to="/contacto" className={getSelectedClass(page, "contacto")}>
					Contacto
				</Link>
			</Nav>

			<Nav className="me-4 d-flex justify-content-center align-items-center gap-3">
				<BiBell color="white" size={24} />

				<Link to="/login">
					<FaRegUserCircle color="white" size={24} />
				</Link>
			</Nav>
		</BootstrapNavbar>
	);
}

/**
 * @param {string} page
 * @param {string} path
 */
function getSelectedClass(page, path) {
	return page === path ? "active nav-link" : "nav-link";
}
