import { AiOutlineMail } from "@react-icons/all-files/ai/AiOutlineMail";
import { AiOutlinePhone } from "@react-icons/all-files/ai/AiOutlinePhone";
import { IoLocationOutline } from "@react-icons/all-files/io5/IoLocationOutline";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Page } from "../components/Page.jsx";
import { Toast } from "../components/Toast.jsx";
import { useDisableableButton } from "../contexts/DisableableButtonContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { useUser } from "../contexts/UserContext.jsx";
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

export default function Contacto() {
	const { user } = useUser();
	const [name, setName] = useState(user?.name ?? "");
	const [email, setEmail] = useState(user?.email ?? "");
	const [message, setMessage] = useState("");
	const { buttonRef, disableButton } = useDisableableButton();
	const { showToastWithMessage, showToast, toastMessage, toggleToast } = useToast();

	useEffect(() => {
		if (user) {
			setName(user.name);
			setEmail(user.email);
		}
	}, [user]);

	/** @param {import("react").FormEvent<HTMLFormElement>} */
	async function handleSubmit(event) {
		event.preventDefault();

		const data = {
			name,
			email,
			content: message,
		};

		try {
			const response = await fetch(`${API_URL}/mensagens`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Something went wrong", { cause: response });
			}

			disableButton();
			showToastWithMessage("Mensagem enviada com sucesso");

			setMessage("");

			if (!user) {
				setName("");
				setEmail("");
			}
		} catch (error) {
			console.error(error);

			showToastWithMessage("Ocorreu um erro ao enviar a mensagem");
		}
	}

	return (
		<Page
			className="min-h-without-navbar d-flex justify-content-center align-items-center position-relative flex-row place-items-center"
			page="/contacto"
		>
			<Toast hide={() => toggleToast(false)} show={showToast} message={toastMessage} />

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

					<Button variant="primary" type="submit" className="px-5" ref={buttonRef}>
						Enviar
					</Button>
				</Form>
			</Container>
		</Page>
	);
}

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {React.ComponentType} props.icon
 * @param {{ title: string; href: string }[]} props.links
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
