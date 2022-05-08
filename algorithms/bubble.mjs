export function* sortAlgorithm(nodes, { check, afterIteration }) {
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
			}
			yield;
		}
		afterIteration();
	} while (!done);
}