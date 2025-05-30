// src/resolvers.js
// Placeholder for GitHub Actions integration and config storage

import api from '@forge/api';

// Hardcoded GitHub config for hackathon demo
const GITHUB_OWNER = 'ShivamChavan1'; //add your github owner here
const GITHUB_REPO = 'gcp-terraformAvpc'; //add your github repo here
const GITHUB_BRANCH = 'main'; //add your github branch here
const GITHUB_TOKEN = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; //add your github token here

// Fetch latest workflow runs for a branch from GitHub Actions
export async function getPipelineStatus(issueKey) {
  const owner = GITHUB_OWNER;
  const repo = GITHUB_REPO;
  const branch = GITHUB_BRANCH;
  const token = GITHUB_TOKEN;
  const url = `https://api.github.com/repos/${owner}/${repo}/actions/runs?branch=${branch}&per_page=3`;
  try {
    const response = await api.fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'forge-app',
      },
    });
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    const data = await response.json();
    const runs = data.workflow_runs || [];
    if (!runs.length) {
      return {
        status: 'unknown',
        branch,
        lastRun: null,
        environment: null,
        error: 'No workflow run found for this branch',
      };
    }
    // Prepare the latest run and up to 3 recent runs
    const recentRuns = runs.slice(0, 3).map(run => ({
      id: run.id,
      status: run.conclusion === 'success' ? 'success' : run.conclusion === 'failure' ? 'failed' : run.status === 'in_progress' ? 'running' : 'unknown',
      workflowName: run.name,
      lastRun: run.run_started_at ? new Date(run.run_started_at).toLocaleString() : null,
      duration: run.run_started_at && run.updated_at ? `${Math.round((new Date(run.updated_at) - new Date(run.run_started_at)) / 1000)}s` : null,
      url: run.html_url,
      commit: run.head_commit ? {
        sha: run.head_commit.id.substring(0, 7),
        message: run.head_commit.message.split('\n')[0],
        author: run.head_commit.author?.name,
        url: `https://github.com/${owner}/${repo}/commit/${run.head_commit.id}`,
      } : null,
      error: null,
    }));
    // Use the latest run for the main panel
    const latest = recentRuns[0];
    return {
      ...latest,
      branch,
      recentRuns,
    };
  } catch (e) {
    return {
      status: 'unknown',
      branch,
      lastRun: null,
      environment: null,
      error: e.message,
    };
  }
}
