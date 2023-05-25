import FullCalendar from '@fullcalendar/react';
// O import de cima tem que ser feito primeiro
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import Container from "react-bootstrap/Container";
import { Page } from "../components/Page.jsx";

export function Calendar() {
	/** @param {import('@fullcalendar/interaction').DateClickArg} data */
	function handleDateClick(data) {
		alert('date click! ' + data.dateStr)
	}

	return (
		<Page>
			<Container className="d-flex justify-content-center align-items-center py-5">
				<FullCalendar
					plugins={[dayGridPlugin, interactionPlugin]}
					initialView="dayGridMonth"
					events={[
						{ title: 'event 1', date: '2023-05-28' },
						{ title: 'event 2', date: '2019-05-28' }
					]}
					dateClick={handleDateClick}
					height="auto"
					locale={ptBrLocale}
				/>
			</Container>
		</Page>
	);
}
