import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";

export function Contacto() {
	return (
		<>
			<NavBar page="contacto" />

			<main
				className="min-h-without-navbar"
				style={{ backgroundImage: "url(/static/contacto-bg.png)", backgroundSize: "cover" }}
			>
				<Container className="row col-11">
					<div className="col d-flex flex-column ">
						<div className="d-flex flex-row">
							<IoLocationOutline size={50} />
							<div className="">
								<h4>Morada</h4>
								<a href="https://goo.gl/maps/L7vwXB8kAUbd3sBUA" className="text-decoration-none">
									Edifício Office Oriente nº3 - B6 1990-138 Lisboa
								</a>
							</div>
						</div>

						<div className="d-flex flex-row">
							<AiOutlinePhone size={50} />
							<div>
								<h4>Contacto</h4>
								<a href="tel:+351 213 219 600" className="text-decoration-none">
									+351 213 219 600
								</a>
							</div>
						</div>

						<div className="d-flex flex-row">
							<AiOutlineMail size={50} />

							<div>
								<h4>Email</h4>

								<a href="mailto:comercial@pt.softinsa.com">comercial@pt.softinsa.com</a>
								<a href="mailto:marketing@pt.softinsa.com">marketing@pt.softinsa.com</a>
								<a href="mailto:geral@pt.softinsa.com">geral@pt.softinsa.com</a>
							</div>
						</div>
					</div>

					<Form className="col p-5 bg-white">
						<Form.Group className="mb-3" controlId="nome">
							<Form.Control placeholder="Nome" />
						</Form.Group>

						<Form.Group className="mb-3" controlId="email">
							<Form.Control type="email" placeholder="Email" />
						</Form.Group>

						<Form.Group className="mb-3" controlId="message">
							<Form.Control placeholder="Mensagem" />
						</Form.Group>

						<Button variant="primary" type="submit">
							Enviar
						</Button>
					</Form>
				</Container>
			</main>

			<Footer />
		</>
	);
}
