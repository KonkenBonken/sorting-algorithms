console.log('App.js running');
const newDiv = (el = 'div', attr = {}) => {
		let div = document.createElement(el);
		for (let [key, value] of Object.entries(attr))
			div[key] = value
		return div;
	},
	q = s => document.querySelector(s),
	qa = s => Array.from(document.querySelectorAll(s)),
	sleep = (ms = 100) => new Promise(r => setTimeout(r, ms));

const hash = window.location.search.substr(1) || 'bubble';
q('h1').innerHTML = hash + ' sort';

window.stop = false;
const canvas = q('#canvas'),
	speedDial = q('#speed>input'),
	pauseButton = q('#buttons>#pause'),
	dataSection = q('#data'),
	nodes = canvas.children;

canvas.append(...Array(100).fill().map((_, i) => {
	i++;
	const div = newDiv();

	div.value = i;
	div.valueOf = () => div.value;
	div.style.setProperty('--value', i);

	return div;
}).sort(() => Math.random() - .5));

const hovered = newDiv(),
	hoveredData = newDiv('span', { id: 'hovered' });
hovered.append(newDiv('span', { id: 'label', innerHTML: 'Value' }), hoveredData);

for (const node of nodes) {
	node.addEventListener('mouseover', () => {
		dataSection.append(hovered);
		hoveredData.innerHTML = +node;
	});
	canvas.addEventListener('mouseout', () => hovered.remove());
}

let soundState = false,
	playSound = () => false,
	setVolume = () => false;
const volumeEl = newDiv(),
	volumeData = newDiv('span', { id: 'volume', innerHTML: 4 }),
	volumeInput = q('#volume>input');
volumeEl.append(newDiv('span', { id: 'label', innerHTML: 'Volume' }), volumeData);

if (+sessionStorage.getItem('volume'))
	volumeData.innerHTML = volumeInput.value = +sessionStorage.getItem('volume') || 2;
volumeInput.addEventListener('input', e => {
	setVolume(e.target.value / 50);
	sessionStorage.setItem('volume',
		volumeData.innerHTML = e.target.value);
});

q('#buttons>#sound').addEventListener('click', e => {
	soundState = !soundState;
	if (!soundState) {
		playSound = () => false;
		e.target.innerHTML = 'Start Sound';
		volumeEl.remove();
		return;
	}
	e.target.innerHTML = 'Stop Sound';

	const context = new AudioContext();

	const gain = context.createGain();

	setVolume = window.setVolume = v => gain.gain.setValueAtTime(v, context.currentTime);
	setVolume(volumeInput.value / 50);

	dataSection.append(volumeEl);

	playSound = window.playSound = value => {
		const o = context.createOscillator()
		o.connect(gain).connect(context.destination)
		o.frequency.value = value * 6 + 250;
		o.start();
		setTimeout(() => o.stop(), 30)
		return true;
	}
});

let onUnpause = Promise.resolve(),
	resolvePause,
	paused = false;
pauseButton.addEventListener('click', () => {
	paused = !paused;
	pauseButton.innerHTML = paused ? 'Play' : 'Pause';
	if (paused)
		onUnpause = new Promise(res => resolvePause = res);
	else resolvePause();
})

const checksEl = q('#data #checks'),
	swapsEl = q('#data #swaps');

const
	data = {
		checks: 0,
		swaps: 0,
	},
	assets = {
		canvas,
		check(...checkedElements) {
			checkedElements.forEach(el => el.classList.add('checked'));
			checksEl.innerHTML = ++data.checks;
			playSound(checkedElements[0]);
		},
		swap: () => swapsEl.innerHTML = ++data.swaps,
		afterIteration: () => [...nodes].forEach(el => el.classList.remove('checked')),
	};

const speedEl = q('#data #speed');
speedDial.addEventListener('input', () => sessionStorage.setItem('speed', speedEl.innerHTML = speedDial.value));
if (+sessionStorage.getItem('speed'))
	speedEl.innerHTML = speedDial.value = +sessionStorage.getItem('speed');

const { sortAlgorithm } = await import(`../algorithms/${hash}.mjs`);
const it = window.it = sortAlgorithm(nodes, assets);
console.log(it);

const delay = () => {
	if (speedDial.value < 10)
		return sleep(100 * (10 - speedDial.value));
	if (!(index % (speedDial.value - 9)))
		return sleep(1);
	return Promise.resolve();
};
let index = 0;

do {
	var { done } = it.next();

	index++;
	await delay()

	await onUnpause;
} while (!done && !window.stop);

for (var node of nodes) {
	node.classList.add('done');
	playSound(node);
	await sleep(7);
}