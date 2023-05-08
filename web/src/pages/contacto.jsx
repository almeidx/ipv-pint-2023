import { useContext, useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { TbSend } from "react-icons/tb";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";
import { UserContext } from "../contexts/UserContext.jsx";
import { API_URL } from "../utils/constants.js";

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
	const { user } = useContext(UserContext);
	const [name, setName] = useState(user?.name ?? "");
	const [email, setEmail] = useState(user?.email ?? "");
	const [message, setMessage] = useState("");
	const [showCreatedToast, setShowCreatedToast] = useState(false);
	const timeoutRef = useRef(null);

	useEffect(() => {
		if (user) {
			setName(user.name);
			setEmail(user.email);
		}
	}, [user]);

	function disableToast() {
		setShowCreatedToast(false);
	}

	/** @param {import("react").FormEvent<HTMLFormElement>} */
	function handleSubmit(event) {
		event.preventDefault();

		const data = {
			name,
			email,
			content: message,
		};

		fetch(`${API_URL}/mensagens`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
			credentials: "include",
		}).then(async (res) => {
			if (!res.ok) {
				alert("Ocorreu um erro ao enviar a mensagem.");
				return;
			}

			setShowCreatedToast(true);
			setMessage("");

			if (timeoutRef.current) clearTimeout(timeoutRef.current);

			timeoutRef.current = setTimeout(() => {
				setShowCreatedToast(false);
			}, 10_000);
		});
	}

	return (
		<>
			<NavBar page="contacto" />

			<main className="min-h-without-navbar d-flex justify-content-center align-items-center position-relative flex-row place-items-center">
				<img
					src="/static/contacto-bg.png"
					className="position-absolute w-100 h-100 inset-0 -z-10 m-0 object-cover p-0"
					fetchpriority="high"
				/>

				<Container className="row col-6 d-flex justify-content-center align-items-center flex-column">
					<div className="col-6 d-flex flex-column justify-content-center gap-5">
						{contactMethods.map(({ icon, title, links }, idx) => (
							<ContactMethod key={`method-${idx}`} icon={icon} title={title} links={links} />
						))}
					</div>
				</Container>

				<Container className="row col-6 d-flex justify-content-center align-items-center">
					<Form
						className="col-6 rounded-3 d-flex justify-content-center align-items-center flex-column gap-5 bg-white px-3 pb-3 pt-3"
						onSubmit={handleSubmit}
					>
						<Form.Text style={{ fontSize: "1.2rem" }}>Deixe a sua mensagem</Form.Text>

						<Form.Group className="w-100 mb-3" controlId="nome">
							<Form.Control
								placeholder="Nome"
								className="border-top-0 border-start-0 border-end-0"
								disabled={!!user}
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</Form.Group>

						<Form.Group className="w-100 mb-3" controlId="email">
							<Form.Control
								type="email"
								placeholder="Email"
								className="border-top-0 border-start-0 border-end-0"
								disabled={!!user}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</Form.Group>

						<Form.Control
							className="mb-3"
							as="textarea"
							placeholder="Mensagem"
							rows={5}
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						/>

						<Button variant="primary" type="submit" className="px-5">
							Enviar
						</Button>
					</Form>
				</Container>

				<Toast
					show={showCreatedToast}
					onClose={disableToast}
					className="position-absolute"
					style={{ bottom: "1rem", right: "1rem" }}
				>
					<Toast.Body className="d-flex align-items-center justify-content-between gap-2">
						<p className="mb-0">
							<TbSend size={24} /> Mensagem enviada com sucesso
						</p>

						<CloseButton onClick={disableToast} />
					</Toast.Body>
				</Toast>
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
		<div className="d-flex align-items-center flex-row gap-4 text-white">
			<Icon size={50} />

			<div className="d-flex flex-column">
				<h4 className="fw-light" style={{ fontSize: "1.8rem" }}>
					{title}
				</h4>

				{links.map(({ title, href }, idx) => (
					<a key={`link-${idx}`} href={href} style={{ color: "lightgray" }}>
						{title}
					</a>
				))}
			</div>
		</div>
	);
}
