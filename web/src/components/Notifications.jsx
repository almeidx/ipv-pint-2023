import { BsCalendar2DayFill } from "@react-icons/all-files/bs/BsCalendar2DayFill";
import { BsFillFileEarmarkPersonFill } from "@react-icons/all-files/bs/BsFillFileEarmarkPersonFill";
import { FaHandHoldingUsd } from "@react-icons/all-files/fa/FaHandHoldingUsd";
import { RiTrophyFill } from "@react-icons/all-files/ri/RiTrophyFill";
import { TbCheck } from "@react-icons/all-files/tb/TbCheck";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { useNotifications } from "../contexts/NotificationsContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { API_URL } from "../utils/constants.js";
import { formatDate } from "../utils/formatDate.js";
import { getRelativeTimeString } from "../utils/getRelativeTimeString.js";
import { Toast } from "./Toast.jsx";

export default function Notifications() {
	const { notifications, mutate } = useNotifications();
	const { showToast, showToastWithMessage, toastMessage, toastType, toggleToast } = useToast();

	/** @param {number} id */
	async function handleSingleSeen(id) {
		try {
			const response = await fetch(`${API_URL}/notificacoes/${id}`, {
				credentials: "include",
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ seen: true }),
			});

			if (!response.ok) {
				throw new Error("Erro ao marcar a notificação como lida", { cause: response });
			}

			mutate();
		} catch (error) {
			console.error(error);

			showToastWithMessage("Não foi possível marcar a notificação como lida", "error");
		}
	}

	return (
		<>
			<Toast hide={() => toggleToast(false)} show={showToast} message={toastMessage} type={toastType} />

			{notifications?.length ? (
				<ListGroup>
					{notifications.map((notification) => (
						<Notification key={notification.id} {...notification} onSeen={handleSingleSeen} />
					))}
				</ListGroup>
			) : (
				<p>Não há notificações de momento</p>
			)}
		</>
	);
}

function Notification({ additionalDate, createdAt, content, type, onSeen, id }) {
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
				<Button className="border-0 bg-transparent p-0" onClick={() => onSeen(id)}>
					<TbCheck size={24} color="black" />
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
