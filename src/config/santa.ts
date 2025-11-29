export const SANTA_PASSWORD = 'christmas2025';

export function isSanta(): boolean {
  return localStorage.getItem('santa') === 'true';
}

export function promptSantaLogin(): void {
  const message = 
    "🎅 Santa Mode 🎅\n\n" +
    "Santa Mode gives you special permissions:\n" +
    "• View hidden gifts that others can't see\n" +
    "• Delete any person (including family members)\n" +
    "• Delete wishlist items\n\n" +
    "Enter Santa's secret passphrase:";
  
  const password = prompt(message);
  if (password === SANTA_PASSWORD) {
    localStorage.setItem('santa', 'true');
    // Dispatch custom event to notify components of Santa status change
    window.dispatchEvent(new Event('santaStatusChanged'));
  } else if (password !== null) {
    alert("Oops! Only Santa can access Santa Mode!");
  }
}

export function logoutSanta(): void {
  localStorage.removeItem('santa');
  // Dispatch custom event to notify components of Santa status change
  window.dispatchEvent(new Event('santaStatusChanged'));
}

