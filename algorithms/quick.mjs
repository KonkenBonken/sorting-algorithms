export function* sortAlgorithm(nodes, { canvas, swap, check }) {
	function swapElements(i, j) {
		const node1 = nodes[i],
			node2 = nodes[j];
		const afterNode2 = node2.nextElementSibling;
		node1.replaceWith(node2);
		canvas.insertBefore(node1, afterNode2);
		swap();
	}

	function* quickSort(arr, low, high) {
		if (low >= high) return;

		let pivot = arr[high],
			i = low - 1;

		for (let j = low; j <= high - 1; j++)
			if (arr[j] < pivot) {
				check(arr[j]);
				yield;
				swapElements(++i, j);
			}

		yield;
		swapElements(++i, high)

		yield* quickSort(arr, low, i - 1);
		yield* quickSort(arr, i + 1, high);
	}

	yield* quickSort(nodes, 0, nodes.length - 1);
}

export const bigO_txt = {
	average: 'nlog n'
};
export const bigO_val = {
	average: n => n * Math.log(n)
}