/* index-sync.js
 * Pulls live content from publications.html, research.html, members.html
 * into the index page. Edit sub-pages — index updates automatically.
 */
(async function () {
  const parser = new DOMParser();

  async function fetchDoc(url) {
    const res = await fetch(url);
    const html = await res.text();
    return parser.parseFromString(html, 'text/html');
  }

  /* ── Publications ── */
  try {
    const doc = await fetchDoc('publications.html');

    const intl = [
      ...doc.querySelectorAll(
        '.pub-item[data-type="journal"], .pub-item[data-type="conference"], .pub-item[data-type="preprint"]'
      )
    ].slice(0, 2);

    const domestic = [
      ...doc.querySelectorAll(
        '.pub-item[data-type="domestic-journal"], .pub-item[data-type="domestic-conf"]'
      )
    ].slice(0, 3);

    const container = document.getElementById('index-pubs');
    if (container) {
      container.innerHTML = '';

      function makeLabel(text) {
        const d = document.createElement('div');
        d.className = 'index-pub-group-label';
        d.textContent = text;
        return d;
      }

      if (intl.length) {
        container.appendChild(makeLabel('International'));
        intl.forEach(item => {
          const clone = item.cloneNode(true);
          clone.classList.add('fade-in');
          container.appendChild(clone);
        });
      }

      if (domestic.length) {
        container.appendChild(makeLabel('국내'));
        domestic.forEach(item => {
          const clone = item.cloneNode(true);
          clone.classList.add('fade-in');
          container.appendChild(clone);
        });
      }
    }
  } catch (e) { console.warn('Publications sync failed', e); }

  /* ── Research ── */
  try {
    const doc = await fetchDoc('research.html');
    const grid = doc.querySelector('.research-grid');
    const container = document.getElementById('index-research');
    if (container && grid) {
      container.innerHTML = grid.innerHTML;
    }
  } catch (e) { console.warn('Research sync failed', e); }

  /* ── Members ── */
  try {
    const doc = await fetchDoc('members.html');
    const cards = [...doc.querySelectorAll('.member-card')];

    const names2nd = cards
      .filter(c => c.querySelector('.member-role')?.textContent.includes('2년차'))
      .map(c => c.querySelector('.member-name')?.textContent.trim())
      .filter(Boolean)
      .join(', ');

    const names1st = cards
      .filter(c => c.querySelector('.member-role')?.textContent.includes('1년차'))
      .map(c => c.querySelector('.member-name')?.textContent.trim())
      .filter(Boolean)
      .join(', ');

    const el2nd = document.getElementById('index-members-2nd');
    const el1st = document.getElementById('index-members-1st');
    if (el2nd && names2nd) el2nd.textContent = names2nd;
    if (el1st && names1st) el1st.textContent = names1st;
  } catch (e) { console.warn('Members sync failed', e); }
})();
