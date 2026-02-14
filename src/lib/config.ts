export const APP_CONFIG = {
  testMode: process.env.PUBLIC_TEST_MODE === 'true',
  demoUserId: process.env.DEMO_USER_ID ?? 'demo-user',
  jobCostCredits: 25,
  rateLimitPerHour: 10,
  modelLabel: 'Studio (720p + sound)',
};
