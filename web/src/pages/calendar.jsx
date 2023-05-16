import "react-calendar/dist/Calendar.css";

import { useState } from "react";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import ReactCalendar from "react-calendar";
import { Page } from "../components/Page.jsx";
import { formatDate } from "../utils/formatDate.js";

export function Calendar() {
	const [value, onChange] = useState(new Date());

	return (
		<Page>
			<Container className="d-flex justify-content-between py-5">
				<ReactCalendar value={value} onChange={onChange} />

				<div className="w-50 rounded-3 bg-white px-3 py-2">
					<p className="mb-2">Eventos do dia {formatDate(value, false)}</p>

					<ListGroup title="This is a title">
						<ListGroup.Item>
							<div>
								<div className="fw-bold">Nova reunião</div>
								<p className="mb-0">Entrevista</p>
							</div>
						</ListGroup.Item>

						<ListGroup.Item>
							<div>
								<div className="fw-bold">Nova reunião</div>
								<p className="mb-0">Entrevista</p>
							</div>
						</ListGroup.Item>

						<ListGroup.Item>
							<div>
								<div className="fw-bold">Nova reunião</div>
								<p className="mb-0">Entrevista</p>
							</div>
						</ListGroup.Item>
					</ListGroup>
				</div>
			</Container>
		</Page>
	);
}
