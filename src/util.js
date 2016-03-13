export function ready(fn) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

export function debounce(fn) {
		$('input').keypress(function() {
			if (this.timeoutId)
				window.clearTimeout(this.timeoutId);
			this.timeoutId = window.setTimeout(function () {
				$.ajax({
					// do some stuff
				});
			}, 200);
		});
}
