export default function(str) {
	if(!str) {
		return [];
	}

	const sanitizedStr = str.replace(/ /g, '');

	if(!/^(?:(?:[0-9]+,)*[0-9]+)|[0-9]+$/.test(sanitizedStr)) {
		return [];
	} else {
		return str.split(',').reduce((arr, s) => arr.concat(s.length ? [+s]: []), []);
	}
}
