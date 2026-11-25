(function () {
	var search = document.getElementById('search');
	var category = document.getElementById('category');
	var cards = document.querySelectorAll('[data-category]');
	function filter() {
		var word = search.value.toLowerCase();
		for (var i = 0; i < cards.length; i++) {
			var okCat = !category.value || cards[i].getAttribute('data-category') === category.value;
			var okName = cards[i].getAttribute('data-name').toLowerCase().indexOf(word) > -1;
			cards[i].hidden = !(okCat && okName);
		}
	}
	if (search && category) {
		search.addEventListener('input', filter);
		category.addEventListener('change', filter);
	}
	var form = document.getElementById('contact-form');
	if (form) {
		form.addEventListener('submit', function (e) { e.preventDefault(); });
	}
})();
