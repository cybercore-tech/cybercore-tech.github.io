# Cybercore Tech Pages

The public Cybercore Tech organization landing surface for `cybercore-tech.github.io`.

This site is separate from the existing `cybercoretech.net` project. It presents the Cybercore Tech identity, five core repositories, the 81-theme CYBERGRID matrix, the Theme Studio entry point, and open-system acknowledgements.

The theme gallery reads its catalog and palette JSON from `data/`. Keep those
files aligned with `framework/cybercore/schema/themes/`; the gallery computes
its theme and family counts from `data/cybergrid.json`. Cybercore Theme Studio
supports custom themes, curated-family copies, and portable `.cyberpack.json`
imports and exports for local Cybercore applications.

## Shared contact block

`data/contact.json` is the single source of truth for Cybercore Tech contact details: email, security address, signal channels, support links and the copyright line. `kit/contact.js` renders it as a `<cybercore-contact>` element that any Cybercore page can use:

```html
<script type="module" src="https://cybercore-tech.github.io/kit/contact.js"></script>

<cybercore-contact></cybercore-contact>                     <!-- full block -->
<cybercore-contact variant="compact"></cybercore-contact>   <!-- one line -->
<cybercore-contact repo="argus"></cybercore-contact>        <!-- adds that repo's issues link -->
<cybercore-contact bare></cybercore-contact>                 <!-- no sign-off line, for pages with their own -->
```

- **Theme-aware:** it reads the page's CYBERGRID tokens (`--bg`, `--panel`, `--line`, `--muted`, `--white` or `--fg`, `--cyan`, `--pink`, `--acid`, `--orange`) and re-themes live when the page switches palettes.
- **One edit, every site:** change `contact.json` and every page picks it up (GitHub Pages caches for about 10 minutes). Cross-origin pages such as cybercoretech.net can load it too.
- **Fallback:** anything inside the tag shows only if the data can't load, so put a plain email link there.
- **Safe:** everything is built with `textContent`, and only `https:` and `mailto:` links are rendered.
