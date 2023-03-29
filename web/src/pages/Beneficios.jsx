import { useState } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { FaSearch } from "react-icons/fa";
import { Footer } from "../components/Footer.jsx";
import { NavBar } from "../components/NavBar.jsx";

export function Beneficios() {
  const [beneficios, setBeneficios] = useState([
    {
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
    {
      iconHref: "/static/beneficio-dentista.png",
      title: "Dentista",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut ultricies ultricies,",
    },
  ]);

  return (
    <>
      <NavBar page="beneficios" />

      <main className="min-h-without-navbar pb-5" style={{ backgroundColor: "#c5cae9" }}>
        <Container className="pt-5 col-11">
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Pesquise por benefícios..." />
            <div className="input-group-append">
              <button className="btn btn-primary" style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}>
                <FaSearch />
              </button>
            </div>
          </div>
        </Container>

        <Container className="pt-3 col-11 row mx-auto gap-5">
          {beneficios.map((beneficio) => (
            <Beneficio {...beneficio} />
          ))}
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
