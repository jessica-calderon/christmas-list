export const ADMIN_PASSWORD = 'christmas2025';

export function isAdmin(): boolean {
  return localStorage.getItem('admin') === 'true';
}

export function promptAdminLogin(): void {
  const password = prompt('Enter admin password:');
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem('admin', 'true');
    window.location.reload();
  } else if (password !== null) {
    alert('Incorrect password');
  }
}

export function logoutAdmin(): void {
  localStorage.removeItem('admin');
  window.location.reload();
}

