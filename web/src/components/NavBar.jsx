import { Nav, Navbar } from "react-bootstrap";
import { BiBell } from "react-icons/bi";
import { FaRegUserCircle } from "react-icons/fa";
import softinsaSvg from "../assets/softinsa.svg";

export default function () {
  return (
    <Navbar bg="primary" variant="dark">
      <Navbar.Brand href="/">
        <img src={softinsaSvg} alt="Softinsa" />
      </Navbar.Brand>

      <Nav className="me-auto">
        <Nav.Link href="/">Início</Nav.Link>
        <Nav.Link href="/beneficios">Benefícios</Nav.Link>
        <Nav.Link href="/vagas">Vagas</Nav.Link>
        <Nav.Link href="/oportunidades">Oportunidades</Nav.Link>
        <Nav.Link href="/ideias">Ideias</Nav.Link>
        <Nav.Link href="/contacto">Contacto</Nav.Link>
      </Nav>

      <Nav>
        <div className="right-icons">
          <BiBell color="white" size={24} />

          <Nav.Link href="/login">
            <FaRegUserCircle color="white" size={24} />
          </Nav.Link>
        </div>
      </Nav>
    </Navbar>
  );
}
