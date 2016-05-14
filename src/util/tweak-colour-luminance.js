//thank you: http://www.sitepoint.com/javascript-generate-lighter-darker-color/

export default function (hex, lum = 0) {

	// convert #000s to #000000s
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}

	// convert to decimal and change luminosity
	let rgb = "#";
	let c;
	for (let i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}
