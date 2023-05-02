import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { FaSearch } from "react-icons/fa";

/**
 * @param {Object} props
 * @param {(val: string) => void} props.onSearch
 * @param {string} props.placeholder
 * @param {boolean} [props.disabled]
 */
export function SearchBar({ onSearch, placeholder, disabled }) {
	/**
	 * @param {React.FormEvent<HTMLFormElement>} event
	 */
	function onSubmit(event) {
		event.preventDefault();
		const input = event.currentTarget.querySelector("input");
		onSearch(input.value);
	}

	return (
		<Form onSubmit={onSubmit}>
			<InputGroup className="mb-3">
				<Form.Control
					disabled={disabled}
					placeholder={placeholder}
					onChange={(e) => {
						onSearch(e.target.value);
					}}
				/>

				<Button
					disabled={disabled}
					className="input-group-append btn btn-primary pb-2"
					style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
				>
					<FaSearch />
				</Button>
			</InputGroup>
		</Form>
	);
}
