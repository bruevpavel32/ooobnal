(function () {
	var CATEGORY_NAMES = { slots: 'Слоты', table: 'Настольные', lotto: 'Лото', instant: 'Мгновенные' };
	var CRITERIA = [
		{ key: 'category', title: 'Категория', order: ['Слоты', 'Настольные', 'Лото', 'Мгновенные'],
			get: function (g) { return CATEGORY_NAMES[g.category]; } },
		{ key: 'provider', title: 'Провайдер', order: null,
			get: function (g) { return g.provider; } },
		{ key: 'minBet', title: 'Минимальная ставка', order: ['1 монета', '2–9 монет', '10 монет и больше'],
			get: function (g) { return g.minBet <= 1 ? '1 монета' : (g.minBet < 10 ? '2–9 монет' : '10 монет и больше'); } },
		{ key: 'rtp', title: 'RTP', order: ['ниже 96%', '96–98%', '98% и выше'],
			get: function (g) { return g.rtp < 96 ? 'ниже 96%' : (g.rtp < 98 ? '96–98%' : '98% и выше'); } }
	];
	var panel = document.getElementById('filters');
	var list = document.getElementById('games-list');
	var counter = document.getElementById('result-count');
	if (!panel || !list || typeof GAMES === 'undefined') { return; }

	var selected = {};
	var searchText = '';
	var checkboxes = [];

	GAMES.forEach(function (g) {
		g.attrs = {};
		CRITERIA.forEach(function (c) { g.attrs[c.key] = c.get(g); });
	});

	function valuesOf(c) {
		if (c.order) { return c.order; }
		var vals = [];
		GAMES.forEach(function (g) { if (vals.indexOf(g.attrs[c.key]) < 0) { vals.push(g.attrs[c.key]); } });
		return vals.sort();
	}

	/* Game matches all selected criteria except skipKey (needed for the smart counters) */
	function matches(g, skipKey) {
		if (searchText && g.name.toLowerCase().indexOf(searchText) < 0) { return false; }
		for (var i = 0; i < CRITERIA.length; i++) {
			var key = CRITERIA[i].key;
			if (key !== skipKey && selected[key].length && selected[key].indexOf(g.attrs[key]) < 0) { return false; }
		}
		return true;
	}

	function buildPanel() {
		var html = '<div class="filter-search"><label for="search">Поиск по названию</label><input id="search" type="search"></div>';
		CRITERIA.forEach(function (c) {
			selected[c.key] = [];
			html += '<fieldset class="filter-group"><legend>' + c.title + '</legend>';
			valuesOf(c).forEach(function (v) {
				html += '<label class="filter-option"><input type="checkbox" name="' + c.key + '" value="' + v + '"> ' + v + ' <span class="filter-count"></span></label>';
			});
			html += '</fieldset>';
		});
		html += '<button type="button" id="reset-filters" class="button button-small">Сбросить фильтры</button>';
		panel.innerHTML = html;
		checkboxes = panel.querySelectorAll('input[type="checkbox"]');
	}

	function readState() {
		CRITERIA.forEach(function (c) { selected[c.key] = []; });
		for (var i = 0; i < checkboxes.length; i++) {
			if (checkboxes[i].checked) { selected[checkboxes[i].name].push(checkboxes[i].value); }
		}
	}

	function updateOptions() {
		for (var i = 0; i < checkboxes.length; i++) {
			var box = checkboxes[i];
			var count = GAMES.filter(function (g) { return matches(g, box.name) && g.attrs[box.name] === box.value; }).length;
			box.disabled = (count === 0 && !box.checked);
			box.parentNode.className = 'filter-option' + (box.disabled ? ' is-disabled' : '');
			box.parentNode.querySelector('.filter-count').textContent = '(' + count + ')';
		}
	}

	function card(g) {
		return '<article class="card"><img src="images/game-' + g.id + '.svg" alt="' + g.alt + '" width="400" height="220">' +
			'<div class="card-body"><h2 class="card-title">' + g.name + '</h2><p>' + g.text + '</p>' +
			'<div class="card-meta"><span>' + g.provider + '</span><span>' + g.minBet + '–' + g.maxBet + ' монет</span><span>RTP ' + String(g.rtp).replace('.', ',') + '%</span></div></div></article>';
	}

	function render() {
		var found = GAMES.filter(function (g) { return matches(g, null); });
		list.innerHTML = found.map(card).join('');
		counter.textContent = found.length ? 'Найдено игр: ' + found.length + ' из ' + GAMES.length : 'Игр с такими параметрами нет. Сбросьте фильтры.';
	}

	function update() { readState(); updateOptions(); render(); }

	buildPanel();
	panel.addEventListener('change', update);
	panel.addEventListener('input', function (e) {
		if (e.target.id === 'search') { searchText = e.target.value.toLowerCase(); update(); }
	});
	panel.addEventListener('click', function (e) {
		if (e.target.id === 'reset-filters') {
			for (var i = 0; i < checkboxes.length; i++) { checkboxes[i].checked = false; }
			document.getElementById('search').value = '';
			searchText = '';
			update();
		}
	});
	update();
})();
