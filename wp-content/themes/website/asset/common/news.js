const tabs = document.querySelectorAll('.tab');
const newsItems = document.querySelectorAll('.news-item');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        const filter = tab.dataset.filter;

        newsItems.forEach(item => {
            const category = item.dataset.category;

            if (filter === 'all' || category === filter || category === 'all') {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
});