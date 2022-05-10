export function sortAlgorithm(_nodes, { canvas, swap, check }) {
	let nodes = Array.from(_nodes);

	function* merge(p, q, r) {
		let length1 = q - p + 1,
			length2 = r - q,
			array1 = nodes.slice(p, q + 1),
			array2 = nodes.slice(q + 1, r + 1),
			i = 0,
			j = 0,
			k = p;

		while (i < length1 && j < length2) {
			check(array1[i], array2[j])
			yield nodes[k++] = array1[i] <= array2[j] ? array1[i++] : array2[j++];
		}

		while (i < length1)
			yield nodes[k++] = array1[i++];

		while (j < length2)
			yield nodes[k++] = array2[j++];

	}

	function* mergeSort(p, r) {
		check();
		if (p >= r) return;
		let q = Math.floor((p + r) / 2);
		yield* mergeSort(p, q);
		yield* mergeSort(q + 1, r);

		const mIt = merge(p, q, r);
		while (true) {
			yield canvas.append(...nodes);
			swap();
			if (mIt.next().done) break;
		}
	}

	return mergeSort(0, nodes.length - 1)
}

export const bigO_txt = {
	min: 'nlog n',
	max: 'nlog n',
	average: 'nlog n'
};
export const bigO_val = {
	min: n => n * Math.log(n),
	max: n => n * Math.log(n),
	average: n => n * Math.log(n)
}