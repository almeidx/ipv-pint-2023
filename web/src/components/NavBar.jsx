import { Suspense, lazy } from "react";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Tooltip from "react-bootstrap/Tooltip";
import { BiBell, BiChevronDown } from "react-icons/bi";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import softinsaSvg from "../assets/softinsa.svg";
import { useUser } from "../contexts/UserContext.jsx";
import { API_URL } from "../utils/constants.js";
import { Spinner } from "./Spinner.jsx";

const Notifications = lazy(() => import("./Notifications.jsx"));

const navLinks = [
	{ name: "Início", path: "/" },
	{ name: "Benefícios", path: "/beneficios" },
	{ name: "Vagas", path: "/vagas" },
	{ name: "Negócios", path: "/negocios", requireLogin: true },
	{ name: "Ideias", path: "/ideias", requireLogin: true },
	{ name: "Contacto", path: "/contacto" },
];

/**
 * @param {Object} props
 * @param {string} [props.page]
 */
export function NavBar({ page }) {
	const { user } = useUser();

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
				{navLinks.map(({ name, path, requireLogin }) =>
					requireLogin && user === null ? (
						<OverlayTrigger
							key={`${path}-trigger`}
							placement="bottom"
							overlay={<Tooltip id={`${page}-tooltip`}>Inicie a sessão para ver esta página</Tooltip>}
						>
							<Link key={path} to="/login" className={getSelectedClass(page, path)}>
								{name}
							</Link>
						</OverlayTrigger>
					) : (
						<Link key={path} to={path} className={getSelectedClass(page, path)}>
							{name}
						</Link>
					),
				)}
			</Nav>

			<style>
				{`
					.popover {
						min-width: 500px !important;
						min-height: 200px !important;
					}
				`}
			</style>

			<Nav className="d-flex justify-content-center align-items-center me-4 gap-2">
				<OverlayTrigger
					trigger="click"
					key="bottom"
					placement="bottom"
					rootClose
					overlay={
						<Popover id="popover-positioned-bottom" className="nav-popover">
							<Popover.Header as="h3">
								<div className="d-flex justify-content-between align-items-center me-auto">
									Notificações
									<Button className="border-0 bg-transparent p-0 text-black" onClick={handleDeleteAll} disabled={true}>
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
					<Button className="border-0 bg-transparent" disabled={user === null}>
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
							<Dropdown.Toggle variant="light" className="rounded-circle border-0 p-0">
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
									<Dropdown.Item onClick={() => window.open(`${API_URL}/auth/logout`, "_self")}>
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
