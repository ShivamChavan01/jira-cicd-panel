import React, { useEffect, useState } from 'react';
import { events, invoke } from '@forge/bridge';
import StatusBadge from './StatusBadge';

const STATUS_ICONS = {
  success: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" title="Success"><circle cx="12" cy="12" r="12" fill="#36B37E"/><path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  failed: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" title="Failed"><circle cx="12" cy="12" r="12" fill="#FF5630"/><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
  ),
  running: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" title="Running"><circle cx="12" cy="12" r="12" fill="#FFAB00"/><path d="M12 6v6l4 2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
  ),
  unknown: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" title="Unknown"><circle cx="12" cy="12" r="12" fill="#A5ADBA"/><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#fff">?</text></svg>
  ),
};

function useColorScheme() {
  const getScheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const [scheme, setScheme] = useState(getScheme());
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setScheme(mq.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return scheme;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}

const MONO_FONT = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

function App() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const colorScheme = useColorScheme();

  // Color palette for dark/light mode
  const colors = colorScheme === 'dark' ? {
    panelBg: '#23272F',
    panelBorder: '#2C333A',
    text: '#F4F5F7',
    subText: '#A5ADBA',
    link: '#4C9AFF',
    badgeBg: '#2C333A',
    buttonBg: '#0052CC',
    buttonHover: '#0747A6',
    buttonText: '#fff',
    copyBg: '#403294',
    copyText: '#fff',
  } : {
    panelBg: '#fff',
    panelBorder: '#F4F5F7',
    text: '#172B4D',
    subText: '#5E6C84',
    link: '#0052CC',
    badgeBg: '#F4F5F7',
    buttonBg: '#0052CC',
    buttonHover: '#0747A6',
    buttonText: '#fff',
    copyBg: '#EAE6FF',
    copyText: '#403294',
  };

  const fetchPipelineStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await invoke('fetchPipelineStatus');
      setStatus(data);
    } catch (err) {
      setError('Failed to fetch pipeline status');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPipelineStatus();
    const subscription = events.on('JIRA_ISSUE_CHANGED', fetchPipelineStatus);
    return () => {
      if (subscription && subscription.unsubscribe) subscription.unsubscribe();
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPipelineStatus();
  };

  const handleCopy = (sha) => {
    copyToClipboard(sha);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  if (loading) return (
    <div style={{ padding: 32, textAlign: 'center', fontFamily: MONO_FONT, color: colors.text, background: colors.panelBg, minHeight: 180 }}>
      <div style={{ display: 'inline-block', marginBottom: 8 }}>
        <svg width="32" height="32" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke={colors.buttonBg} strokeWidth="5" strokeDasharray="31.4 31.4" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
      <div style={{ color: colors.text, fontWeight: 500, fontSize: 16 }}>Fetching CI/CD pipeline status…</div>
    </div>
  );
  if (error) return <div style={{ color: 'red', padding: 16, fontFamily: MONO_FONT, background: colors.panelBg }}>{error}</div>;
  if (!status) return <div style={{ padding: 16, fontFamily: MONO_FONT, background: colors.panelBg, color: colors.text }}>No pipeline status found.</div>;

  const icon = STATUS_ICONS[status.status] || STATUS_ICONS.unknown;

  return (
    <div style={{ padding: 24, background: colors.panelBg, boxShadow: '0 2px 8px #091E4224', fontFamily: MONO_FONT, color: colors.text, border: `1px solid ${colors.panelBorder}` }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ marginRight: 14 }} title={status.status}>{icon}</span>
        <h3 style={{ margin: 0, flex: 1, color: colors.text, fontWeight: 700, fontSize: 18 }}>CI/CD Pipeline Status</h3>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          title="Refresh pipeline status"
          style={{ 
            background: colors.buttonBg, 
            color: colors.buttonText, 
            border: 'none', 
            borderRadius: 4, 
            padding: '6px 16px', 
            fontWeight: 600, 
            fontSize: 13, 
            cursor: 'pointer', 
            boxShadow: '0 1px 2px #091E4224',
            transition: 'background-color 0.2s ease',
          }}
          onMouseOver={e => e.currentTarget.style.background = colors.buttonHover}
          onMouseOut={e => e.currentTarget.style.background = colors.buttonBg}
        >
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        <StatusBadge status={status.status} />
        <span style={{ color: colors.text, fontWeight: 500, marginLeft: 10 }}>Branch: <span style={{ fontWeight: 400 }}>{status.branch}</span></span>
      </div>
      {status.workflowName && <div style={{ color: colors.subText, marginBottom: 4, fontWeight: 500 }}><b>Workflow:</b> {status.workflowName}</div>}
      {status.run_number && <div style={{ color: colors.subText, marginBottom: 4, fontWeight: 500 }}><b>Run #</b> {status.run_number}</div>}
      {status.job_count && <div style={{ color: colors.subText, marginBottom: 4, fontWeight: 500 }}><b>Jobs:</b> {status.job_count}</div>}
      {status.commit && (
        <div style={{ color: colors.subText, marginBottom: 4, fontWeight: 500, display: 'flex', alignItems: 'center' }}>
          <b>Commit:</b> <a href={status.commit.url} target="_blank" rel="noopener noreferrer" style={{ color: colors.link, textDecoration: 'underline', marginLeft: 4 }}>{status.commit.sha}</a>
          <button
            onClick={() => handleCopy(status.commit.sha)}
            style={{ marginLeft: 6, background: colors.copyBg, border: '1px solid #403294', borderRadius: 7, padding: '2px 7px', fontSize: 12, cursor: 'pointer', color: colors.copyText, fontWeight: 600 }}
            title="Copy SHA"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <span style={{ marginLeft: 8 }}>{status.commit.message}</span>
          <span style={{ color: colors.subText, marginLeft: 8 }}>by {status.commit.author}</span>
        </div>
      )}
      {status.lastRun && <div style={{ color: colors.subText, marginBottom: 4 }}><b>Last Run:</b> {status.lastRun}</div>}
      {status.duration && <div style={{ color: colors.subText, marginBottom: 4 }}><b>Duration:</b> {status.duration}</div>}
      {status.environment && <div style={{ color: colors.subText, marginBottom: 4 }}><b>Environment:</b> {status.environment}</div>}
      {status.url && <div style={{ marginBottom: 4 }}><a href={status.url} target="_blank" rel="noopener noreferrer" style={{ color: colors.link, fontWeight: 600 }}>View on GitHub</a></div>}
      {status.error && <div style={{ color: '#FFAB00', marginTop: 8 }}><b>Note:</b> {status.error}</div>}
      {/* Recent Runs Section */}
      {status.recentRuns && status.recentRuns.length > 1 ? (
        <div style={{ marginTop: 18 }}>
          <div style={{ color: colors.text, fontWeight: 600, marginBottom: 6, fontSize: 19 }}>Recent Runs</div>
          <div>
            {status.recentRuns.map((run, idx) => (
              <div key={run.id} style={{ display: 'flex', alignItems: 'center', padding: '6px 0', borderBottom: idx < status.recentRuns.length - 1 ? `1px solid ${colors.panelBorder}` : 'none' }}>
                <span style={{ marginRight: 8 }} title={run.status}>{STATUS_ICONS[run.status] || STATUS_ICONS.unknown}</span>
                <span style={{ color: colors.text, fontWeight: 500, minWidth: 70 }}>{run.workflowName || 'Workflow'}</span>
                {run.run_number && <span style={{ color: colors.subText, marginLeft: 8, fontSize: 13 }}>#{run.run_number}</span>}
                {run.job_count && <span style={{ color: colors.subText, marginLeft: 8, fontSize: 13 }}>{run.job_count} jobs</span>}
                <span style={{ color: colors.subText, marginLeft: 8, minWidth: 60 }}>{run.lastRun}</span>
                {run.commit && <a href={run.commit.url} target="_blank" rel="noopener noreferrer" style={{ color: colors.link, marginLeft: 8, fontSize: 13 }}>{run.commit.sha}</a>}
                <a href={run.url} target="_blank" rel="noopener noreferrer" style={{ color: colors.link, marginLeft: 8, fontSize: 13 }}>Details</a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 18, color: colors.subText, fontStyle: 'italic', textAlign: 'center' }}>No recent runs found.</div>
      )}
    </div>
  );
}

export default App; 