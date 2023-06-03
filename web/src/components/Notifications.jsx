import { BsCalendar2DayFill } from "@react-icons/all-files/bs/BsCalendar2DayFill";
import { BsFillFileEarmarkPersonFill } from "@react-icons/all-files/bs/BsFillFileEarmarkPersonFill";
import { FaHandHoldingUsd } from "@react-icons/all-files/fa/FaHandHoldingUsd";
import { RiCloseFill } from "@react-icons/all-files/ri/RiCloseFill";
import { RiTrophyFill } from "@react-icons/all-files/ri/RiTrophyFill";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { useNotifications } from "../contexts/NotificationsContext.jsx";
import { formatDate } from "../utils/formatDate.js";
import { getRelativeTimeString } from "../utils/getRelativeTimeString.js";

export default function Notifications() {
	const { notifications } = useNotifications();

	/** @param {number} id */
	function handleSingleDelete(id) {
		// TODO: implement
		// setNotifications((notifications) => notifications.filter((notification) => notification.id !== id));
	}

	return (
		<>
			{notifications?.length ? (
				<ListGroup>
					{notifications.map((notification) => (
						<Notification key={notification.id} {...notification} onDelete={handleSingleDelete} />
					))}
				</ListGroup>
			) : (
				<p>Não há notificações de momento</p>
			)}
		</>
	);
}

function Notification({ additionalDate, createdAt, content, type, onDelete, id }) {
	let composedDescription;
	if (additionalDate) {
		composedDescription = `${content} dia ${formatDate(new Date(additionalDate))}`;
	} else {
		composedDescription = content;
	}

	const Icon = getIcon(type);

	return (
		<ListGroup.Item className="d-flex justify-content-between align-items-center">
			<Icon size={24} />

			<div className="me-auto ps-3">
				<div className="fw-bold">{getTitle(type)}</div>
				{composedDescription}
			</div>

			<div className="d-flex justify-content-between align-items-center gap-2">
				<span style={{ fontSize: "0.8rem" }}>{getRelativeTimeString(new Date(createdAt))}</span>
				<Button className="border-0 bg-transparent p-0" onClick={() => onDelete(id)}>
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
		case 0:
			return "Nova reunião";
		case 1:
			return "Novo benefício";
		case 2:
			return "Nova vaga";
		case 3:
			return "Novo negócio";
		default:
			return "Novo evento";
	}
}

/**
 * @param {string} type
 */
function getIcon(type) {
	switch (type) {
		case 0:
			return BsCalendar2DayFill;
		case 1:
			return RiTrophyFill;
		case 2:
			return BsFillFileEarmarkPersonFill;
		case 3:
			return FaHandHoldingUsd;
		default:
			return BsCalendar2DayFill;
	}
}
