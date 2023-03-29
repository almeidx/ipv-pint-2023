import { useState } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";
import { SearchBar } from "../components/SearchBar.jsx";

export function Beneficios() {
  const [beneficios, setBeneficios] = useState([
    {
      id: 1,
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      id: 2,
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      id: 3,
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      id: 4,
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      id: 5,
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      id: 6,
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      id: 7,
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      id: 8,
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      id: 9,
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      id: 10,
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      id: 11,
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      id: 12,
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
  ]);
  const [search, setSearch] = useState("");

  const filteredBeneficios = search
    ? beneficios.filter(
        ({ title, description }) =>
          title.toLowerCase().includes(search.toLowerCase()) || description.toLowerCase().includes(search.toLowerCase())
      )
    : beneficios;

  return (
    <>
      <NavBar page="beneficios" />

      <main className="min-h-without-navbar pb-5" style={{ backgroundColor: "#c5cae9" }}>
        <Container className="pt-5 col-11">
          <SearchBar placeholder="Pesquise por benefícios..." onSearch={(value) => setSearch(value)} />
        </Container>

        <Container className="pt-3 col-11 row mx-auto gap-5">
          {filteredBeneficios.length ? (
            filteredBeneficios.map(({ id, ...beneficio }) => <Beneficio key={id} {...beneficio} />)
          ) : (
            <p>Não encontrado</p>
          )}
        </Container>
      </main>

      <Footer />
    </>
  );
}

/**
 * @param {Object} props
 * @param {string} props.iconHref
 * @param {string} props.title
 * @param {string} props.description
 */
function Beneficio({ iconHref, title, description }) {
  return (
    <Card style={{ width: "18rem", height: "20rem", borderRadius: "1rem" }}>
      <Card.Body className="d-flex justify-content-center align-items-center flex-column">
        <Card.Img src={iconHref} height="110px" width="110px" className="rounded-circle" style={{ width: "110px" }} />

        <Card.Title className="title my-3" style={{ fontSize: "2rem" }}>
          {title}
        </Card.Title>

        <Card.Text style={{ fontSize: "1.1rem" }}>{description}</Card.Text>
      </Card.Body>
    </Card>
  );
}
