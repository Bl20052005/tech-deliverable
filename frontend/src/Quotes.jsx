import "./Quotes.css";

function Quotes(props) {
	return (
		<div className="quotes">
            <p className="quote-text">{props.text}</p>
            <p className="quote-author">{props.author}</p>
            <p className="quote-time">{props.time}</p>
        </div>
	);
}

export default Quotes;
