import { useState } from "react";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import NavbarBrand from "react-bootstrap/NavbarBrand";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { BiBell } from "react-icons/bi";
import { BsCalendar2DayFill, BsFillFileEarmarkPersonFill } from "react-icons/bs";
import { FaHandHoldingUsd, FaRegUserCircle } from "react-icons/fa";
import { RiCloseFill, RiTrophyFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import softinsaSvg from "../assets/softinsa.svg";
import { getRelativeTimeString } from "../utils/getRelativeTimeString.js";

/**
 * @param {Object} props
 * @param {string} props.page
 */
export function NavBar({ page }) {
	const [notifications, setNotifications] = useState([
		{
			id: 1,
			description: "Reunião dia ",
			appendDate: new Date(2023, 9, 25),
			createdAt: new Date().setTime(new Date().getTime() - 2 * 60 * 60 * 1000),
			type: "event",
		},
		{
			id: 2,
			description: "Pasta dos Dentes",
			createdAt: new Date().setTime(new Date().getTime() - 2 * 60 * 60 * 1000),
			type: "beneficio",
		},
		{
			id: 3,
			description: "Limpeza",
			createdAt: new Date().setTime(new Date().getTime() - 2 * 60 * 60 * 1000),
			type: "vaga",
		},
		{
			id: 4,
			description: "Google",
			createdAt: new Date().setTime(new Date().getTime() - 2 * 60 * 60 * 1000),
			type: "negocio",
		},
	]);

	function handleDeleteAll() {
		setNotifications([]);
	}

	/**
	 * @param {number} id
	 */
	function handleSingleDelete(id) {
		setNotifications((notifications) => notifications.filter((notification) => notification.id !== id));
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
									<Button
										className="bg-transparent text-black border-0"
										onClick={handleDeleteAll}
										disabled={!notifications.length}
									>
										Apagar todas
									</Button>
								</div>
							</Popover.Header>

							<Popover.Body>
								{notifications.length ? (
									<ListGroup>
										{notifications.map((notification) => (
											<Notification key={notification.id} {...notification} onDelete={handleSingleDelete} />
										))}
									</ListGroup>
								) : (
									<p>Não há notificações de momento</p>
								)}
							</Popover.Body>
						</Popover>
					}
				>
					<Button className="bg-transparent border-0">
						<BiBell color="white" size={24} />
					</Button>
				</OverlayTrigger>

				<Link to="/login">
					<FaRegUserCircle color="white" size={24} />
				</Link>
			</Nav>
		</BootstrapNavbar>
	);
}

function Notification({ description, appendDate, createdAt, type, onDelete, id }) {
	let composedDescription;
	if (appendDate) {
		const formatter = new Intl.DateTimeFormat("pt-PT", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",

			hour: "2-digit",
			minute: "2-digit",
		});

		composedDescription = `${description} dia ${formatter.format(createdAt)}`;
	} else {
		composedDescription = description;
	}

	const Icon = getIcon(type);

	return (
		<ListGroup.Item className="d-flex justify-content-between align-items-center">
			<Icon size={24} />

			<div className="ps-3 me-auto">
				<div className="fw-bold">{getTitle(type)}</div>
				{composedDescription}
			</div>

			<div className="d-flex gap-2 justify-content-between align-items-center">
				<span style={{ fontSize: "0.8rem" }}>{getRelativeTimeString(createdAt)}</span>
				<Button className="bg-transparent border-0 px-0" onClick={() => onDelete(id)}>
					<RiCloseFill size={24} color="black" />
				</Button>
			</div>
		</ListGroup.Item>
	);
}

/**
 * @param {string} type
 */
function getTitle(type) {
	switch (type) {
		case "beneficio":
			return "Novo benefício";
		case "vaga":
			return "Nova vaga";
		case "negocio":
			return "Novo negócio";
		case "evento":
		default:
			return "Novo evento";
	}
}

/**
 * @param {string} type
 */
function getIcon(type) {
	switch (type) {
		case "beneficio":
			return RiTrophyFill;
		case "vaga":
			return BsFillFileEarmarkPersonFill;
		case "negocio":
			return FaHandHoldingUsd;
		case "evento":
		default:
			return BsCalendar2DayFill;
	}
}

/**
 * @param {string} page
 * @param {string} path
 */
function getSelectedClass(page, path) {
	return page === path ? "active nav-link" : "nav-link";
}
