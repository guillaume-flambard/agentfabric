import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  // This will be handled by +page.server.ts
  await parent();
  return {};
};
