import "react-calendar/dist/Calendar.css";

import { useState } from "react";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import ReactCalendar from "react-calendar";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";
import { formatDate } from "../utils/formatDate.js";

export function Calendar() {
	const [value, onChange] = useState(new Date());

	return (
		<>
			<NavBar />

			<main className="min-h-without-navbar pb-5 bg-main">
				<Container className="py-5 d-flex justify-content-between">
					<ReactCalendar value={value} onChange={onChange} />

					<div className="w-50 bg-white rounded-3 px-3 py-2">
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
			</main>

			<Footer />
		</>
	);
}
