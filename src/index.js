import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';
import { getPipelineStatus, getConfig, setConfig } from './resolvers';
const resolver = new Resolver();

resolver.define('fetchLabels', async (req) => {
  const key = req.context.extension.issue.key;

  const res = await api.asUser().requestJira(route`/rest/api/3/issue/${key}?fields=labels`);

  const data = await res.json();

  const label = data.fields.labels;
  if (label == undefined) {
    console.warn(`${key}: Failed to find labels`);
    return [];
  }

  return label;
});

resolver.define('fetchPipelineStatus', async (req) => {
  const issueKey = req.context.extension.issue.key;
  // Call the GitHub integration logic (to be implemented)
  return await getPipelineStatus(issueKey);
});

resolver.define('getConfig', async () => {
  return await getConfig();
});

resolver.define('setConfig', async ({ payload }) => {
  await setConfig(payload.config);
  return { ok: true };
});

export const handler = resolver.getDefinitions();
