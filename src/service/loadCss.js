const cssCache = new Map();

export async function loadCss(shadowRoot, path) {
  if (!cssCache.has(path)) {
    const res = await fetch(path);
    cssCache.set(path, await res.text());
  }

  const style = document.createElement('style');
  style.textContent = cssCache.get(path);
  shadowRoot.appendChild(style);
}
