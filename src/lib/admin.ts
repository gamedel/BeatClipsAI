import { headers } from 'next/headers';

export function assertAdminAccess(searchKey?: string) {
  const key = process.env.ADMIN_KEY;
  const headerKey = headers().get('x-admin-key');
  if (!key || (searchKey !== key && headerKey !== key)) {
    const err = new Error('NOT_FOUND');
    err.name = 'NOT_FOUND';
    throw err;
  }
}
