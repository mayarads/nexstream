import { categories } from './data.js';
import { createCarousel } from './components/Carousel.js';

function hashString(value) {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
    }
    return hash;
}

function seededShuffle(array, seed) {
    const result = array.slice();
    let currentSeed = seed;

    for (let i = result.length - 1; i > 0; i -= 1) {
        currentSeed = (currentSeed * 1664525 + 1013904223) >>> 0;
        const j = currentSeed % (i + 1);
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

function orderByProfile(categoriesList, profileName) {
    if (!profileName) return categoriesList;

    const categorySeed = hashString(profileName);
    const orderedCategories = seededShuffle(categoriesList, categorySeed);

    return orderedCategories.map(category => ({
        ...category,
        items: seededShuffle(category.items, categorySeed + hashString(category.title)),
    }));
}

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const queryName = params.get('name');
    const queryImage = params.get('image');

    if (queryName && queryImage) {
        localStorage.setItem('activeProfileName', queryName);
        localStorage.setItem('activeProfileImage', queryImage);
        history.replaceState({}, '', window.location.pathname);
    }

    const nomePerfil = queryName || localStorage.getItem('activeProfileName') || localStorage.getItem('perfilAtivoNome');
    const imagemPerfil = normalizeProfileImagePath(queryImage || localStorage.getItem('activeProfileImage') || localStorage.getItem('perfilAtivoImagem'));

    if (nomePerfil) {
        const kidsLink = document.querySelector('.kids-link');
        const profileIcon = document.querySelector('.profile-icon');

        if (kidsLink) kidsLink.textContent = nomePerfil;
        if (profileIcon) {
            if (imagemPerfil) profileIcon.src = imagemPerfil;
            profileIcon.alt = `${nomePerfil} avatar`;
        }
    }

    function normalizeProfileImagePath(value) {
        if (!value) return value;
        if (value.startsWith('./assets/') || value.startsWith('assets/')) {
            return new URL('../' + value.replace(/^\.\//, ''), window.location.href).href;
        }
        return value;
    }

    const container = document.getElementById('main-content');

    if (container) {
        const orderedCategories = orderByProfile(categories, nomePerfil);
        orderedCategories.forEach(category => {
            const carousel = createCarousel(category);
            container.appendChild(carousel);
        });
    }
});
