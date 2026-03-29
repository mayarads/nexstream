const profileLinks = document.querySelectorAll('.profile');

function saveActiveProfile(name, imageUrl) {
	localStorage.setItem('activeProfileName', name);
	localStorage.setItem('activeProfileImage', imageUrl);
}

profileLinks.forEach(link => {
	link.addEventListener('click', event => {
		const figure = link.querySelector('figure');
		const name = figure?.querySelector('figcaption')?.textContent?.trim() || '';
		const image = figure?.querySelector('img')?.src || '';
		if (name && image) saveActiveProfile(name, image);
		const href = link.getAttribute('href');
		if (href && href !== '#') {
			event.preventDefault();
			const params = new URLSearchParams({
				name: name,
				image: image,
			});
			window.location.href = `${href}?${params.toString()}`;
		} else {
			event.preventDefault();
			window.location.href = 'catalogo/catalogo.html';
		}
	});
});

// Exemplo de como deve estar no JS:
