import { APP_CONFIG } from './config';
import { prisma } from './prisma';

export async function getCurrentUserId() {
  if (APP_CONFIG.testMode) {
    await prisma.user.upsert({
      where: { id: APP_CONFIG.demoUserId },
      create: { id: APP_CONFIG.demoUserId, creditsBalance: 999999 },
      update: {
        creditsBalance: {
          set: 999999,
        },
      },
    });
    return APP_CONFIG.demoUserId;
  }
  throw new Error('Auth is not configured yet. Disable PUBLIC_TEST_MODE only after auth integration.');
}
