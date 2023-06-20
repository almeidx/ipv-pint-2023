import { BsFillFileEarmarkPersonFill } from "@react-icons/all-files/bs/BsFillFileEarmarkPersonFill";
import { FaHandHoldingUsd } from "@react-icons/all-files/fa/FaHandHoldingUsd";
import { RiLightbulbFill } from "@react-icons/all-files/ri/RiLightbulbFill";
import { RiTrophyFill } from "@react-icons/all-files/ri/RiTrophyFill";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import { Page } from "../components/Page.jsx";
import { Reporting } from "../components/Reporting.jsx";

export default function Home() {
	return (
		<Page className="min-h-without-navbar position-relative" page="/">
			<img
				src="/static/home-bg.jpeg"
				className="position-absolute w-100 h-100 inset-0 -z-10 m-0 object-cover p-0"
				fetchpriority="high"
			/>

			<Reporting />

			<Container className="col-12 row mx-auto mt-5 gap-3 pb-5">
				<h2 className="text-white">Funcionalidades principais do website</h2>

				<PageCard
					title="Oportunidades"
					description="Negócios, Parcerias e os Investimentos que existem na empresa e de potenciais novas oportunidades"
					icon={FaHandHoldingUsd}
					href="/negocios"
				/>
				<PageCard
					title="Vagas"
					description="Vagas/Ofertas de trabalho em existem na empresa"
					icon={BsFillFileEarmarkPersonFill}
					href="/vagas"
				/>
				<PageCard
					title="Benefícios"
					description="Conheça todos os Benefícios que cada colaborador Softinsa pode usufruir"
					icon={RiTrophyFill}
					href="/beneficios"
				/>
				<PageCard
					title="Ideias"
					description="Faça recomendações de melhorias para a empresa e as suas equipas"
					icon={RiLightbulbFill}
					href="/ideias"
				/>
			</Container>
		</Page>
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
		<Link to={href} className="text-reset text-decoration-none w-fit">
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
