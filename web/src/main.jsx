import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";

import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Beneficios } from "./pages/beneficios.jsx";
import { Contacto } from "./pages/contacto.jsx";
import { Home } from "./pages/index.jsx";
import { Ideias } from "./pages/ideias.jsx";
import { Login } from "./pages/login.jsx";
import { Negocios } from "./pages/negocios.jsx";
import { SignUp } from "./pages/sign-up.jsx";
import { Vagas } from "./pages/vagas.jsx";
import { MudarPassword } from "./pages/mudar-password.jsx";
import { VerificarConta } from "./pages/verificar-conta.jsx";
import { Admin } from "./pages/admin.jsx";
import { UserContext, UserProvider } from "./contexts/UserContext.jsx";
import { Profile } from "./pages/profile.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<UserProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" Component={Home} />
					<Route path="/beneficios" Component={Beneficios} />
					<Route path="/contacto" Component={Contacto} />
					<Route path="/ideias" Component={Ideias} />
					<Route path="/negocios" Component={Negocios} />
					<Route path="/vagas" Component={Vagas} />

					<Route path="/login" Component={Login} />
					<Route path="/signup" Component={SignUp} />
					<Route path="/mudar-password" Component={MudarPassword} />
					<Route path="/verificar-conta" Component={VerificarConta} />
					<Route path="/profile" Component={Profile} />

					<Route path="/admin" Component={Admin} />
				</Routes>
			</BrowserRouter>
		</UserProvider>
	</React.StrictMode>,
);
