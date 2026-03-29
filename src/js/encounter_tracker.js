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

    // ── Sprite helpers ────────────────────────────────────────────────────────

    function getPokemonSpriteUrl(name) {
        var normalized = name
            .toLowerCase()
            .replace(/♀/g, '-f')
            .replace(/♂/g, '-m')
            .replace(/[''´`]/g, '')
            .replace(/[.\s:]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        return 'https://play.pokemonshowdown.com/sprites/gen5/' + normalized + '.png';
    }

    // ── Cross-route pokemon lookup ────────────────────────────────────────────

    // Returns the name of the earliest route (before currentRouteName) where
    // the given pokemon was selected, or null if it has not been caught earlier.
    function getPreviousCatchRoute(pokemonName, currentRouteName) {
        var currentIdx = data.routes.indexOf(currentRouteName);
        for (var i = 0; i < currentIdx; i++) {
            if (selections[data.routes[i]] === pokemonName) {
                return data.routes[i];
            }
        }
        return null;
    }

    // ── Route renderer ────────────────────────────────────────────────────────

    // Collapse duplicate Pokémon entries within a category, summing percentages and merging level ranges.
    function deduplicateEntries(entries) {
        var seen = {};   // pokemon name -> { pctSum, levels: Set }
        var order = [];
        for (var i = 0; i < entries.length; i++) {
            var e = entries[i];
            var name = e.pokemon;
            var pct = parseInt(e.percent) || 0;
            var lvl = String(e.level || '');
            if (!seen[name]) {
                seen[name] = { pctSum: pct, levels: [lvl] };
                order.push(name);
            } else {
                seen[name].pctSum += pct;
                if (lvl && seen[name].levels.indexOf(lvl) === -1) seen[name].levels.push(lvl);
            }
        }
        return order.map(function (name) {
            var d = seen[name];
            // Merge level strings: collect all unique numbers, build a compact range
            var nums = [];
            d.levels.forEach(function (lvlStr) {
                lvlStr.split(/[-–,\s]+/).forEach(function (n) { var v = parseInt(n); if (!isNaN(v)) nums.push(v); });
            });
            nums = nums.filter(function (v, i, a) { return a.indexOf(v) === i; }).sort(function (a, b) { return a - b; });
            var levelDisplay = '';
            if (nums.length === 1) {
                levelDisplay = String(nums[0]);
            } else if (nums.length > 1) {
                levelDisplay = nums[0] + '-' + nums[nums.length - 1];
            }
            return { pokemon: name, percent: d.pctSum > 0 ? d.pctSum + '%' : '', level: levelDisplay };
        });
    }

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

        var isStarter = (routeName === 'Starter');
        var hasAny = false;
        var categoriesHtml = [];

        for (var c = 0; c < CATEGORY_ORDER.length; c++) {
            var cat = CATEGORY_ORDER[c];
            var rawEntries = routeEncounters[cat];
            if (!rawEntries || rawEntries.length === 0) continue;
            hasAny = true;

            var entries = deduplicateEntries(rawEntries);
            var color = CATEGORY_COLORS[cat] || '#555';

            // Determine which entries were caught in an earlier route and
            // compute adjusted encounter rates for the remaining entries.
            var prevCaughtMap = {};   // pokemon -> route name where it was caught
            var totalCatPct = 0;
            var caughtCatPct = 0;
            for (var ei = 0; ei < entries.length; ei++) {
                var entryPct = parseInt(entries[ei].percent) || 0;
                totalCatPct += entryPct;
                var prevRoute = getPreviousCatchRoute(entries[ei].pokemon, routeName);
                if (prevRoute) {
                    prevCaughtMap[entries[ei].pokemon] = prevRoute;
                    caughtCatPct += entryPct;
                }
            }
            var remainingCatPct = totalCatPct - caughtCatPct;
            var hasRateAdjustment = !isStarter && caughtCatPct > 0 && remainingCatPct > 0;

            // Pre-compute adjusted display percentages for non-caught entries.
            var adjustedPcts = {};
            if (hasRateAdjustment) {
                for (var ei2 = 0; ei2 < entries.length; ei2++) {
                    var ename = entries[ei2].pokemon;
                    if (!prevCaughtMap[ename]) {
                        var rawPct = parseInt(entries[ei2].percent) || 0;
                        var adjVal = Math.round(rawPct / remainingCatPct * 100 * 10) / 10;
                        adjustedPcts[ename] = (adjVal === Math.floor(adjVal) ? Math.floor(adjVal) : adjVal) + '%';
                    }
                }
            }

            var section = document.createElement('div');
            section.className = 'encounter-category-section';

            var header = document.createElement('div');
            header.className = 'encounter-category-header';
            header.textContent = cat;
            header.style.backgroundColor = color;
            section.appendChild(header);

            var grid = document.createElement('div');
            grid.className = 'encounter-pill-grid';

            for (var e = 0; e < entries.length; e++) {
                (function (entry) {
                    var isSelected = (selected === entry.pokemon);
                    var prevCaughtRoute = prevCaughtMap[entry.pokemon] || null;
                    var displayPct = hasRateAdjustment && !prevCaughtRoute
                        ? (adjustedPcts[entry.pokemon] || entry.percent)
                        : entry.percent;

                    var pill = document.createElement('div');
                    if (prevCaughtRoute) {
                        pill.className = 'encounter-pill encounter-pill-prev-caught';
                        pill.title = entry.pokemon + ' was already caught in ' + prevCaughtRoute;
                    } else {
                        pill.className = 'encounter-pill' + (isSelected ? ' encounter-pill-selected' : '');
                        var titleParts = [];
                        if (!isStarter && displayPct) titleParts.push(displayPct + (hasRateAdjustment ? ' (adjusted)' : ''));
                        if (entry.level) titleParts.push('Lv ' + entry.level);
                        pill.title = titleParts.join(' · ');
                    }

                    var meta = document.createElement('span');
                    if (prevCaughtRoute) {
                        meta.className = 'enc-pill-meta enc-pill-caught-label';
                        meta.textContent = '✓ caught';
                    } else {
                        meta.className = 'enc-pill-meta';
                        var parts = [];
                        if (!isStarter && displayPct) parts.push(displayPct);
                        if (entry.level) parts.push('Lv\u00a0' + entry.level);
                        meta.textContent = parts.join(' · ');
                    }

                    var sprite = document.createElement('img');
                    sprite.className = 'enc-pill-sprite';
                    sprite.src = getPokemonSpriteUrl(entry.pokemon);
                    sprite.alt = '';
                    sprite.loading = 'lazy';
                    sprite.onerror = function () { this.style.display = 'none'; };

                    var nameSpan = document.createElement('span');
                    nameSpan.className = 'enc-pill-name' + (prevCaughtRoute ? ' enc-pill-name-caught' : '');
                    nameSpan.textContent = entry.pokemon;

                    var btn = document.createElement('button');
                    if (prevCaughtRoute) {
                        btn.className = 'encounter-select-btn prev-caught-btn';
                        btn.textContent = '✗';
                        btn.title = 'Already caught in ' + prevCaughtRoute;
                        btn.disabled = true;
                    } else {
                        btn.className = 'encounter-select-btn' + (isSelected ? ' selected' : '');
                        btn.textContent = isSelected ? '✓' : '○';
                        btn.title = isSelected ? 'Deselect ' + entry.pokemon : 'Select ' + entry.pokemon;
                        btn.addEventListener('click', function (ev) {
                            ev.stopPropagation();
                            toggleSelection(routeName, entry.pokemon);
                        });
                    }

                    pill.appendChild(meta);
                    pill.appendChild(sprite);
                    pill.appendChild(nameSpan);
                    pill.appendChild(btn);

                    if (!prevCaughtRoute) {
                        pill.style.cursor = 'pointer';
                        if (isSelected) pill.style.borderColor = color;
                        pill.addEventListener('click', function () {
                            toggleSelection(routeName, entry.pokemon);
                        });
                    }

                    grid.appendChild(pill);
                }(entries[e]));
            }

            section.appendChild(grid);
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

    // ── Reset all selections ───────────────────────────────────────────────

    function resetAll() {
        if (!confirm('Clear all encounter selections?')) return;
        selections = {};
        saveSelections();
        renderRoute(data.routes[currentIndex]);
        buildProgressStrip();
        updateCounter();
    }

    window.resetEncounters = resetAll;

    // ── Export ────────────────────────────────────────────────────────────────

    function exportSelections() {
        var lines = [];
        for (var i = 0; i < data.routes.length; i++) {
            var route = data.routes[i];
            if (selections[route]) {
                lines.push(route + ': ' + selections[route]);
            }
        }
        var text = lines.join('\n');
        var blob = new Blob([text], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'encounter-tracker.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    window.exportEncounters = exportSelections;

    // ── Import ────────────────────────────────────────────────────────────────

    function importSelections(text) {
        var newSelections = {};
        var lines = text.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (!line) continue;
            var sep = line.indexOf(': ');
            if (sep === -1) continue;
            var route = line.slice(0, sep).trim();
            var pokemon = line.slice(sep + 2).trim();
            if (pokemon) newSelections[route] = pokemon;
        }
        selections = newSelections;
        saveSelections();
        renderRoute(data.routes[currentIndex]);
        buildProgressStrip();
        updateCounter();
    }

    function handleImportFile(input) {
        var file = input.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (e) {
            importSelections(e.target.result);
            input.value = '';
        };
        reader.readAsText(file);
    }

    window.handleImportFile = handleImportFile;

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
