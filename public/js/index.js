/**
 * PuZero Global Scripts
 */

document.addEventListener('htmx:afterSwap', function(evt) {
    // Otomatis scroll ke atas saat konten utama berubah
    if (evt.detail.target.id === 'main-content') {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

// Tutup mobile menu saat navigasi terjadi
document.addEventListener('htmx:beforeRequest', function() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('mobile-icon');
    if (menu && menu.style.maxHeight !== '0px' && menu.style.maxHeight !== '') {
        menu.style.maxHeight = '0px';
        if (icon) {
            icon.classList.replace('ph-x', 'ph-list');
            icon.classList.remove('rotate-90');
        }
    }
});

// Handle Back-Forward Cache (BFCache)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.location.reload();
    }
});