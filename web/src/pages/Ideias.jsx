import { useState } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";

export function Ideias() {
  const [ideias, setIdeias] = useState([
    {
      id: 1,
      content: "",
      category: 1,
    },
    {
      id: 2,
      content: "",
      category: 1,
    },
    {
      id: 3,
      content: "",
      category: 1,
    },
    {
      id: 4,
      content: "",
      category: 1,
    },
  ]);

  return (
    <>
      <NavBar page="ideias" />

      <Container className="col-11 pt-4 row mx-auto gap-5">
        {ideias.map(({ id, ...ideia }) => (
          <Vaga key={id} {...ideia} />
        ))}
      </Container>

      <main className="min-h-without-navbar pb-5" style={{ backgroundColor: "#c5cae9" }}></main>

      <Footer />
    </>
  );
}

/**
 * @param {Object} props
 * @param {string} props.category
 * @param {string} props.content
 */
function Vaga({ content, category }) {
  return (
    <Card style={{ width: "18rem", height: "15rem", borderRadius: "1rem", marginTop: "4rem" }}>
      <Card.Body>
        <Card.Subtitle>{category}</Card.Subtitle>

        <Card.Text style={{ fontSize: "1.1rem" }}>{content}</Card.Text>
      </Card.Body>
    </Card>
  );
}
