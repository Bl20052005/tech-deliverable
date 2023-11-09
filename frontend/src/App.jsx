import "./App.css";
import Quotes from "./Quotes";
import { useState } from "react";
import quotebook from './quotebook.png';

function App() {

	const [quoteTime, setQuoteTime] = useState("past_hour")
	const [nameAndMessage, setNameAndMessage] = useState(["", ""])
	const [quotes, setQuotes] = useState([])

	const handleFormOnSubmit = (e) => {
		/* handles form submit without reloading the page */
		e.preventDefault();
		setNameAndMessage(["", ""]);
		let data = new FormData(e.target)
		let url = `/api/quote`
		fetch(url, {
			method: 'POST',
			body: data,
			})
	}

	const handleFormOnGet = (e, path) => {
		/* gets quotes depending on what timeframe the user inputted,
		then creates the quotes to be displayed to the user */
		e.preventDefault();
		let url = `${path}?time=${quoteTime}`
		fetch(url)
		.then((response) => response.json())
		.then((data) => {
			let quote_array = data.map((datum, index) => {
				return <Quotes key={`datum-${index}`} text={datum.message} author={datum.name} time={datum.time} />
			})
			setQuotes(quote_array)
		})
	}

	return (
		<div className="App flex-column">
			{/* TODO: include an icon for the quote book */}
			<div id="quotebook-logo-background">
				<img src={quotebook} alt="quotebook logo" id="quotebook-logo"></img>
			</div>
			
			<h1>Hack @ UCI Tech Deliverable</h1>

			<h2>Submit a quote</h2>
			{/* TODO: implement custom form submission logic to not refresh the page */}
			<form className="input-form flex-column" action="/api/quote" method="post" onSubmit={(e) => handleFormOnSubmit(e)}>
				<div className="input-form-main">
					<div className="input-form-input flex-column">
						<label htmlFor="input-name">Name:</label>
						<input type="text" name="name" id="input-name" onChange={(e) => setNameAndMessage([e.target.value, nameAndMessage[1]])} value={nameAndMessage[0]} required />	
					</div>
					<div className="input-form-input flex-column">
						<label htmlFor="input-message">Quote:</label>
						<input type="text" name="message" id="input-message" onChange={(e) => setNameAndMessage([nameAndMessage[0], e.target.value])} value={nameAndMessage[1]} required />	
					</div>
				</div>
				<button className="submit-button" type="submit">Submit</button>
			</form>

			<h2>Previous Quotes</h2>
			{/* TODO: Display the actual quotes from the database */}
			<div className="messages">
					<form action="/api/quote/get" method="get" onSubmit={(e) => handleFormOnGet(e, "/api/quote/get")}>
						<div className="messages-dropdown-menu flex-column">
							<select className="select" name="time" id="time" onChange={(e) => setQuoteTime(e.target.value)}>
								<option value="past_hour">Past hour</option>
								<option value="past_day">Past day</option>
								<option value="past_week">Past week</option>
								<option value="past_two_weeks">Past two weeks</option>
								<option value="past_month">Past month</option>
								<option value="past_year">Past year</option>
								<option value="all">All quotes</option>
							</select>
							<button className="submit-button" type="submit">Submit</button>
						</div>
					</form>
				
				<div className="quote-container flex-column">
					{quotes}
				</div>
			</div>
		</div>
	);
}

export default App;
