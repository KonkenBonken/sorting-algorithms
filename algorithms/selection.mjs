export function* sortAlgorithm(nodes, { canvas, swap, check, afterIteration }) {
	const length = nodes.length;
	let iteration = 0;
	for (var i = 0; i < length - 1; i++) {
		var minimum = nodes[iteration];

		for (var j = 1 + iteration; j < length; j++) {
			const a = nodes[j];

			check(a);
			if (a < minimum)
				minimum = a;

			yield;
		}
		swap();
		canvas.insertBefore(minimum, nodes[iteration++]);
		afterIteration();
	}
}

export const bigO_txt = {
	min: 'n<sup>2</sup>',
	max: 'n<sup>2</sup>',
	average: 'n<sup>2</sup>'
};
export const bigO_val = {
	min: n => n ** 2,
	max: n => n ** 2,
	average: n => n ** 2
}