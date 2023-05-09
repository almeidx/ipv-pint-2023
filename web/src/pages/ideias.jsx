import "../styles/Ideias.css";

import { useEffect, useRef, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { BiBuildingHouse } from "react-icons/bi";
import { BsFillBagCheckFill, BsGraphUpArrow } from "react-icons/bs";
import { FaRegLightbulb } from "react-icons/fa";
import { RiCheckboxCircleFill, RiCloseFill } from "react-icons/ri";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";

const categories = [
	{
		category: 1,
		title: "Geral",
		description: "Faça recomendações de melhorias para a empresa e as suas equipas",
		icon: FaRegLightbulb,
	},
	{
		category: 2,
		title: "Estabelecimento",
		description: "Forneça ideias para melhorar o espaço de trabalho da empresa ",
		icon: BiBuildingHouse,
	},
	{
		category: 3,
		title: "Investimentos",
		description: "Se tiver alguma de um investimento que ache apropriado, envie a sua idea",
		icon: BsGraphUpArrow,
	},
	{
		category: 4,
		title: "Negócios",
		description: "Se tiver alguma oportunidade de negócio em mente, compartilhe connosco!",
		icon: BsFillBagCheckFill,
	},
];

export function Ideias() {
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [showAlert, setShowAlert] = useState(false);
	const enviarBtnRef = useRef(null);
	const enableBtnTimeoutRef = useRef(null);

	function enableSendBtn() {
		setShowAlert(false);
		enviarBtnRef.current.disabled = false;
	}

	/** @param {React.FormEvent<HTMLFormElement>} event */
	function handleSubmit(event) {
		event.preventDefault();

		enviarBtnRef.current.disabled = true;
		setShowAlert(true);

		if (enableBtnTimeoutRef.current) {
			clearTimeout(enableBtnTimeoutRef.current);
		}

		enableBtnTimeoutRef.current = setTimeout(enableSendBtn, 5_000);
	}

	return (
		<>
			<NavBar page="ideias" />

			<main className="min-h-without-navbar bg-main pb-5">
				<Container className="col-11 row mx-auto gap-5 pt-4">
					{categories.map((category) => (
						<CategoriaCard
							key={`cat-card-${category.category}`}
							{...category}
							selected={selectedCategory === category.category}
							onClick={() => setSelectedCategory(handleCategoryChange(category.category, selectedCategory))}
						/>
					))}
				</Container>

				<Container
					className="rounded-5 col-8"
					style={{ backgroundColor: "#357fd6", marginTop: "-5rem", padding: "5rem 5rem 2rem" }}
				>
					<div className="d-flex justify-content-center align-items-center mb-4 py-3">
						<h1 className="mx-auto text-white" style={{ fontSize: "4rem" }}>
							Submeta a sua ideia
						</h1>
					</div>

					<p className="mb-2 text-white">Selecione a opção que melhor categoriza a sua ideia:</p>

					<ButtonGroup className="mb-2">
						{categories.map(({ category, title }) => (
							<Button
								key={`cat-btn-${category}`}
								className="ideias-cat-btn mb-4 border-white"
								style={{ backgroundColor: selectedCategory === category ? "#ffffff50" : "transparent" }}
								onClick={() => setSelectedCategory(handleCategoryChange(category, selectedCategory))}
							>
								{title}
							</Button>
						))}
					</ButtonGroup>

					<Form onSubmit={handleSubmit}>
						<Form.Control as="textarea" placeholder="Descreva a sua ideia" rows={8} required />

						<div className="d-flex justify-content-center align-items-center">
							<Button
								type="submit"
								className="rounded-pill ideias-cat-btn mt-4 border-white bg-transparent px-5"
								ref={enviarBtnRef}
							>
								Enviar
							</Button>
						</div>
					</Form>
				</Container>

				<Alert
					show={showAlert}
					className="d-flex justify-content-between align-items-center position-fixed w-fit gap-5 py-0"
					style={{ bottom: "1rem", right: "1rem" }}
					variant="success"
				>
					<p className="pt-3">
						<RiCheckboxCircleFill size={20} style={{ marginTop: "-0.2rem" }} /> Ideia submetida com sucesso
					</p>

					<button
						className="border-0 bg-transparent"
						onClick={() => {
							setShowAlert(false);

							if (enableBtnTimeoutRef.current) {
								clearTimeout(enableBtnTimeoutRef.current);
								enableSendBtn();
							}
						}}
					>
						<RiCloseFill size={24} />
					</button>
				</Alert>
			</main>

			<Footer />
		</>
	);
}

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {number} props.category
 * @param {React.Component} props.icon
 */
function CategoriaCard({ icon: Icon, title, description, category, selected, onClick }) {
	return (
		<Card
			className="categoria-card"
			style={{
				backgroundColor: selected ? "#6c7db8" : "",
				width: "18rem",
				height: "16rem",
				borderRadius: "1rem",
				marginTop: "1rem",
				cursor: "pointer",
			}}
			onClick={onClick}
		>
			<Card.Body className="d-flex justify-content-center flex-column align-items-center">
				<Icon size={70} />

				<Card.Title className="title pt-3" style={{ fontSize: "1.5rem" }}>
					{title}
				</Card.Title>

				<Card.Text className="text-center" style={{ fontSize: "1rem" }}>
					{description}
				</Card.Text>
			</Card.Body>
		</Card>
	);
}

/**
 * @param {number} category
 * @param {?number|undefined} currentCategory
 */
function handleCategoryChange(category, currentCategory) {
	return category === currentCategory ? null : category;
}
