// Scroll to Section
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
    });
});

// Clock Updates
function updateClocks() {
    const cities = {
        'la-time': -8, // Los Angeles
        'chicago-time': -6, // Chicago
        'nyc-time': -5, // New York City
    };

    const now = new Date();
    Object.keys(cities).forEach(id => {
        const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
        const cityTime = new Date(utcTime.getTime() + cities[id] * 3600 * 1000);
        document.getElementById(id).innerText = cityTime.toLocaleTimeString();
    });
}

setInterval(updateClocks, 1000);

// Search FAQs
document.getElementById('faq-search').addEventListener('input', event => {
    const query = event.target.value.toLowerCase();
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question').innerText.toLowerCase();
        const answer = item.querySelector('.faq-answer').innerText.toLowerCase();
        if (question.includes(query) || answer.includes(query)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});
