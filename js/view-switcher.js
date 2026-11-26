(function () {
	var link = document.getElementById('view-style');
	var buttons = document.querySelectorAll('[data-view]');
	if (!link) { return; }
	function setView(name) {
		link.setAttribute('href', 'css/view-' + name + '.css');
		for (var i = 0; i < buttons.length; i++) {
			buttons[i].setAttribute('aria-pressed', buttons[i].getAttribute('data-view') === name ? 'true' : 'false');
		}
		try { localStorage.setItem('novaplay-view', name); } catch (e) { /* storage may be blocked */ }
	}
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener('click', function () { setView(this.getAttribute('data-view')); });
	}
	var saved = null;
	try { saved = localStorage.getItem('novaplay-view'); } catch (e) { /* ignore */ }
	setView(saved || 'default');
})();
