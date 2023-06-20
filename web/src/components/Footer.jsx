import { RiFacebookCircleFill } from "@react-icons/all-files/ri/RiFacebookCircleFill";
import { RiInstagramLine } from "@react-icons/all-files/ri/RiInstagramLine";
import { RiLinkedinBoxLine } from "@react-icons/all-files/ri/RiLinkedinBoxLine";
import { Link } from "react-router-dom";
import { SoftinsaLogoSmall } from "./icons/SoftinsaLogoSmall.jsx";

export function Footer() {
	return (
		<footer
			className="d-flex justify-content-between align-items-center flex-wrap px-5 pb-5 pt-4"
			style={{ backgroundColor: "#3f51b5" }}
		>
			<div className="col-md-4 d-flex align-items-center">
				<Link to="/" className="mb-md-0 text-muted text-decoration-none lh-1 mb-3 me-2">
					<SoftinsaLogoSmall />
				</Link>

				<span className="mb-md-0 mb-3 text-white">© {new Date().getFullYear()} Softinsa</span>
			</div>

			<ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
				<li className="ms-3">
					<a href="https://www.facebook.com/Softinsa" target="_blank" rel="external noopener noreferrer">
						<RiFacebookCircleFill color="white" />
					</a>
				</li>

				<li className="ms-3">
					<a href="https://www.instagram.com/softinsa" target="_blank" rel="external noopener noreferrer">
						<RiInstagramLine color="white" />
					</a>
				</li>

				<li className="ms-3">
					<a href="https://www.linkedin.com/company/softinsa" target="_blank" rel="external noopener noreferrer">
						<RiLinkedinBoxLine color="white" />
					</a>
				</li>
			</ul>
		</footer>
	);
}
