(function () {
    'use strict';

    var STORAGE_KEY = 'encounterSelections';
    var CATEGORY_ORDER = ['Land', 'Fish', 'Surf', 'Rocks', 'Other'];
    var CATEGORY_COLORS = {
        Land:  '#4a7c4e',
        Fish:  '#5b9bd5',
        Surf:  '#2e75b6',
        Rocks: '#7a7a7a',
        Other: '#a07830',
    };

    var data = window.ENCOUNTER_DATA;   // { routes: [...], encounters: {...} }
    var currentIndex = 0;
    var selections = {};                // { "Route Name": "PokemonName" }

    // ── Persistence ──────────────────────────────────────────────────────────

    function loadSelections() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            selections = raw ? JSON.parse(raw) : {};
        } catch (e) {
            selections = {};
        }
    }

    function saveSelections() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function caughtCount() {
        var count = 0;
        for (var i = 0; i < data.routes.length; i++) {
            if (selections[data.routes[i]]) count++;
        }
        return count;
    }

    // ── Route navigation ──────────────────────────────────────────────────────

    function navigateRoute(delta) {
        var next = currentIndex + delta;
        if (next < 0) next = data.routes.length - 1;
        if (next >= data.routes.length) next = 0;
        goToRoute(next);
    }

    function goToRoute(index) {
        currentIndex = index;
        document.getElementById('route-select').value = String(index);
        renderRoute(data.routes[index]);
    }

    window.navigateRoute = navigateRoute;

    // ── Route dropdown ────────────────────────────────────────────────────────

    function buildRouteDropdown() {
        var sel = document.getElementById('route-select');
        sel.innerHTML = '';
        for (var i = 0; i < data.routes.length; i++) {
            var opt = document.createElement('option');
            opt.value = String(i);
            opt.textContent = data.routes[i];
            sel.appendChild(opt);
        }
        sel.addEventListener('change', function () {
            goToRoute(parseInt(this.value, 10));
        });
    }

    // ── Progress strip ────────────────────────────────────────────────────────

    function buildProgressStrip() {
        var strip = document.getElementById('progress-strip');
        strip.innerHTML = '';
        for (var i = 0; i < data.routes.length; i++) {
            (function (idx) {
                var routeName = data.routes[idx];
                var dot = document.createElement('span');
                dot.className = 'route-progress-dot';
                dot.title = routeName + (selections[routeName] ? ': ' + selections[routeName] : ' (none)');
                dot.setAttribute('data-route-idx', String(idx));
                dot.addEventListener('click', function () { goToRoute(idx); });
                strip.appendChild(dot);
            }(i));
        }
        updateProgressStrip();
    }

    function updateProgressStrip() {
        var dots = document.querySelectorAll('.route-progress-dot');
        for (var i = 0; i < dots.length; i++) {
            var idx = parseInt(dots[i].getAttribute('data-route-idx'), 10);
            var routeName = data.routes[idx];
            var caught = !!selections[routeName];
            dots[i].className = 'route-progress-dot' + (caught ? ' caught' : ' empty');
            dots[i].title = routeName + (selections[routeName] ? ': ' + selections[routeName] : ' (none)');
        }
        // highlight current
        var current = document.querySelector('.route-progress-dot[data-route-idx="' + currentIndex + '"]');
        if (current) current.classList.add('current');
    }

    // ── Counter ───────────────────────────────────────────────────────────────

    function updateCounter() {
        var el = document.getElementById('catch-counter');
        if (el) el.textContent = caughtCount() + ' / ' + data.routes.length + ' caught';
    }

    // ── Route renderer ────────────────────────────────────────────────────────

    function renderRoute(routeName) {
        var routeEncounters = data.encounters[routeName] || {};
        var selected = selections[routeName] || null;

        // Route header
        var nameEl = document.getElementById('current-route-name');
        var selDisplay = document.getElementById('selected-display');
        if (nameEl) nameEl.textContent = routeName;
        if (selDisplay) {
            if (selected) {
                selDisplay.innerHTML = 'Selected: <strong class="tracker-selected-name">' + escapeHtml(selected) + '</strong> &#10003;';
                selDisplay.className = 'tracker-selected-display has-selection';
            } else {
                selDisplay.textContent = 'None selected';
                selDisplay.className = 'tracker-selected-display no-selection';
            }
        }

        var content = document.getElementById('encounter-content');
        content.innerHTML = '';

        var hasAny = false;
        for (var c = 0; c < CATEGORY_ORDER.length; c++) {
            var cat = CATEGORY_ORDER[c];
            var entries = routeEncounters[cat];
            if (!entries || entries.length === 0) continue;
            hasAny = true;

            var section = document.createElement('div');
            section.className = 'encounter-category-section';

            var header = document.createElement('div');
            header.className = 'encounter-category-header';
            header.textContent = cat;
            header.style.backgroundColor = CATEGORY_COLORS[cat] || '#555';
            section.appendChild(header);

            var table = document.createElement('table');
            table.className = 'encounter-table';

            // thead
            var thead = document.createElement('thead');
            var hrow = document.createElement('tr');
            var isStarter = (routeName === 'Starter');
            var cols = isStarter
                ? ['Level', 'Pok\u00e9mon', '']
                : ['%', 'Level', 'Pok\u00e9mon', ''];
            for (var h = 0; h < cols.length; h++) {
                var th = document.createElement('th');
                th.textContent = cols[h];
                hrow.appendChild(th);
            }
            thead.appendChild(hrow);
            table.appendChild(thead);

            // tbody
            var tbody = document.createElement('tbody');
            for (var e = 0; e < entries.length; e++) {
                (function (entry) {
                    var tr = document.createElement('tr');
                    var isSelected = (selected === entry.pokemon);
                    if (isSelected) tr.className = 'encounter-selected';

                    if (!isStarter) {
                        var tdPct = document.createElement('td');
                        tdPct.className = 'enc-pct';
                        tdPct.textContent = entry.percent || '';
                        tr.appendChild(tdPct);
                    }

                    var tdLvl = document.createElement('td');
                    tdLvl.className = 'enc-level';
                    tdLvl.textContent = entry.level || '';
                    tr.appendChild(tdLvl);

                    var tdPoke = document.createElement('td');
                    tdPoke.className = 'enc-pokemon';
                    tdPoke.textContent = entry.pokemon;
                    tr.appendChild(tdPoke);

                    var tdBtn = document.createElement('td');
                    tdBtn.className = 'enc-btn';
                    var btn = document.createElement('button');
                    btn.className = 'encounter-select-btn' + (isSelected ? ' selected' : '');
                    btn.textContent = isSelected ? '✓' : '○';
                    btn.title = isSelected ? 'Deselect ' + entry.pokemon : 'Select ' + entry.pokemon;
                    btn.addEventListener('click', function () {
                        toggleSelection(routeName, entry.pokemon);
                    });
                    tdBtn.appendChild(btn);
                    tr.appendChild(tdBtn);

                    tr.style.cursor = 'pointer';
                    tr.addEventListener('click', function (ev) {
                        if (ev.target.tagName === 'BUTTON') return;
                        toggleSelection(routeName, entry.pokemon);
                    });

                    tbody.appendChild(tr);
                }(entries[e]));
            }
            table.appendChild(tbody);
            section.appendChild(table);
            content.appendChild(section);
        }

        if (!hasAny) {
            var empty = document.createElement('p');
            empty.className = 'tracker-empty';
            empty.textContent = 'No encounters for this route.';
            content.appendChild(empty);
        }

        updateProgressStrip();
        updateCounter();
    }

    // ── Selection toggle ──────────────────────────────────────────────────────

    function toggleSelection(routeName, pokemon) {
        if (selections[routeName] === pokemon) {
            delete selections[routeName];
        } else {
            selections[routeName] = pokemon;
        }
        saveSelections();
        renderRoute(routeName);
    }

    // ── Init ──────────────────────────────────────────────────────────────────

    function init() {
        if (!window.ENCOUNTER_DATA) {
            document.getElementById('encounter-content').textContent = 'Error: encounter data not loaded.';
            return;
        }

        loadSelections();
        buildRouteDropdown();
        buildProgressStrip();
        updateCounter();

        // Start on first route that has no selection, or route 0
        var startIdx = 0;
        for (var i = 0; i < data.routes.length; i++) {
            if (!selections[data.routes[i]]) {
                startIdx = i;
                break;
            }
        }
        goToRoute(startIdx);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

}());
