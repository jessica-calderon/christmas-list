export const ADMIN_PASSWORD = 'christmas2025';

export function isAdmin(): boolean {
  return localStorage.getItem('admin') === 'true';
}

export function promptAdminLogin(): void {
  const password = prompt('Enter admin password:');
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem('admin', 'true');
    // Dispatch custom event to notify components of admin status change
    window.dispatchEvent(new Event('adminStatusChanged'));
  } else if (password !== null) {
    alert('Incorrect password');
  }
}

export function logoutAdmin(): void {
  localStorage.removeItem('admin');
  // Dispatch custom event to notify components of admin status change
  window.dispatchEvent(new Event('adminStatusChanged'));
}

