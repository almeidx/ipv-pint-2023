import "bootstrap-icons/font/bootstrap-icons.css";

import FullCalendar from "@fullcalendar/react";
// O import de cima tem que ser feito primeiro
import bootstrapPlugin from "@fullcalendar/bootstrap5";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import useSWR from "swr";
import { Page } from "../components/Page.jsx";
import { API_URL } from "../utils/constants.js";
import { fetcher } from "../utils/fetcher.js";
import { formatDate } from "../utils/formatDate.js";

export function Calendar() {
	const [showDayModal, setShowDayModal] = useState(false);
	const [showEventModal, setShowEventModal] = useState(false);
	const [dayModalData, setDayModalData] = useState(null);
	const [eventModalData, setEventModalData] = useState(null);
	const { data, isLoading } = useSWR(`${API_URL}/events`, fetcher);

	/** @param {import('@fullcalendar/interaction').DateClickArg} data */
	function handleDateClick(data) {
		setDayModalData(data);
		setShowDayModal(true);
	}

	/** @param {import("@fullcalendar/core").EventClickArg} data */
	function handleEventClick(data) {
		setEventModalData(data);
		setShowEventModal(true);
	}

	return (
		<Page>
			<DayModal
				show={showDayModal}
				onHide={() => {
					setShowDayModal(false);
					setDayModalData(null);
				}}
				data={dayModalData}
				events={data}
			/>

			<EventModal
				show={showEventModal}
				onHide={() => {
					setShowEventModal(false);
					setEventModalData(null);
				}}
				data={eventModalData}
			/>

			<Container className="d-flex justify-content-center align-items-center py-5">
				<style>
					{`
						.fc-day {
							background-color: white;
						}
					`}
				</style>

				<FullCalendar
					plugins={[dayGridPlugin, interactionPlugin, bootstrapPlugin]}
					initialView="dayGridMonth"
					events={(data ?? []).map(mapEventToCalendarFormat)}
					dateClick={handleDateClick}
					height="auto"
					locale={ptBrLocale}
					eventClick={handleEventClick}
					themeSystem="bootstrap5"
				/>
			</Container>
		</Page>
	);
}

/**
 * @param {Object} props
 * @param {boolean} props.show
 * @param {() => void} props.onHide
 * @param {import('@fullcalendar/interaction').DateClickArg?} props.data
 */
function DayModal({ show, onHide, data, events }) {
	const dayEvents = useMemo(() => {
		if (!data) return [];
		return events.filter((event) => isInSameDay(event.startTime, data.dateStr));
	}, [data, events]);

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>{data?.dateStr}</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				{dayEvents.length ? (
					<ol>
						{dayEvents.map((event) => (
							<li key={event.id}>
								<p>
									<span className="fw-bold">{getHours(event.startTime)}</span>
									{" - "}
									{event.title}
								</p>
							</li>
						))}
					</ol>
				) : (
					<p>Não tem nenhum evento marcado para este dia</p>
				)}
			</Modal.Body>

			<Modal.Footer>
				<Button variant="secondary" onClick={onHide}>
					Fechar
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

/**
 * @param {Object} props
 * @param {boolean} props.show
 * @param {() => void} props.onHide
 * @param {import("@fullcalendar/core").EventClickArg?} props.data
 */
function EventModal({ show, onHide, data }) {
	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>{data?.event.title}</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<span className="fw-bold">Assunto</span>
				<p>{data?.event.extendedProps.subject}</p>

				<span className="fw-bold">Titulo</span>
				<p>{data?.event.extendedProps.title}</p>

				<span className="fw-bold">Descrição</span>
				<p>{data?.event.extendedProps.description}</p>

				<span className="fw-bold">Data</span>
				<p>{data ? formatDate(new Date(data.event.extendedProps.startTime), true) : null}</p>
			</Modal.Body>

			<Modal.Footer>
				<Button variant="secondary" onClick={onHide}>
					Fechar
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

function mapEventToCalendarFormat(event) {
	return {
		title: event.title,
		date: event.startTime,
		extendedProps: event,
	};
}

/**
 * @param {string|Date} date1
 * @param {string|Date} date2
 */
function isInSameDay(date1, date2) {
	const date1_ = new Date(date1);
	const date2_ = new Date(date2);

	return (
		date1_.getFullYear() === date2_.getFullYear() &&
		date1_.getMonth() === date2_.getMonth() &&
		date1_.getDate() === date2_.getDate()
	);
}

/** @param {string} date */
function getHours(date) {
	const date_ = new Date(date);
	return `${padLeft(date_.getHours())}:${padLeft(date_.getMinutes())}`;
}

/** @param {number} n */
function padLeft(n) {
	return n.toString().padStart(2, "0");
}
