export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'sv-theme';

// Exécuté dans <head> avant le premier rendu pour éviter un flash du mauvais thème :
// choix enregistré, sinon préférence système, sinon sombre
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}})();`;

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // stockage indisponible (navigation privée) : le thème s'applique quand même pour la session
  }
}

// Notifie les abonnés quand data-theme change sur <html>
export function subscribeToTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}
