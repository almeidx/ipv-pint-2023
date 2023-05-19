import { useState } from "react";
import FormControl from "react-bootstrap/FormControl";

export function Multiselect({ options }) {
	const [optionsVisible, setOptionsVisible] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState([]);

	function handleSelectOption(option) {
		setSelectedOptions((state) => [...state, option]);
	}

	return (
		<div className="position-relative">
			<div
				className="position-absolute cursor-pointer"
				style={{ top: 0, left: 0, right: 0, height: "23px", color: "red" }}
				onClick={() => setOptionsVisible((state) => !state)}
			>
				Adicionar utilizadores
			</div>

			<div
				className="flex-column w-fit pt-4 text-white"
				style={{ display: optionsVisible ? "flex" : "none", minWidth: "10rem" }}
			>
				{options.map(({ name, id }, idx) => (
					<Option key={id} name={name} id={id} index={idx} lastIndex={options.length - 1} />
				))}
			</div>
		</div>
	);
}

function Option({ id, name, index, lastIndex }) {
	const [checked, setChecked] = useState(false);

	return (
		<div
			className="d-flex align-items-center cursor-pointer px-3 py-1"
			style={{
				backgroundColor: "gray",
				borderTopLeftRadius: index === 0 ? "0.5rem" : "",
				borderTopRightRadius: index === 0 ? "0.5rem" : "",
				borderBottomLeftRadius: index === lastIndex ? "0.5rem" : "",
				borderBottomRightRadius: index === lastIndex ? "0.5rem" : "",
				// borderBottom: index === lastIndex ? "" : "1px solid white",
			}}
		>
			<input
				type="checkbox"
				className="me-2"
				id={`${index}-option`}
				checked={checked}
				onChange={() => setChecked((state) => !state)}
			/>
			<label className="w-100" htmlFor={`${index}-option`}>
				{name}
			</label>
		</div>
	);
}
