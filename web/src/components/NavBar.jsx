import { BiBell } from "@react-icons/all-files/bi/BiBell";
import { BiChevronDown } from "@react-icons/all-files/bi/BiChevronDown";
import { FaRegUserCircle } from "@react-icons/all-files/fa/FaRegUserCircle";
import { MdOutlinePersonOutline } from "@react-icons/all-files/md/MdOutlinePersonOutline";
import { Suspense, lazy } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";
import { useNotifications } from "../contexts/NotificationsContext.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import { API_URL } from "../utils/constants.js";
import { isColaborador } from "../utils/permissions.js";
import { Spinner } from "./Spinner.jsx";
import { Softinsa } from "./icons/Softinsa.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { Toast } from "./Toast.jsx";

const Notifications = lazy(() => import("./Notifications.jsx"));

const navLinks = [
	{ name: "Início", path: "/" },
	{ name: "Benefícios", path: "/beneficios" },
	{ name: "Vagas", path: "/vagas" },
	{ name: "Oportunidades", path: "/negocios", requireLogin: true },
	{ name: "Ideias", path: "/ideias", requireLogin: true },
	{ name: "Contacto", path: "/contacto" },
];

/**
 * @param {Object} props
 * @param {string} [props.page]
 */
export function NavBar({ page }) {
	const { user } = useUser();
	const { notifications, mutate } = useNotifications();
	const { toastMessage, toastType, hide, showToastWithMessage, showToast } = useToast();

	async function handleMarcarNotificacoesComoLidas() {
		try {
			const response = await fetch(`${API_URL}/notificacoes/seen-all`, {
				credentials: "include",
				method: "POST",
			});

			if (!response.ok) {
				throw new Error("Erro ao marcar as notificações como lidas", { cause: response });
			}

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Não foi possível marcar todas as notificações como lidas", "error");
		}
	}

	return (
		<BootstrapNavbar bg="primary" variant="dark" style={{ height: "5rem" }}>
			<Toast hide={hide} message={toastMessage} show={showToast} type={toastType} />

			<Link to="/">
				<NavbarBrand>
					<Softinsa />
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
									<Button
										className="border-0 bg-transparent p-0 text-black"
										onClick={handleMarcarNotificacoesComoLidas}
										disabled={!notifications || notifications.length === 0}
									>
										Marcar todas como lidas
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
					<Button className="position-relative border-0 bg-transparent" disabled={user === null}>
						<BiBell color="white" size={24}></BiBell>

						{notifications?.length ? (
							<>
								<Badge
									bg="danger"
									pill
									className="position-absolute"
									style={{ top: "20px", right: "1px", fontSize: "0.7rem" }}
								>
									{notifications.length}
								</Badge>
								<span className="visually-hidden">notificações não lidas</span>
							</>
						) : null}
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
							<Dropdown.Toggle variant="light" className="position-relative border-0 bg-transparent p-0 text-white">
								<MdOutlinePersonOutline size={28} />

								<BiChevronDown color="white" size={28} />
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

								{isColaborador(user) ? (
									<li>
										<Link className="dropdown-item" to="/admin">
											Painel de administração
										</Link>
									</li>
								) : null}

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
