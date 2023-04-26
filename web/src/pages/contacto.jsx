import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";

const contactMethods = [
	{
		icon: IoLocationOutline,
		title: "Morada",
		links: [
			{
				title: "Edifício Office Oriente nº3 - B6 1990-138 Lisboa",
				href: "https://goo.gl/maps/L7vwXB8kAUbd3sBUA",
			},
		],
	},
	{
		icon: AiOutlinePhone,
		title: "Contacto",
		links: [
			{
				title: "+351 213 219 600",
				href: "tel:+351 213 219 600",
			},
		],
	},
	{
		icon: AiOutlineMail,
		title: "Email",
		links: [
			{
				title: "comercial@pt.softinsa.com",
				href: "mailto:comercial@pt.softinsa.com",
			},
			{
				title: "marketing@pt.softinsa.com",
				href: "mailto:marketing@pt.softinsa.com",
			},
			{
				title: "geral@pt.softinsa.com",
				href: "mailto:geral@pt.softinsa.com",
			},
		],
	},
];

export function Contacto() {
	return (
		<>
			<NavBar page="contacto" />

			<main
				className="min-h-without-navbar d-grid"
				style={{ backgroundImage: "url(/static/contacto-bg.png)", backgroundSize: "cover", placeItems: "center" }}
			>
				<Container className="row col-11 mx-auto">
					<div className="col d-flex flex-column justify-content-between">
						{contactMethods.map(({ icon, title, links }, idx) => (
							<ContactMethod key={`method-${idx}`} icon={icon} title={title} links={links} />
						))}
					</div>

					<Form className="col-4 px-3 pt-3 pb-3 gap-4 bg-white rounded-3 d-flex justify-content-center align-items-center flex-column">
						<Form.Text style={{ fontSize: "1.2rem" }}>Deixe a sua mensagem</Form.Text>

						<Form.Group className="mb-3 w-100" controlId="nome">
							<Form.Control placeholder="Nome" className="border-top-0 border-start-0 border-end-0" />
						</Form.Group>

						<Form.Group className="mb-3 w-100" controlId="email">
							<Form.Control type="email" placeholder="Email" className="border-top-0 border-start-0 border-end-0" />
						</Form.Group>

						<Form.Control className="mb-3" as="textarea" placeholder="Mensagem" rows={5} />

						<Button variant="primary" type="submit" className="px-5">
							Enviar
						</Button>
					</Form>
				</Container>
			</main>

			<Footer />
		</>
	);
}

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {React.ComponentType} props.icon
 * @param {Object[]} props.links
 * @param {string} props.links[].title
 * @param {string} props.links[].href
 */
function ContactMethod({ title, icon: Icon, links }) {
	return (
		<div className="d-flex flex-row align-items-center gap-4 text-white">
			<Icon size={50} />

			<div className="d-flex flex-column">
				<h4 style={{ fontWeight: "light", fontSize: "1.8rem" }}>{title}</h4>

				{links.map(({ title, href }, idx) => (
					<a key={`link-${idx}`} href={href} style={{ color: "lightgray" }}>
						{title}
					</a>
				))}
			</div>
		</div>
	);
}
