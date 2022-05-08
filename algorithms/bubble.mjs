export function* sortAlgorithm(nodes, { check, swap, afterIteration }) {
	const length = nodes.length;
	let flip = 0;
	do {
		var done = true;

		for (var i = ++flip % 2; i < length - 1; i += 2) {
			const a = nodes[i],
				b = nodes[i + 1];

			check(a, b);
			if (a > b) {
				done = false;
				a.before(b);
				swap();
			}
			yield;
		}
		afterIteration();
	} while (!done);
}

export const bigO_txt = {
	min: 'n',
	max: 'n<sup>2</sup>',
	average: 'n<sup>2</sup>'
};
export const bigO_val = {
	min: n => n,
	max: n => n ** 2,
	average: n => n ** 2
}