import "./App.css";
import { useState } from "react";

function App() {

	const [quoteTime, setQuoteTime] = useState("past_hour")

	const handleFormOnSubmit = (e) => {
		/* handles form submit without reloading the page */
		e.preventDefault();
		let data = new FormData(e.target)
		let url = `/api/quote`
		fetch(url, {
			method: 'POST',
			body: data,
			})
	}

	const handleFormOnGet = (e, path) => {
		/* gets quotes depending on what timeframe the user inputted,
		currently does console.log */
		e.preventDefault();
		let url = `${path}?time=${quoteTime}`
		console.log(url)
		fetch(url)
		.then((response) => response.json())
		.then((data) => console.log(data))
	}

	const handleOnTimeChange = (e) => {
		setQuoteTime(e.target.value);
	}

	return (
		<div className="App">
			{/* TODO: include an icon for the quote book */}
			<h1>Hack @ UCI Tech Deliverable</h1>

			<h2>Submit a quote</h2>
			{/* TODO: implement custom form submission logic to not refresh the page */}
			<form action="/api/quote" method="post" onSubmit={(e) => handleFormOnSubmit(e)}>
				<label htmlFor="input-name">Name</label>
				<input type="text" name="name" id="input-name" required />
				<label htmlFor="input-message">Quote</label>
				<input type="text" name="message" id="input-message" required />
				<button type="submit">Submit</button>
			</form>

			<h2>Previous Quotes</h2>
			{/* TODO: Display the actual quotes from the database */}
			<div className="messages">
				<p>Peter Anteater</p>
				<p>Zot Zot Zot!</p>
				<p>Every day</p>
				<form action="/api/quote/get" method="get" onSubmit={(e) => handleFormOnGet(e, "/api/quote/get")}>
				<select name="time" id="time" onChange={(e) => handleOnTimeChange(e)}>
					<option value="past_hour">Past hour</option>
					<option value="past_day">Past day</option>
					<option value="past_week">Past week</option>
					<option value="past_two_weeks">Past two weeks</option>
					<option value="past_month">Past month</option>
					<option value="past_year">Past year</option>
					<option value="all">All quotes</option>
				</select>
					<button type="submit">Submit</button>
				</form>
			</div>
		</div>
	);
}

export default App;
