// ===== NAV ACTIVE LINK =====
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== FILTER PROJECTS =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.style.display = show ? 'block' : 'none';
    });
  });
});

// ===== AI ACCROCHE =====
async function generateAccroche() {
  const btn = document.getElementById('ai-btn');
  const box = document.getElementById('ai-response');
  btn.disabled = true;
  btn.textContent = '⏳ Génération en cours…';
  box.style.display = 'block';
  box.className = 'ai-loading';
  box.textContent = "L'IA rédige votre accroche…";

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Tu es un expert en personal branding. Rédige une phrase d'accroche percutante (3-4 lignes max) pour un portfolio d'Ingénieur Numérique & Pédagogique basé à Paris, spécialisé en game design, développement web, et création de contenus e-learning. L'accroche doit être professionnelle, dynamique, et donner envie de collaborer. Réponds directement sans introduction.`
        }]
      })
    });
    const data = await res.json();
    const text = data.content?.[0]?.text || 'Erreur de génération.';
    box.className = '';
    box.textContent = text;
    btn.textContent = '🔄 Regénérer';
    btn.disabled = false;
  } catch (err) {
    box.textContent = 'Erreur réseau. Vérifiez votre connexion.';
    btn.textContent = '✨ Réessayer';
    btn.disabled = false;
  }
}
