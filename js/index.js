/* Alterna entre temas claro e escuro e persiste preferência no localStorage */
const toggle = document.getElementById('theme-toggle');

// Elemento de logo
const logo = document.getElementById('logo');

function applyTheme(theme) {
	if (theme === 'light') document.documentElement.classList.add('light');
	else document.documentElement.classList.remove('light');
}

function currentTheme() {
	return document.documentElement.classList.contains('light') ? 'light' : 'dark';
}

// Inicializa a partir do localStorage ou preferência do sistema
const saved = localStorage.getItem('theme');
if (saved) applyTheme(saved);
else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) applyTheme('light');
// Atualiza logo conforme tema inicial
function updateLogo(theme) {
	const el = document.getElementById('logo');
	if (!el) return;
	// Conforme solicitado: logo branca no tema claro, preta no tema escuro
	if (theme === 'light') el.src = '/assets/Logo-NexStream-white.png';
	else el.src = '/assets/Logo-NexStream-black.png';
}
updateLogo(currentTheme());
// Atualiza atributos acessíveis do botão
function updateToggleA11y() {
	const isLight = currentTheme() === 'light';
	if (toggle) {
		toggle.setAttribute('aria-pressed', String(isLight));
		toggle.setAttribute('aria-label', isLight ? 'Tema claro. Clique para mudar para escuro' : 'Tema escuro. Clique para mudar para claro');
	}
}

updateToggleA11y();

const profileLinks = document.querySelectorAll('.profile');

function saveActiveProfile(name, imageUrl) {
	localStorage.setItem('activeProfileName', name);
	localStorage.setItem('activeProfileImage', imageUrl);
}

profileLinks.forEach(link => {
	link.addEventListener('click', event => {
		const figure = link.querySelector('figure');
		const name = figure?.querySelector('figcaption')?.textContent?.trim() || '';
		const image = figure?.querySelector('img')?.getAttribute('src') || '';
		if (name && image) saveActiveProfile(name, image);
		const href = link.getAttribute('href');
		if (!href || href === '#') {
			event.preventDefault();
			window.location.href = 'catalogo/catalogo.html';
		}
	});
});

toggle?.addEventListener('click', () => {
	const next = currentTheme() === 'light' ? 'dark' : 'light';
	applyTheme(next);
	localStorage.setItem('theme', next);
	updateToggleA11y();
	updateLogo(next);
});
