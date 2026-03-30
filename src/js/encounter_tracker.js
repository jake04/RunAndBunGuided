(function () {
    'use strict';

    var STORAGE_KEY = 'encounterSelections';
    var TRAINER_DEFEATS_KEY = 'trainerDefeats';
    var ITEM_COLLECTED_KEY = 'itemCollected';
    var ITEM_USED_KEY = 'itemUsed';
    var ITEM_USED_ON_KEY = 'itemUsedOn';
    var CATEGORY_ORDER = ['Land', 'Fish', 'Surf', 'Rocks', 'Other'];
    var CATEGORY_COLORS = {
        Land:  '#4a7c4e',
        Fish:  '#5b9bd5',
        Surf:  '#2e75b6',
        Rocks: '#7a7a7a',
        Other: '#a07830',
    };
    var ITEM_CATEGORY_COLORS = {
        'Heart Scales':        '#c0392b',
        'Rare Candies':        '#8e44ad',
        'TMs':                 '#2980b9',
        'Passive Held Items':  '#16a085',
        'Consumable Held Items': '#d35400',
        'Mega Stones':         '#c0a020',
        'Evolution Items':     '#27ae60',
        'Berries':             '#e84393',
        'Move Tutors':         '#7f8c8d',
    };

    var data = window.ENCOUNTER_DATA;   // { routes: [...], encounters: {...} }
    var trainerData = window.TRAINER_DATA || null; // { splits, trainersByRoute, routeToSplit }
    var itemData = window.ITEM_DATA || null;        // { categories, itemsByRoute }
    var currentIndex = 0;
    var currentSplitIndex = 0;
    var selections = {};                // { "Route Name": "PokemonName" }
    var trainerDefeats = {};            // { "Route|TrainerName": true }
    var itemCollected = {};             // { itemKey: true }
    var itemUsed = {};                  // { itemKey: true }
    var itemUsedOn = {};                // { itemKey: "Pokemon name" } (Heart Scales/Rare Candies)

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

    function loadDefeats() {
        try {
            var raw = localStorage.getItem(TRAINER_DEFEATS_KEY);
            trainerDefeats = raw ? JSON.parse(raw) : {};
        } catch (e) {
            trainerDefeats = {};
        }
    }

    function saveDefeats() {
        localStorage.setItem(TRAINER_DEFEATS_KEY, JSON.stringify(trainerDefeats));
    }

    function loadItemState() {
        try {
            var rc = localStorage.getItem(ITEM_COLLECTED_KEY);
            itemCollected = rc ? JSON.parse(rc) : {};
        } catch (e) { itemCollected = {}; }
        try {
            var ru = localStorage.getItem(ITEM_USED_KEY);
            itemUsed = ru ? JSON.parse(ru) : {};
        } catch (e) { itemUsed = {}; }
        try {
            var ro = localStorage.getItem(ITEM_USED_ON_KEY);
            itemUsedOn = ro ? JSON.parse(ro) : {};
        } catch (e) { itemUsedOn = {}; }
    }

    function saveItemCollected() {
        localStorage.setItem(ITEM_COLLECTED_KEY, JSON.stringify(itemCollected));
    }

    function saveItemUsed() {
        localStorage.setItem(ITEM_USED_KEY, JSON.stringify(itemUsed));
    }

    function saveItemUsedOn() {
        localStorage.setItem(ITEM_USED_ON_KEY, JSON.stringify(itemUsedOn));
    }

    function trainerDefeatKey(routeName, trainerName) {
        return routeName + '|' + trainerName;
    }

    // ── Tab switcher ──────────────────────────────────────────────────────────

    function switchRightTab(tab) {
        var trainerSection = document.getElementById('right-panel-trainers');
        var itemsSection   = document.getElementById('right-panel-items');
        var trainerTab = document.getElementById('tab-trainers');
        var itemsTab   = document.getElementById('tab-items');
        if (!trainerSection || !itemsSection) return;
        if (tab === 'trainers') {
            trainerSection.style.display = '';
            itemsSection.style.display   = 'none';
            if (trainerTab)  trainerTab.classList.add('active');
            if (itemsTab)    itemsTab.classList.remove('active');
        } else {
            trainerSection.style.display = 'none';
            itemsSection.style.display   = '';
            if (trainerTab)  trainerTab.classList.remove('active');
            if (itemsTab)    itemsTab.classList.add('active');
            renderItemsPanel();
        }
    }

    window.switchRightTab = switchRightTab;

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

    // Returns the name of any other route where the given pokemon was already
    // selected, or null if it has not been caught anywhere else.
    function getPreviousCatchRoute(pokemonName, currentRouteName) {
        for (var i = 0; i < data.routes.length; i++) {
            var route = data.routes[i];
            if (route !== currentRouteName && selections[route] === pokemonName) {
                return route;
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

        // Append route-specific items below encounter pills
        renderRouteItems(routeName, content);

        updateProgressStrip();
        updateCounter();
    }

    // ── Route items ───────────────────────────────────────────────────────────

    function renderRouteItems(routeName, container) {
        if (!itemData) return;
        var routeItems = itemData.itemsByRoute[routeName];
        if (!routeItems || routeItems.length === 0) return;

        var section = document.createElement('div');
        section.className = 'route-items-section';

        var header = document.createElement('div');
        header.className = 'route-items-header';
        header.textContent = 'Available Items';
        section.appendChild(header);

        var list = document.createElement('div');
        list.className = 'route-items-list';

        for (var i = 0; i < routeItems.length; i++) {
            (function (ri) {
                var isCollected = !!itemCollected[ri.key];
                var color = ITEM_CATEGORY_COLORS[ri.category] || '#555';

                var row = document.createElement('div');
                row.className = 'route-item-row' + (isCollected ? ' item-collected' : '');

                var tag = document.createElement('span');
                tag.className = 'route-item-tag';
                tag.style.backgroundColor = color;
                tag.textContent = ri.category;

                var nameSpan = document.createElement('span');
                nameSpan.className = 'route-item-name';
                nameSpan.textContent = ri.name;

                var descSpan = document.createElement('span');
                descSpan.className = 'route-item-desc';
                var displayDesc = ri.description || ri.location || '';
                descSpan.textContent = displayDesc;
                descSpan.title = displayDesc;

                var btn = document.createElement('button');
                btn.className = 'route-item-collect-btn' + (isCollected ? ' collected' : '');
                btn.textContent = isCollected ? '✓' : '○';
                btn.title = isCollected ? 'Mark as not collected' : 'Mark as collected';
                btn.addEventListener('click', function (ev) {
                    ev.stopPropagation();
                    toggleItemCollected(ri.key);
                    renderRoute(routeName);
                });

                row.appendChild(tag);
                row.appendChild(nameSpan);
                row.appendChild(descSpan);
                row.appendChild(btn);
                list.appendChild(row);
            }(routeItems[i]));
        }

        section.appendChild(list);
        container.appendChild(section);
    }

    // ── Items panel ───────────────────────────────────────────────────────────

    function itemsCollectedCount() {
        var total = 0;
        var collected = 0;
        if (!itemData) return { collected: 0, total: 0 };
        for (var c = 0; c < itemData.categories.length; c++) {
            var cat = itemData.categories[c];
            for (var i = 0; i < cat.items.length; i++) {
                total++;
                if (itemCollected[cat.items[i].key]) collected++;
            }
        }
        return { collected: collected, total: total };
    }

    function updateItemsCounter() {
        var el = document.getElementById('items-collect-counter');
        if (!el || !itemData) return;
        var counts = itemsCollectedCount();
        el.textContent = counts.collected + ' / ' + counts.total + ' collected';
    }

    function renderItemsPanel() {
        if (!itemData) return;
        var container = document.getElementById('items-content');
        if (!container) return;
        container.innerHTML = '';
        updateItemsCounter();

        for (var c = 0; c < itemData.categories.length; c++) {
            var cat = itemData.categories[c];
            var color = ITEM_CATEGORY_COLORS[cat.name] || '#555';

            var catCollected = 0;
            for (var ii = 0; ii < cat.items.length; ii++) {
                if (itemCollected[cat.items[ii].key]) catCollected++;
            }

            var catSection = document.createElement('div');
            catSection.className = 'item-category-section';

            // Collapsible header
            var catHeader = document.createElement('div');
            catHeader.className = 'item-category-header';
            catHeader.style.backgroundColor = color;
            var catLabel = document.createElement('span');
            catLabel.textContent = cat.name;
            var catCount = document.createElement('span');
            catCount.className = 'item-category-count';
            catCount.textContent = catCollected + ' / ' + cat.items.length;
            var catArrow = document.createElement('span');
            catArrow.className = 'item-category-arrow';
            catArrow.textContent = '▾';
            catHeader.appendChild(catLabel);
            catHeader.appendChild(catCount);
            catHeader.appendChild(catArrow);

            var catBody = document.createElement('div');
            catBody.className = 'item-category-body';

            (function (body, arrow) {
                catHeader.addEventListener('click', function () {
                    var hidden = body.style.display === 'none';
                    body.style.display = hidden ? '' : 'none';
                    arrow.textContent = hidden ? '▾' : '▸';
                });
            }(catBody, catArrow));

            for (var i = 0; i < cat.items.length; i++) {
                catBody.appendChild(buildItemRow(cat, cat.items[i]));
            }

            catSection.appendChild(catHeader);
            catSection.appendChild(catBody);
            container.appendChild(catSection);
        }
    }

    function buildItemRow(cat, item) {
        var isCollected = !!itemCollected[item.key];
        var isUsed      = !!itemUsed[item.key];
        var usedOnVal   = itemUsedOn[item.key] || '';

        var row = document.createElement('div');
        row.className = 'item-row' + (isCollected ? ' item-collected' : '');

        var collectCheck = document.createElement('button');
        collectCheck.className = 'item-check-btn' + (isCollected ? ' checked' : '');
        collectCheck.textContent = isCollected ? '✓' : '○';
        collectCheck.title = isCollected ? 'Mark as not collected' : 'Mark as collected';
        collectCheck.addEventListener('click', function () {
            toggleItemCollected(item.key);
            renderItemsPanel();
        });

        var info = document.createElement('div');
        info.className = 'item-row-info';

        var nameLine = document.createElement('div');
        var nameSpan = document.createElement('span');
        nameSpan.className = 'item-row-name';
        nameSpan.textContent = item.name;
        nameLine.appendChild(nameSpan);

        var locationText = item.description || item.location || '';
        var locLine = document.createElement('div');
        locLine.className = 'item-row-location';
        locLine.textContent = locationText;

        info.appendChild(nameLine);
        info.appendChild(locLine);

        // Yield line for berries
        if (item.yield) {
            var yieldLine = document.createElement('div');
            yieldLine.className = 'item-row-yield';
            yieldLine.textContent = 'Yield: ' + item.yield;
            info.appendChild(yieldLine);
        }

        // "Used" checkbox for categories that track it
        var usedArea = null;
        if (cat.name === 'Heart Scales' || cat.name === 'Rare Candies' || cat.name === 'TMs' || cat.name === 'Consumable Held Items') {
            usedArea = document.createElement('div');
            usedArea.className = 'item-row-extras';

            var usedCheck = document.createElement('button');
            usedCheck.className = 'item-check-btn item-used-btn' + (isUsed ? ' checked' : '');
            usedCheck.textContent = isUsed ? '✓' : '○';
            usedCheck.title = isUsed ? 'Mark as not used' : 'Mark as used';
            usedCheck.addEventListener('click', function () {
                toggleItemUsed(item.key);
                renderItemsPanel();
            });

            var usedLabel = document.createElement('span');
            usedLabel.className = 'item-used-label';
            usedLabel.textContent = 'Used';
            usedArea.appendChild(usedLabel);
            usedArea.appendChild(usedCheck);

            // "Used On" text input for Heart Scales and Rare Candies
            if (cat.name === 'Heart Scales' || cat.name === 'Rare Candies') {
                var usedOnInput = document.createElement('input');
                usedOnInput.type = 'text';
                usedOnInput.className = 'item-used-on-input';
                usedOnInput.placeholder = 'Used on…';
                usedOnInput.value = usedOnVal;
                usedOnInput.addEventListener('change', function (ev) {
                    itemUsedOn[item.key] = ev.target.value.trim();
                    saveItemUsedOn();
                });
                usedArea.appendChild(usedOnInput);
            }
        }

        row.appendChild(collectCheck);
        row.appendChild(info);
        if (usedArea) row.appendChild(usedArea);
        return row;
    }

    // ── Item state toggles ────────────────────────────────────────────────────

    function toggleItemCollected(key) {
        if (itemCollected[key]) {
            delete itemCollected[key];
        } else {
            itemCollected[key] = true;
        }
        saveItemCollected();
        updateItemsCounter();
    }

    function toggleItemUsed(key) {
        if (itemUsed[key]) {
            delete itemUsed[key];
        } else {
            itemUsed[key] = true;
        }
        saveItemUsed();
    }

    function navigateSplit(delta) {
        if (!trainerData) return;
        var next = currentSplitIndex + delta;
        if (next < 0) next = trainerData.splits.length - 1;
        if (next >= trainerData.splits.length) next = 0;
        goToSplit(next);
    }

    function goToSplit(index) {
        currentSplitIndex = index;
        var sel = document.getElementById('split-select');
        if (sel) sel.value = String(index);
        renderSplit(trainerData.splits[index]);
    }

    window.navigateSplit = navigateSplit;

    // ── Setup Battle integration ───────────────────────────────────────────────

    function setupBattle(trainer) {
        var firstPoke = trainer.pokemon[0];
        if (!firstPoke || typeof $ === 'undefined') return;
        var setVal = firstPoke.name + ' (' + trainer.name + ')';
        var input = $('input.opposing');
        if (!input.length) return;
        input.val(setVal).change();
        $('.opposing .select2-chosen').text(setVal);
    }

    function buildSplitDropdown() {
        if (!trainerData) return;
        var sel = document.getElementById('split-select');
        if (!sel) return;
        sel.innerHTML = '';
        for (var i = 0; i < trainerData.splits.length; i++) {
            var opt = document.createElement('option');
            opt.value = String(i);
            opt.textContent = trainerData.splits[i];
            sel.appendChild(opt);
        }
        sel.addEventListener('change', function () {
            goToSplit(parseInt(this.value, 10));
        });
    }

    // ── Split renderer ────────────────────────────────────────────────────────

    // Build an ordered list of { route, trainers[] } for a given split,
    // preserving the CSV row order within each route.
    function getTrainersForSplit(splitName) {
        if (!trainerData) return [];
        var routeGroups = [];
        var routeMap = {};
        var allRoutes = Object.keys(trainerData.trainersByRoute);
        for (var r = 0; r < allRoutes.length; r++) {
            var route = allRoutes[r];
            var trainers = trainerData.trainersByRoute[route];
            for (var t = 0; t < trainers.length; t++) {
                if (trainers[t].split === splitName) {
                    if (!routeMap[route]) {
                        routeMap[route] = [];
                        routeGroups.push(route);
                    }
                    routeMap[route].push(trainers[t]);
                }
            }
        }
        return routeGroups.map(function (route) {
            return { route: route, trainers: routeMap[route] };
        });
    }

    function renderSplit(splitName) {
        var container = document.getElementById('trainer-content');
        if (!container) return;
        container.innerHTML = '';

        var groups = getTrainersForSplit(splitName);
        if (groups.length === 0) {
            var empty = document.createElement('p');
            empty.className = 'tracker-empty';
            empty.textContent = 'No trainers for this split.';
            container.appendChild(empty);
            updateSplitCounter(splitName, groups);
            return;
        }

        for (var g = 0; g < groups.length; g++) {
            var group = groups[g];
            var groupEl = document.createElement('div');
            groupEl.className = 'trainer-route-group';

            var label = document.createElement('div');
            label.className = 'trainer-route-label';
            label.textContent = group.route;
            groupEl.appendChild(label);

            for (var t = 0; t < group.trainers.length; t++) {
                groupEl.appendChild(buildTrainerCard(group.route, group.trainers[t]));
            }

            container.appendChild(groupEl);
        }

        updateSplitCounter(splitName, groups);
    }

    function updateSplitCounter(splitName, groups) {
        var el = document.getElementById('split-defeat-counter');
        if (!el) return;
        var total = 0;
        var defeated = 0;
        for (var g = 0; g < groups.length; g++) {
            for (var t = 0; t < groups[g].trainers.length; t++) {
                total++;
                var key = trainerDefeatKey(groups[g].route, groups[g].trainers[t].name);
                if (trainerDefeats[key]) defeated++;
            }
        }
        el.textContent = defeated + ' / ' + total + ' defeated';
    }

    // ── Trainer card builder ──────────────────────────────────────────────────

    function buildTrainerCard(routeName, trainer) {
        var key = trainerDefeatKey(routeName, trainer.name);
        var isDefeated = !!trainerDefeats[key];

        var card = document.createElement('div');
        card.className = 'trainer-card' + (trainer.isBoss ? ' boss' : '') + (isDefeated ? ' trainer-defeated' : '');

        // Header row
        var cardHeader = document.createElement('div');
        cardHeader.className = 'trainer-card-header';

        var nameArea = document.createElement('span');
        var nameSpan = document.createElement('span');
        nameSpan.className = 'trainer-name';
        nameSpan.textContent = trainer.name;
        nameArea.appendChild(nameSpan);
        if (trainer.isBoss) {
            var tag = document.createElement('span');
            tag.className = 'trainer-tag trainer-tag-boss';
            tag.textContent = 'BOSS';
            nameArea.appendChild(tag);
        }
        if (trainer.isOptional) {
            var tagOpt = document.createElement('span');
            tagOpt.className = 'trainer-tag trainer-tag-optional';
            tagOpt.textContent = 'Optional';
            nameArea.appendChild(tagOpt);
        }
        if (trainer.isDouble) {
            var tagDbl = document.createElement('span');
            tagDbl.className = 'trainer-tag trainer-tag-double';
            tagDbl.textContent = 'Double';
            nameArea.appendChild(tagDbl);
        }

        var setupBtn = document.createElement('button');
        setupBtn.className = 'trainer-setup-btn';
        setupBtn.textContent = 'Setup Battle';
        setupBtn.title = 'Load ' + (trainer.pokemon[0] ? trainer.pokemon[0].name : '') + ' into Pokémon 2';
        setupBtn.addEventListener('click', function (ev) {
            ev.stopPropagation();
            setupBattle(trainer);
        });

        var defeatBtn = document.createElement('button');
        defeatBtn.className = 'trainer-defeat-btn' + (isDefeated ? ' defeated' : '');
        defeatBtn.textContent = isDefeated ? '\u2714 Defeated' : 'Mark Defeated';
        defeatBtn.addEventListener('click', function (ev) {
            ev.stopPropagation();
            toggleTrainerDefeat(routeName, trainer.name);
        });

        cardHeader.appendChild(nameArea);
        var btnGroup = document.createElement('div');
        btnGroup.className = 'trainer-btn-group';
        btnGroup.appendChild(setupBtn);
        btnGroup.appendChild(defeatBtn);
        cardHeader.appendChild(btnGroup);
        card.appendChild(cardHeader);

        // Pokemon list
        var pokeList = document.createElement('div');
        pokeList.className = 'trainer-pokemon-list';

        for (var p = 0; p < trainer.pokemon.length; p++) {
            var poke = trainer.pokemon[p];
            var row = document.createElement('div');
            row.className = 'trainer-pokemon-row';

            var sprite = document.createElement('img');
            sprite.className = 'trainer-pok-sprite';
            sprite.src = getPokemonSpriteUrl(poke.name);
            sprite.alt = '';
            sprite.loading = 'lazy';
            sprite.onerror = function () { this.style.display = 'none'; };

            var info = document.createElement('div');
            info.className = 'trainer-pok-info';

            var nameLine = document.createElement('div');
            var pokName = document.createElement('span');
            pokName.className = 'trainer-pok-name';
            pokName.textContent = poke.name;
            var pokLvl = document.createElement('span');
            pokLvl.className = 'trainer-pok-level';
            pokLvl.textContent = 'Lv ' + poke.level;
            nameLine.appendChild(pokName);
            nameLine.appendChild(pokLvl);

            var detailLine = document.createElement('div');
            detailLine.className = 'trainer-pok-detail';
            var details = [];
            if (poke.item) details.push(poke.item);
            if (poke.ability) details.push(poke.ability);
            if (poke.nature) details.push(poke.nature);
            detailLine.textContent = details.join(' \u00b7 ');

            var movesLine = document.createElement('div');
            movesLine.className = 'trainer-pok-moves';
            movesLine.textContent = poke.moves.length > 0 ? poke.moves.join(', ') : '';

            info.appendChild(nameLine);
            info.appendChild(detailLine);
            if (poke.moves.length > 0) info.appendChild(movesLine);

            row.appendChild(sprite);
            row.appendChild(info);
            pokeList.appendChild(row);
        }

        card.appendChild(pokeList);
        return card;
    }

    function toggleTrainerDefeat(routeName, trainerName) {
        var key = trainerDefeatKey(routeName, trainerName);
        if (trainerDefeats[key]) {
            delete trainerDefeats[key];
        } else {
            trainerDefeats[key] = true;
        }
        saveDefeats();
        renderSplit(trainerData.splits[currentSplitIndex]);
    }

    // ── Selection toggle ──────────────────────────────────────────────────────

    // ── Reset all selections ───────────────────────────────────────────────

    function resetAll() {
        if (!confirm('Clear all encounter selections, trainer defeats, and item tracking?')) return;
        selections = {};
        trainerDefeats = {};
        itemCollected = {};
        itemUsed = {};
        itemUsedOn = {};
        saveSelections();
        saveDefeats();
        saveItemCollected();
        saveItemUsed();
        saveItemUsedOn();
        renderRoute(data.routes[currentIndex]);
        buildProgressStrip();
        updateCounter();
        if (trainerData) renderSplit(trainerData.splits[currentSplitIndex]);
        updateItemsCounter();
    }

    window.resetEncounters = resetAll;

    // ── Export ────────────────────────────────────────────────────────────────

    function exportSelections() {
        var lines = [];
        lines.push('--- Encounter Catches ---');
        var hasCatches = false;
        for (var i = 0; i < data.routes.length; i++) {
            var route = data.routes[i];
            if (selections[route]) {
                lines.push(route + ': ' + selections[route]);
                hasCatches = true;
            }
        }
        if (!hasCatches) lines.push('(none)');
        // Export trainer defeats
        lines.push('');
        lines.push('--- Trainer Defeats ---');
        var defeatKeys = Object.keys(trainerDefeats);
        if (defeatKeys.length > 0) {
            for (var d = 0; d < defeatKeys.length; d++) {
                lines.push('[defeated] ' + defeatKeys[d]);
            }
        } else {
            lines.push('(none)');
        }
        // Export item tracking
        lines.push('');
        lines.push('--- Item Tracking ---');
        var collectedKeys = Object.keys(itemCollected);
        var usedKeys = Object.keys(itemUsed);
        var usedOnKeys = Object.keys(itemUsedOn);
        var hasItemData = collectedKeys.length > 0 || usedKeys.length > 0 || usedOnKeys.length > 0;
        if (hasItemData) {
            for (var ic = 0; ic < collectedKeys.length; ic++) {
                lines.push('[item-collected] ' + collectedKeys[ic]);
            }
            for (var iu = 0; iu < usedKeys.length; iu++) {
                lines.push('[item-used] ' + usedKeys[iu]);
            }
            for (var io = 0; io < usedOnKeys.length; io++) {
                if (itemUsedOn[usedOnKeys[io]]) {
                    lines.push('[item-used-on] ' + usedOnKeys[io] + '|' + itemUsedOn[usedOnKeys[io]]);
                }
            }
        } else {
            lines.push('(none)');
        }
        var text = lines.join('\n');
        var blob = new Blob([text], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'run-and-bun-tracker.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    window.exportEncounters = exportSelections;

    // ── Import ────────────────────────────────────────────────────────────────

    function importSelections(text) {
        var newSelections = {};
        var newDefeats = {};
        var newCollected = {};
        var newUsed = {};
        var newUsedOn = {};
        var lines = text.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (!line) continue;
            if (line === '--- Trainer Defeats ---' || line === '--- Item Tracking ---' || line === '--- Encounter Catches ---') continue;
            if (line === '(none)') continue;
            if (line.indexOf('[defeated] ') === 0) {
                var defKey = line.slice('[defeated] '.length).trim();
                if (defKey) newDefeats[defKey] = true;
                continue;
            }
            if (line.indexOf('[item-collected] ') === 0) {
                var ick = line.slice('[item-collected] '.length).trim();
                if (ick) newCollected[ick] = true;
                continue;
            }
            if (line.indexOf('[item-used] ') === 0) {
                var iuk = line.slice('[item-used] '.length).trim();
                if (iuk) newUsed[iuk] = true;
                continue;
            }
            if (line.indexOf('[item-used-on] ') === 0) {
                var iuok = line.slice('[item-used-on] '.length).trim();
                var pipIdx = iuok.lastIndexOf('|');
                if (pipIdx !== -1) {
                    var iuokKey = iuok.slice(0, pipIdx).trim();
                    var iuokVal = iuok.slice(pipIdx + 1).trim();
                    if (iuokKey && iuokVal) newUsedOn[iuokKey] = iuokVal;
                }
                continue;
            }
            var sep = line.indexOf(': ');
            if (sep === -1) continue;
            var route = line.slice(0, sep).trim();
            var pokemon = line.slice(sep + 2).trim();
            if (pokemon) newSelections[route] = pokemon;
        }
        selections = newSelections;
        trainerDefeats = newDefeats;
        itemCollected = newCollected;
        itemUsed = newUsed;
        itemUsedOn = newUsedOn;
        saveSelections();
        saveDefeats();
        saveItemCollected();
        saveItemUsed();
        saveItemUsedOn();
        renderRoute(data.routes[currentIndex]);
        buildProgressStrip();
        updateCounter();
        updateItemsCounter();
        if (trainerData) renderSplit(trainerData.splits[currentSplitIndex]);
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
        loadDefeats();
        loadItemState();
        buildRouteDropdown();
        buildProgressStrip();
        updateCounter();
        updateItemsCounter();

        // Start on first route that has no selection, or route 0
        var startIdx = 0;
        for (var i = 0; i < data.routes.length; i++) {
            if (!selections[data.routes[i]]) {
                startIdx = i;
                break;
            }
        }
        goToRoute(startIdx);

        // Trainer split panel
        if (trainerData) {
            buildSplitDropdown();
            goToSplit(0);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

}());
