// <cybercore-contact>: the shared Cybercore Tech contact block.
//
// One source of truth: ../data/contact.json (next to this script on the org
// site). Every Cybercore page loads the same file, so changing an address or
// a link there updates every site at once.
//
// Theme-aware: the shadow styles read the host page's CYBERGRID tokens
// (--bg, --panel, --line, --muted, --white or --fg, --cyan, --pink, --acid,
// --orange, --purple). Custom properties inherit into shadow DOM, so the
// block re-themes live whenever the page swaps palettes.
//
// Usage:
//   <script type="module" src="https://cybercore-tech.github.io/kit/contact.js"></script>
//   <cybercore-contact></cybercore-contact>                    full footer block
//   <cybercore-contact variant="compact"></cybercore-contact>  one-line strip
//   <cybercore-contact repo="argus"></cybercore-contact>       adds that repo's issue link
//
// Anything inside the tag is the no-JS / offline fallback and is shown only
// if the data can't be loaded, e.g.
//   <cybercore-contact><a href="mailto:dev@cybercoretech.net">dev@cybercoretech.net</a></cybercore-contact>

const DATA_URL = new URL('../data/contact.json', import.meta.url).href;
let dataPromise;

function loadData(src) {
  if (src) return fetch(src).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));
  dataPromise ??= fetch(DATA_URL).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));
  return dataPromise;
}

// Only https: and mailto: links ever make it into the page.
function safeUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'mailto:' ? u.href : null;
  } catch {
    return null;
  }
}

function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v);
  }
  node.append(...children.filter(Boolean));
  return node;
}

function link(url, ...children) {
  const href = safeUrl(url);
  if (!href) return null;
  const external = href.startsWith('https:');
  return el('a', { href, target: external ? '_blank' : null, rel: external ? 'noopener noreferrer' : null }, ...children);
}

function mailLink(address) {
  const a = link(`mailto:${address}`);
  if (!a) return null;
  a.className = 'mail';
  a.textContent = address;
  return a;
}

