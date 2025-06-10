const buttons = document.querySelectorAll('.categories button');
const items = document.querySelectorAll('.image-frame');

const categoriesNav = document.querySelector('.categories');
const gallery = document.getElementById('gallery');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        items.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

fetch('./imageData.json')
    .then(res => res.json())
    .then(imageData => {
        const sortedCats = Object.entries(imageData)
            .sort(([, filesA], [, filesB]) => filesB.length - filesA.length);

    const cats = ['all', ...sortedCats.map(([cat]) => cat)];
    categoriesNav.innerHTML = cats
        .map(c => `<button data-filter="${c}" class="${c==='all'?'active':''}">
                        ${c}${c!=='all'? ` - ${imageData[c].length}` : ''}
                    </button>`)
        .join('');

    for (const [category, files] of sortedCats) {
        const sortedFiles = [...files].sort((a, b) => {
            const na = parseInt(a.match(/\d+/)?.[0] || 0, 10);
            const nb = parseInt(b.match(/\d+/)?.[0] || 0, 10);
            return nb - na;
        });

        sortedFiles.forEach(filename => {
            const frame = document.createElement('div');
            frame.className = 'image-frame';
            frame.dataset.category = category;

            const img = document.createElement('img');
            img.loading = 'lazy';
            img.src = `./photo/${category}/${filename}`;
            img.alt = `${category}-${filename}`;

            frame.appendChild(img);
            gallery.appendChild(frame);
        });
    }

    categoriesNav.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            categoriesNav.querySelectorAll('button')
                .forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            document.querySelectorAll('.image-frame').forEach(item => {
            item.style.display =
                (filter === 'all' || item.dataset.category === filter)
                ? 'block' : 'none';
            });
        });
    });
})
.catch(err => console.error('Failed to load imageData.json', err));

(function() {
    const gallery = document.getElementById('gallery');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');

    gallery.addEventListener('click', e => {
        const imgEl = e.target.closest('.image-frame img');
        if (!imgEl) return;
        lightboxImg.src = imgEl.src;
        lightbox.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });
})();