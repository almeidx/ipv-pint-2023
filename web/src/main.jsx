import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Beneficios } from "./pages/Beneficios.jsx";
import { Contacto } from "./pages/Contacto.jsx";
import { Home } from "./pages/Home.jsx";
import { Ideias } from "./pages/Ideias.jsx";
import { Login } from "./pages/Login.jsx";
import { Oportunidades } from "./pages/Oportunidades.jsx";
import { SignUp } from "./pages/SignUp.jsx";
import { Vagas } from "./pages/Vagas.jsx";
import { MudarPassword } from "./pages/MudarPassword.jsx";
import { VerificarConta } from "./pages/VerificarConta.jsx";
import { Admin } from "./pages/Admin.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" Component={Home} />
				<Route path="/beneficios" Component={Beneficios} />
				<Route path="/contacto" Component={Contacto} />
				<Route path="/ideias" Component={Ideias} />
				<Route path="/oportunidades" Component={Oportunidades} />
				<Route path="/vagas" Component={Vagas} />

				<Route path="/login" Component={Login} />
				<Route path="/signup" Component={SignUp} />
				<Route path="/mudar-password" Component={MudarPassword} />
				<Route path="/verificar-conta" Component={VerificarConta} />

				<Route path="/admin" Component={Admin} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
);