const STYLE = `
  :host {
    --cc-bg: var(--panel, #16151f);
    --cc-fg: var(--white, var(--fg, #f0f0f2));
    --cc-line: var(--line, #32303e);
    --cc-muted: var(--muted, #807f8b);
    --cc-mono: var(--mono, var(--font-mono, 'Share Tech Mono', ui-monospace, monospace));
    --cc-display: var(--display, var(--font-display, var(--cc-mono)));
    display: block;
    color: var(--cc-fg);
    font: 12px/1.5 var(--cc-mono);
  }
  :host([hidden]) { display: none; }
  * { box-sizing: border-box; }
  a { color: inherit; text-decoration: none; }
  a:focus-visible { outline: 1px solid var(--cyan, #00e5ff); outline-offset: 3px; }

  .grid { display: grid; grid-template-columns: 1.15fr 1fr 1fr; }
  .col { padding: 4px 26px 6px; border-left: 1px solid var(--col, var(--cc-line)); }
  .col:first-child { padding-left: 0; border-left: 0; }
  .label { display: block; margin-bottom: 14px; color: var(--col); font: 700 10px var(--cc-mono); letter-spacing: .16em; text-transform: uppercase; }
  .c-contact { --col: var(--cyan, #00e5ff); }
  .c-channels { --col: var(--pink, #ff147f); }
  .c-support { --col: var(--acid, #39ff33); }

  .mail { display: inline-block; color: var(--cc-fg); font: 15px var(--cc-mono); letter-spacing: .02em; transition: color .2s, text-shadow .2s; }
  .mail:hover { color: var(--cyan, #00e5ff); text-shadow: 0 0 14px color-mix(in srgb, var(--cyan, #00e5ff) 60%, transparent); }
  small, .note { display: block; margin-top: 6px; color: var(--cc-muted); font-size: 9px; letter-spacing: .12em; text-transform: uppercase; }
  .sec { margin-top: 18px; }
  .sec .mail { font-size: 13px; }
  .sec .mail:hover { color: var(--orange, #ff9000); text-shadow: 0 0 14px color-mix(in srgb, var(--orange, #ff9000) 60%, transparent); }
  .sec .tag { color: var(--orange, #ff9000); }

  ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 8px; }
  .chan { display: flex; align-items: center; gap: 10px; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; transition: transform .2s, color .2s; }
  .chan:hover { color: var(--col); transform: translateX(4px); }
  .glyph { display: grid; place-items: center; flex: none; width: 26px; height: 26px; border: 1px solid color-mix(in srgb, var(--col) 55%, transparent); border-radius: 50%; color: var(--col); background: color-mix(in srgb, var(--col) 10%, transparent); font: 700 9px var(--cc-mono); letter-spacing: 0; }
  .handle { color: var(--cc-muted); font-size: 9px; }
  .arrow { color: var(--col); }

  .coffee { display: inline-flex; align-items: center; gap: 10px; padding: 10px 14px 10px 10px; border: 1px solid var(--acid, #39ff33); color: var(--acid, #39ff33); background: color-mix(in srgb, var(--acid, #39ff33) 8%, transparent); font: 700 11px var(--cc-mono); letter-spacing: .1em; text-transform: uppercase; transition: transform .2s, box-shadow .2s, background .2s; }
  .coffee:hover { transform: translateY(-2px); background: color-mix(in srgb, var(--acid, #39ff33) 16%, transparent); box-shadow: 0 0 22px color-mix(in srgb, var(--acid, #39ff33) 30%, transparent); }
  .coffee .glyph { --col: var(--acid, #39ff33); }
  .legal { margin-top: 18px; color: var(--cc-muted); font-size: 10px; letter-spacing: .06em; }
  .legal a { color: var(--acid, #39ff33); }
  .legal a:hover { text-decoration: underline; }

  .foot { display: flex; justify-content: space-between; gap: 18px; flex-wrap: wrap; margin-top: 26px; padding-top: 16px; border-top: 1px solid var(--cc-line); color: var(--cc-muted); font-size: 9px; letter-spacing: .12em; text-transform: uppercase; }
  .foot a:hover { color: var(--cyan, #00e5ff); }

  /* compact: one line for project pages */
  .strip { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 18px; font-size: 10px; letter-spacing: .1em; text-transform: uppercase; }
  .strip .mail { font-size: 11px; text-transform: none; letter-spacing: .03em; }
  .strip .sep { color: var(--cc-line); }
  .strip a.s { color: var(--cc-muted); transition: color .2s; }
  .strip a.s:hover { color: var(--pink, #ff147f); }
  .strip a.s.coffee-s { color: var(--acid, #39ff33); }
  .strip a.s.sec-s:hover { color: var(--orange, #ff9000); }

  @media (max-width: 760px) {
    .grid { grid-template-columns: 1fr; gap: 24px; }
    .col, .col:first-child { padding: 0 0 0 14px; border-left: 1px solid var(--col); }
  }
  @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;

class CybercoreContact extends HTMLElement {
  static observedAttributes = ['variant', 'repo', 'src'];

  connectedCallback() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this.render();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) this.render();
  }

  async render() {
    const root = this.shadowRoot;
    let data;
    try {
      data = await loadData(this.getAttribute('src'));
    } catch {
      // No data: show the page's own fallback content (the light DOM).
      root.replaceChildren(el('slot'));
      return;
    }
    const body = this.getAttribute('variant') === 'compact' ? this.compact(data) : this.full(data);
    root.replaceChildren(el('style', { text: STYLE }), body);
  }

  repoIssues() {
    const repo = this.getAttribute('repo');
    return repo && /^[A-Za-z0-9._-]+$/.test(repo) ? `https://github.com/cybercore-tech/${repo}/issues` : null;
  }

  full(d) {
    const { contact, security } = d.email;
    const channels = [...d.channels];
    const issues = this.repoIssues();
    if (issues) channels.push({ glyph: '!?', label: 'Issues', handle: this.getAttribute('repo'), url: issues });

    const contactCol = el('div', { class: 'col c-contact' },
      el('span', { class: 'label', text: contact.label }), mailLink(contact.address), el('small', { text: contact.note }));
    if (security) {
      contactCol.append(el('div', { class: 'sec' },
        el('small', { class: 'tag', text: security.label }), mailLink(security.address), el('small', { text: security.note })));
    }

    const list = el('ul');
    for (const c of channels) {
      const a = link(c.url, el('span', { class: 'glyph', text: c.glyph, 'aria-hidden': 'true' }),
        el('span', { text: c.label }), el('span', { class: 'handle', text: c.handle ? `/ ${c.handle}` : '' }), el('span', { class: 'arrow', text: '↗', 'aria-hidden': 'true' }));
      if (a) { a.className = 'chan'; list.append(el('li', {}, a)); }
    }
    const channelsCol = el('div', { class: 'col c-channels' }, el('span', { class: 'label', text: 'Signal channels' }), list);

    const supportCol = el('div', { class: 'col c-support' }, el('span', { class: 'label', text: 'Support the work' }));
    for (const s of d.support || []) {
      const a = link(s.url, el('span', { class: 'glyph', text: s.glyph, 'aria-hidden': 'true' }), el('span', { text: `${s.label} ↗` }));
      if (a) { a.className = 'coffee'; supportCol.append(a); }
    }
    const lic = link(d.brand.site); if (lic) lic.textContent = d.brand.site.replace(/^https:\/\/|\/$/g, '');
    supportCol.append(el('p', { class: 'legal' }, document.createTextNode(`${d.legal.license} licensed · `), lic));

    const site = link(d.brand.site); if (site) site.textContent = d.brand.signoff;
    const foot = el('div', { class: 'foot' }, site || el('span', { text: d.brand.signoff }), el('span', { text: `${d.legal.copyright} · ${d.legal.notice}` }));

    return el('nav', { 'aria-label': `${d.brand.name} contact` }, el('div', { class: 'grid' }, contactCol, channelsCol, supportCol), foot);
  }

  compact(d) {
    const { contact, security } = d.email;
    const strip = el('nav', { class: 'strip', 'aria-label': `${d.brand.name} contact` }, mailLink(contact.address));
    const add = (url, text, cls = '') => {
      const a = link(url); if (!a) return;
      a.className = `s ${cls}`.trim(); a.textContent = text;
      strip.append(el('span', { class: 'sep', text: '/', 'aria-hidden': 'true' }), a);
    };
    for (const c of d.channels) add(c.url, c.label);
    const issues = this.repoIssues(); if (issues) add(issues, 'Issues');
    if (security) add(`mailto:${security.address}`, 'Security', 'sec-s');
    for (const s of d.support || []) add(s.url, `${s.label} ↗`, 'coffee-s');
    return strip;
  }
}

if (!customElements.get('cybercore-contact')) customElements.define('cybercore-contact', CybercoreContact);
