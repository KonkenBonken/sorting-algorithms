console.log('App.js running');
const newDiv = (el = 'div', ...classes) => {
		let div = document.createElement(el);
		if (classes) classes.forEach(cl => div.classList.add(cl));
		return div;
	},
	querySelector = s => document.querySelector(s),
	querySelectorAll = s => Array.from(document.querySelectorAll(s)),
	q = querySelector,
	qa = querySelectorAll;
