export const SANTA_PASSWORD = 'christmas2025';

export function isSanta(): boolean {
  return localStorage.getItem('santa') === 'true';
}

export function promptSantaLogin(): void {
  const password = prompt("Enter Santa's secret passphrase:");
  if (password === SANTA_PASSWORD) {
    localStorage.setItem('santa', 'true');
    // Dispatch custom event to notify components of Santa status change
    window.dispatchEvent(new Event('santaStatusChanged'));
  } else if (password !== null) {
    alert("Oops! Only Santa can peek at hidden gifts!");
  }
}

export function logoutSanta(): void {
  localStorage.removeItem('santa');
  // Dispatch custom event to notify components of Santa status change
  window.dispatchEvent(new Event('santaStatusChanged'));
}

