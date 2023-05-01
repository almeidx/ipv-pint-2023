import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext.jsx";
import { Error404 } from "./pages/404.jsx";
import { Admin } from "./pages/admin.jsx";
import { Beneficios } from "./pages/beneficios.jsx";
import { Calendar } from "./pages/calendar.jsx";
import { Contacto } from "./pages/contacto.jsx";
import { Ideias } from "./pages/ideias.jsx";
import { Home } from "./pages/index.jsx";
import { Login } from "./pages/login.jsx";
import { MudarPassword } from "./pages/mudar-password.jsx";
import { Negocios } from "./pages/negocios.jsx";
import { Profile } from "./pages/profile.jsx";
import { SignUp } from "./pages/sign-up.jsx";
import { Vagas } from "./pages/vagas.jsx";
import { VerificarConta } from "./pages/verificar-conta.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<StrictMode>
		<UserProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/beneficios" element={<Beneficios />} />
					<Route path="/contacto" element={<Contacto />} />
					<Route path="/ideias" element={<Ideias />} />
					<Route path="/negocios" element={<Negocios />} />
					<Route path="/vagas" element={<Vagas />} />

					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/mudar-password" element={<MudarPassword />} />
					<Route path="/verificar-conta" element={<VerificarConta />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/calendar" element={<Calendar />} />

					<Route path="/admin" element={<Admin />} />

					<Route path="*" element={<Error404 />} />
				</Routes>
			</BrowserRouter>
		</UserProvider>
	</StrictMode>,
);
