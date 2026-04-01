// ---- Script & Data Loading Utilities ----

export function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

export async function loadScriptWithFallbacks(sources, isLoaded, libName) {
  if (isLoaded()) return;
  const failures = [];
  for (const src of sources) {
    try {
      await loadScript(src);
      if (isLoaded()) return;
      failures.push(`${src} (loaded, but "${libName}" was not found on window)`);
    } catch (err) {
      failures.push(`${src} (${err.message})`);
    }
  }
  throw new Error(`Failed to load ${libName} from all sources: ${failures.join(' | ')}`);
}

export async function fetchJsonWithFallbacks(urls) {
  const failures = [];
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      failures.push(`${url} (${err.message})`);
    }
  }
  throw new Error(`Failed to fetch map data from all sources: ${failures.join(' | ')}`);
}
