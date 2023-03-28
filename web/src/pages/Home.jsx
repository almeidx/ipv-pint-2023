import "../styles/Home.css";

import { NavBar } from "../components/NavBar.jsx";
import { Footer } from "../components/Footer.jsx";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { RiTrophyFill } from "react-icons/ri";

export function Home() {
  return (
    <>
      <NavBar page="/" />

      <main className="min-h-without-navbar">
        <Container>
          <PageCard
            title="Benefícios"
            description="Conheça todos os Benefícios que cada colaborador Softinsa pode usufruir"
            icon={RiTrophyFill}
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
 * @param {React.ComponentType} props.icon
 */
function PageCard({ title, description, icon: Icon }) {
  return (
    <Card style={{ width: "18rem", height: "20rem" }}>
      <Card.Body className="d-flex justify-content-center align-items-center flex-column">
        <Icon color="#3f51b5" size={90} />

        <Card.Title className="title my-3" style={{ fontSize: "2rem" }}>
          {title}
        </Card.Title>

        <Card.Text style={{ fontSize: "1.1rem" }}>{description}</Card.Text>
      </Card.Body>
    </Card>
  );
}
