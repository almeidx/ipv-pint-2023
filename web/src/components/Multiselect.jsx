import { useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import FormCheck from "react-bootstrap/FormCheck";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";

/**
 * @param {Object} props
 * @param {{ label: string; value: number }[]} props.options
 * @param {(selectedOptions: number[]) => void} props.onSelectOption
 * @param {string} props.id
 * @param {string} props.placeholder
 * @param {string} props.buttonText
 * @param {boolean} props.withSearch
 * @param {number[]} [props.defaultSelectedOptions]
 */
export function Multiselect({
	options,
	onSelectOption,
	id,
	placeholder,
	buttonText,
	withSearch,
	defaultSelectedOptions,
}) {
	const [optionsVisible, setOptionsVisible] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState([]);
	const [search, setSearch] = useState("");

	useEffect(() => {
		if (defaultSelectedOptions && defaultSelectedOptions.length > 0) {
			setSelectedOptions(defaultSelectedOptions);
		}
	}, [defaultSelectedOptions]);

	useEffect(() => {
		onSelectOption(selectedOptions);
	}, [selectedOptions]);

	function handleSelectOption(option) {
		setSelectedOptions((state) => [...state, option]);
	}

	const filteredOptions = useMemo(
		() =>
			options
				.sort((a, b) => a.label.localeCompare(b.label))
				.filter(({ label }) => label.toLowerCase().includes(search.toLowerCase())),
		[options, search],
	);

	useEffect(() => {
		function handleClickOutside(event) {
			if (optionsVisible && !event.target.closest(`#multiselect-${id}`)) {
				setOptionsVisible(false);
			}
		}

		document.addEventListener("click", handleClickOutside);

		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	return (
		<div className="position-relative" id={`multiselect-${id}`}>
			<Button disabled={options.length === 0} onClick={() => setOptionsVisible((state) => !state)}>
				{buttonText}
			</Button>

			<div
				className="flex-column position-absolute mt-2 w-fit text-white"
				style={{
					display: optionsVisible ? "flex" : "none",
					minWidth: "15rem",
					maxHeight: "15rem",
					overflowY: "scroll",
					backgroundColor: "gray",
					borderTopLeftRadius: "0.5rem",
					borderTopRightRadius: "0.5rem",
				}}
			>
				{withSearch ? (
					<FormControl
						id={id}
						placeholder={placeholder}
						className="mb-2"
						style={{ backgroundColor: "lightgray" }}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				) : null}

				{filteredOptions.map(({ label, value }, idx) => (
					<Option
						key={value}
						name={label}
						id={value}
						index={idx}
						lastIndex={options.length - 1}
						onStateChange={(id, state) => {
							if (state) handleSelectOption(id);
							else setSelectedOptions((state) => state.filter((option) => option !== id));
						}}
					/>
				))}
			</div>
		</div>
	);
}

/**
 * @param {Object} props
 * @param {string} props.name
 * @param {number} props.id
 * @param {number} props.index
 * @param {number} props.lastIndex
 * @param {(id: number, state: boolean) => void} props.onStateChange
 */
function Option({ id, name, index, lastIndex, onStateChange }) {
	const [checked, setChecked] = useState(false);

	function handleCheckboxClick() {
		onStateChange(id, !checked);
		setChecked((state) => {
			return !state;
		});
	}

	return (
		<div
			className="d-flex align-items-center justify-content-center cursor-pointer px-3 py-1 pb-2"
			style={{
				backgroundColor: "lightgray",
				borderTopLeftRadius: index === 0 ? "0.5rem" : "",
				borderTopRightRadius: index === 0 ? "0.5rem" : "",
				borderBottomLeftRadius: index === lastIndex ? "0.5rem" : "",
				borderBottomRightRadius: index === lastIndex ? "0.5rem" : "",
				// borderBottom: index === lastIndex ? "" : "1px solid white",
			}}
		>
			<FormCheck
				type="checkbox"
				className="me-2"
				id={`${index}-option`}
				checked={checked}
				onChange={handleCheckboxClick}
			/>

			<FormLabel className="w-100 mb-0 text-black" htmlFor={`${index}-option`}>
				{name}
			</FormLabel>
		</div>
	);
}
