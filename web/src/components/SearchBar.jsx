import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { FaSearch } from "react-icons/fa";

/**
 * @param {Object} props
 * @param {(val: string) => void} props.onSearch
 * @param {string} props.placeholder
 */
export function SearchBar({ onSearch, placeholder }) {
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
				<Form.Control placeholder={placeholder} />

				<Button
					className="input-group-append btn btn-primary pb-2"
					style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
				>
					<FaSearch />
				</Button>
			</InputGroup>
		</Form>
	);
}
