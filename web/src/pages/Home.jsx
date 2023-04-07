import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { BsFillFileEarmarkPersonFill } from "react-icons/bs";
import { FaHandHoldingUsd } from "react-icons/fa";
import { RiLightbulbFill, RiTrophyFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";

export function Home() {
	return (
		<>
			<NavBar page="/" />

			<main
				className="min-h-without-navbar"
				style={{ backgroundImage: "url(/static/home-bg.jpeg)", backgroundSize: "cover" }}
			>
				<Container className="col-12 row mx-auto gap-3">
					<PageCard
						title="Benefícios"
						description="Conheça todos os Benefícios que cada colaborador Softinsa pode usufruir"
						icon={RiTrophyFill}
						href="/beneficios"
					/>
					<PageCard
						title="Vagas"
						description="Vagas/Ofertas de trabalho em existem na empresa"
						icon={BsFillFileEarmarkPersonFill}
						href="/vagas"
					/>
					<PageCard
						title="Oportunidades"
						description="Negócios, Parcerias e os Investimentos que existem na empresa e de potenciais novas oportunidades"
						icon={FaHandHoldingUsd}
						href="/oportunidades"
					/>
					<PageCard
						title="Ideias"
						description="Faça recomendações de melhorias para a empresa e as suas equipas"
						icon={RiLightbulbFill}
						href="/ideias"
					/>
				</Container>
			</main>

			<Footer />
		</>
	);
}

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} props.href
 * @param {React.ComponentType} props.icon
 */
function PageCard({ title, description, icon: Icon, href }) {
	return (
		<Link to={href} className="text-reset text-decoration-none" style={{ width: "fit-content" }}>
			<Card style={{ width: "18rem", height: "20rem", borderRadius: "1rem" }}>
				<Card.Body className="d-flex justify-content-center align-items-center flex-column">
					<Icon color="#3f51b5" size={90} />

					<Card.Title className="title my-3" style={{ fontSize: "2rem" }}>
						{title}
					</Card.Title>

					<Card.Text style={{ fontSize: "1.1rem" }}>{description}</Card.Text>
				</Card.Body>
			</Card>
		</Link>
	);
}
