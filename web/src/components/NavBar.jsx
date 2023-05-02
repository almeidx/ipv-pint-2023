import { Suspense, lazy, useContext } from "react";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { BiBell, BiChevronDown } from "react-icons/bi";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import softinsaSvg from "../assets/softinsa.svg";
import { UserContext } from "../contexts/UserContext.jsx";
import { API_URL } from "../utils/constants.js";
import { Spinner } from "./Spinner.jsx";

const Notifications = lazy(() => import("./Notifications.jsx"));

/**
 * @param {Object} props
 * @param {string} [props.page]
 */
export function NavBar({ page }) {
	const { user } = useContext(UserContext);

	function handleDeleteAll() {
		// setNotifications([]);
	}

	return (
		<BootstrapNavbar bg="primary" variant="dark" style={{ height: "5rem" }}>
			<Link to="/">
				<NavbarBrand>
					<img src={softinsaSvg} alt="Softinsa" />
				</NavbarBrand>
			</Link>

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
				<Link to="/negocios" className={getSelectedClass(page, "negocios")}>
					Negócios
				</Link>
				<Link to="/ideias" className={getSelectedClass(page, "ideias")}>
					Ideias
				</Link>
				<Link to="/contacto" className={getSelectedClass(page, "contacto")}>
					Contacto
				</Link>
			</Nav>

			<style>
				{`
					.popover {
						min-width: 500px !important;
						min-height: 200px !important;
					}
				`}
			</style>

			<Nav className="me-4 d-flex justify-content-center align-items-center gap-2">
				<OverlayTrigger
					trigger="click"
					key="bottom"
					placement="bottom"
					rootClose
					overlay={
						<Popover id="popover-positioned-bottom" className="nav-popover">
							<Popover.Header as="h3">
								<div className="me-auto d-flex justify-content-between align-items-center">
									Notificações
									<Button className="bg-transparent text-black border-0" onClick={handleDeleteAll} disabled={true}>
										Apagar todas
									</Button>
								</div>
							</Popover.Header>

							<Popover.Body>
								<Suspense fallback={<Spinner />}>
									<Notifications />
								</Suspense>
							</Popover.Body>
						</Popover>
					}
				>
					<Button className="bg-transparent border-0">
						<BiBell color="white" size={24} />
					</Button>
				</OverlayTrigger>

				{user ? (
					<>
						<style>
							{`
								.dropdown-toggle::after {
									display: none !important;
								}
							`}
						</style>

						<Dropdown>
							<Dropdown.Toggle variant="light" className="rounded-circle p-0 border-0">
								<BiChevronDown color="black" size={24} />
							</Dropdown.Toggle>

							<Dropdown.Menu align="end">
								<Dropdown.Header>{user.name}</Dropdown.Header>

								<li>
									<Link className="dropdown-item" to="/profile">
										Perfil
									</Link>
								</li>

								<li>
									<Link className="dropdown-item" to="/calendar">
										Calendário
									</Link>
								</li>

								<li>
									<Link className="dropdown-item" to="/admin">
										Painel de administração
									</Link>
								</li>

								<li>
									<Dropdown.Item onClick={() => window.open(API_URL + "/auth/logout", "_self")}>
										Terminar sessão
									</Dropdown.Item>
								</li>
							</Dropdown.Menu>
						</Dropdown>
					</>
				) : (
					<Link to="/login">
						<FaRegUserCircle color="white" size={24} />
					</Link>
				)}
			</Nav>
		</BootstrapNavbar>
	);
}

/**
 * @param {string|undefined} page
 * @param {string} path
 */
function getSelectedClass(page, path) {
	return page === path ? "active nav-link" : "nav-link";
}
