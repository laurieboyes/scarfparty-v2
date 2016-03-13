export default function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();

		// if image isn't on static.lrnk.co.uk (e.g. if I'm running it locally), we need an Access-Control-Allow-Origin: *
		// header on the image
		img.crossOrigin = 'Anonymous';

		img.src = src;

		img.onload = () => {
			resolve(img);
		};

		img.onerror = () => {
			reject(new Error(`Error loading image from ${src}`));
		}
	})
}
