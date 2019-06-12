import React, { useState, useEffect } from "react";
import { useTransition, animated } from 'react-spring';

const RandomQuoteMachine = ({ quote, author, themeColor, getNewQuote, transitionDuration }) => {
	const textTransition = {
		from: { position: 'absolute', opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		config: {
			duration: transitionDuration
		}
	}

	const transitionsQuote = useTransition(quote, null, textTransition);
	const transitionsAuthor = useTransition(author, null, textTransition);

	return (
		<div className="quote-machine">
			<div className="quote-controller">
				<a href={ `https://twitter.com/intent/tweet?text="${ quote }" - ${ author }` } target="_blank" className="tweet">Tweet</a>
				<button onClick={ getNewQuote } className="new-quote">New Quote</button>
			</div>
			
			<div className="quote-container">
				<div className="quote-author">
					{transitionsAuthor.map(({ item, key, props }) => (
						<animated.p 
							key={ key } 
							style={props}
							className="author"
						>{ item }</animated.p>
					))}
				</div>
				<div className="quote-text">
					<span className="double-quote-start">"</span>
					{transitionsQuote.map(({ item, key, props }) => (
						<animated.span 
							key={ key } 
							style={ props }
							className="quote"
						>{ item }</animated.span>
					))}
					<span className="double-quote-end">"</span>
				</div>
			</div>
		</div>
	);
}

const App = () => {
	const randomQuoteUrl = 'https://quota.glitch.me/random';
	const colors = ['#F44336', '#E91E63', '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'];
	const transitionDuration = 500;

	const [themeColor, setThemeColor] = useState('#9E9E9E');
	const [quote, setQuote] = useState({ quoteText: '', quoteAuthor: '' });

	// Don't set state in recursive function!
	const getNewColor = () => {
		const randomNumber = Math.floor(Math.random() * colors.length);
		const randomColor = colors[randomNumber];
		if (randomColor === themeColor) {
			return getNewColor();
		}
		return randomColor;
	}

	const changeQuoteTextHeight = () => {
		setTimeout(() => {
			const quoteHeight = document.querySelector('.quote-text .quote').clientHeight;
			document.querySelector('.quote-text').style.height = quoteHeight + 'px';
		}, (transitionDuration + 100))
	}

	const getNewQuote = () => {
		fetch(randomQuoteUrl)
			.then(response => response.json())
			.then(({quoteText, quoteAuthor}) => {
				setThemeColor(getNewColor());
				setQuote({ quoteText, quoteAuthor });
				changeQuoteTextHeight();
			})
			.catch((error) => {
				setQuote({ quoteText: 'Sorry, there was an error while trying to connect to the server! Try again later.', quoteAuthor: '404' });
			});
	}

	useEffect(() => {
		getNewQuote();
	}, []);

	return (
		<div className="main-container" style={{ backgroundColor: themeColor }}>
			<RandomQuoteMachine 
				quote={ quote.quoteText } 
				author={ quote.quoteAuthor } 
				themeColor={ themeColor }
				getNewQuote={ getNewQuote }
				transitionDuration={ transitionDuration }
			/>
		</div>
	)
};

export default App;