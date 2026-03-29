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
    const nomePerfil = localStorage.getItem('activeProfileName') || localStorage.getItem('perfilAtivoNome');
    const imagemPerfil = localStorage.getItem('activeProfileImage') || localStorage.getItem('perfilAtivoImagem');

    if (nomePerfil && imagemPerfil) {
        const kidsLink = document.querySelector('.kids-link');
        const profileIcon = document.querySelector('.profile-icon');

        if (kidsLink) kidsLink.textContent = nomePerfil;
        if (profileIcon) profileIcon.src = imagemPerfil;
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
