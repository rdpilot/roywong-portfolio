export function openPortfolioWindow(id: string) {
  window.dispatchEvent(new CustomEvent("portfolio:navigate", { detail: { id } }));
}
