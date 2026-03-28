// Simple Encounter Tracker
// Manages tracking Pokémon encounters across routes with localStorage persistence

class EncounterTracker {
  constructor() {
    this.storageKey = 'encounter_progress';
    this.data = {};
    this.currentRoute = null;
    this.routes = [];
    this.currentRouteIndex = -1;
    this.pokemonCache = {}; // Cache pokemon data for each route
    this.init();
  }

  init() {
    this.loadData();
    this.routes = ENCOUNTER_DATA.getAllRoutes();
    this.setupUI();
    this.attachEventListeners();
  }

  loadData() {
    const saved = localStorage.getItem(this.storageKey);
    this.data = saved ? JSON.parse(saved) : {};
  }

  saveData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  setupUI() {
    // Populate route dropdown
    const routeSelect = document.getElementById('et-route');
    if (!routeSelect) return;

    this.routes.forEach(route => {
      const option = document.createElement('option');
      option.value = route;
      option.textContent = route;
      routeSelect.appendChild(option);
    });

    this.updateStats();
  }

  attachEventListeners() {
    const routeSelect = document.getElementById('et-route');
    const prevBtn = document.getElementById('et-prev');
    const nextBtn = document.getElementById('et-next');
    const resetBtn = document.getElementById('et-reset');

    if (routeSelect) {
      routeSelect.addEventListener('change', (e) => {
        this.selectRoute(e.target.value);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.navigateToPrevious());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.navigateToNext());
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.reset());
    }

    // Delegate checkbox changes
    document.getElementById('et-list')?.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox') {
        this.handlePokemonChange(e.target);
      }
    });
  }

  selectRoute(routeName) {
    if (!routeName) {
      this.currentRoute = null;
      this.currentRouteIndex = -1;
      document.getElementById('et-list').innerHTML = '';
      this.updateStats();
      return;
    }

    this.currentRoute = routeName;
    this.currentRouteIndex = this.routes.indexOf(routeName);
    
    // Ensure data object exists for this route
    if (!this.data[routeName]) {
      this.data[routeName] = [];
    }

    this.renderPokemonList();
    this.updateStats();
  }

  navigateToPrevious() {
    if (this.currentRouteIndex > 0) {
      const prevIndex = this.currentRouteIndex - 1;
      const routeName = this.routes[prevIndex];
      document.getElementById('et-route').value = routeName;
      this.selectRoute(routeName);
    }
  }

  navigateToNext() {
    if (this.currentRouteIndex < this.routes.length - 1) {
      const nextIndex = this.currentRouteIndex + 1;
      const routeName = this.routes[nextIndex];
      document.getElementById('et-route').value = routeName;
      this.selectRoute(routeName);
    }
  }

  renderPokemonList() {
    const container = document.getElementById('et-list');
    if (!container || !this.currentRoute) {
      container.innerHTML = '';
      return;
    }

    // Use cached data if available
    if (!this.pokemonCache[this.currentRoute]) {
      this.pokemonCache[this.currentRoute] = ENCOUNTER_DATA.getPokemonByRoute(this.currentRoute);
    }

    const pokemon = this.pokemonCache[this.currentRoute];
    
    if (!pokemon || pokemon.length === 0) {
      container.innerHTML = '<p style="opacity: 0.6; text-align: center; padding: 1rem;">No Pokémon available for this route.</p>';
      return;
    }

    const encountered = this.data[this.currentRoute] || [];
    
    // Build HTML efficiently as one string
    let html = '';
    pokemon.forEach((poke, idx) => {
      const checked = encountered.includes(poke.name) ? 'checked' : '';
      const checkboxId = `ch_${this.currentRoute}_${idx}`;
      
      html += `<div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; border-radius: 3px; margin-bottom: 0.3rem; background: rgba(255,255,255,0.02);"><input type="checkbox" id="${checkboxId}" ${checked} data-pokemon="${poke.name}" /><label for="${checkboxId}" style="flex: 1; cursor: pointer; margin: 0;">${poke.name}</label><span style="font-size: 0.75rem; opacity: 0.7; background: rgba(74,158,255,0.15); padding: 0.2rem 0.4rem; border-radius: 2px;">${poke.level}</span><span style="font-size: 0.75rem; opacity: 0.7; background: rgba(255,152,0,0.15); padding: 0.2rem 0.4rem; border-radius: 2px;">${poke.odds}</span></div>`;
    });

    container.innerHTML = html;
  }

  handlePokemonChange(checkbox) {
    const pokemonName = checkbox.getAttribute('data-pokemon');
    
    if (!this.data[this.currentRoute]) {
      this.data[this.currentRoute] = [];
    }

    if (checkbox.checked) {
      if (!this.data[this.currentRoute].includes(pokemonName)) {
        this.data[this.currentRoute].push(pokemonName);
      }
    } else {
      this.data[this.currentRoute] = this.data[this.currentRoute].filter(p => p !== pokemonName);
    }

    this.saveData();
    this.updateStats();
  }

  updateStats() {
    let totalFound = 0;
    let totalPokemon = this.routes.length; // One Pokémon per route

    this.routes.forEach(route => {
      const pokemon = this.pokemonCache[route] || ENCOUNTER_DATA.getPokemonByRoute(route);
      if (!this.pokemonCache[route]) {
        this.pokemonCache[route] = pokemon;
      }
      
      if (this.data[route] && this.data[route].length > 0) {
        totalFound += 1; // Count the route as completed if any Pokémon caught
      }
    });

    const routesVisited = Object.keys(this.data).filter(r => this.data[r].length > 0).length;
    const percent = totalPokemon > 0 ? Math.round((totalFound / totalPokemon) * 100) : 0;

    // Update stats with batch DOM access
    const foundEl = document.getElementById('et-found');
    const routesEl = document.getElementById('et-routes');
    const percentEl = document.getElementById('et-percent');

    if (foundEl) foundEl.textContent = `${totalFound} / ${totalPokemon}`;
    if (routesEl) routesEl.textContent = `${routesVisited} / ${this.routes.length}`;
    if (percentEl) percentEl.textContent = `${percent}%`;
  }

  reset() {
    if (confirm('Reset all progress?')) {
      this.data = {};
      this.saveData();
      this.currentRoute = null;
      this.currentRouteIndex = -1;
      document.getElementById('et-route').value = '';
      document.getElementById('et-list').innerHTML = '';
      this.updateStats();
    }
  }
}
