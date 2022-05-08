console.log('App.js running');
const newDiv = (el = 'div', ...classes) => {
		let div = document.createElement(el);
		if (classes) classes.forEach(cl => div.classList.add(cl));
		return div;
	},
	q = s => document.querySelector(s),
	qa = s => Array.from(document.querySelectorAll(s)),
	sleep = (ms = 100) => new Promise(r => setTimeout(r, ms));

const hash = window.location.search.substr(1) || 'bubble';
q('h1').innerHTML = hash + ' sort';

window.stop = false;
const wrapper = q('section#wrapper'),
	nodes = wrapper.children;

wrapper.append(...Array(100).fill().map((_, i) => {
	i++;
	const div = newDiv();

	div.value = i;
	div.valueOf = () => div.value;
	div.style.setProperty('--value', i);

	return div;
}).sort(() => Math.random() - .5));

let checks = 0,
	soundState = false,
	playSound = () => false,
	setVolume = () => false;
q('#start_sound').addEventListener('click', e => {
	soundState = !soundState;
	if (!soundState) {
		playSound = () => false;
		e.target.innerHTML = 'Start Sound';
		return;
	}
	e.target.innerHTML = 'Stop Sound';

	const context = new AudioContext();

	const gain = context.createGain();
	// gain.connect(context.destination);
	setVolume = window.setVolume = v => gain.gain.setValueAtTime(v, context.currentTime);
	setVolume(.04);


	playSound = window.playSound = value => {
		const o = context.createOscillator()
		o.connect(gain).connect(context.destination)
		o.frequency.value = value * 6 + 250;
		o.start();
		setTimeout(() => o.stop(), 30)
		return true;
	}
});

const assets = {
	wrapper,
	check: (...checkedElements) => {
		checkedElements.forEach(el => el.classList.add('checked'));
		checks++;
		playSound(checkedElements[0]);
	},
	afterIteration: () => [...nodes].forEach(el => el.classList.remove('checked')),
};

const { sortAlgorithm } = await import(`../algorithms/${hash}.mjs`);
const it = window.it = sortAlgorithm(nodes, assets);
console.log(it);

do {
	var { done } = it.next();
	await sleep(1);
} while (!done && !window.stop);

for (var node of nodes) {
	node.classList.add('done');
	playSound(node);
	await sleep(1);
}