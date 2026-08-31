import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Spinner, Tab, Tabs } from '@openedx/paragon';
import { embedDashboard, EmbeddedDashboard } from '@superset-ui/embedded-sdk';
import { useIntl } from '@openedx/frontend-base';

import { fetchGuestToken, getReportsDashboardConfig, ReportsDashboardConfig, SupersetDashboard } from './data/api';
import messages from './messages';
import './style.scss';

interface DashboardTabProps {
  dashboard: SupersetDashboard;
  supersetUrl: string;
  guestTokenUrl: string;
  shouldEmbed: boolean;
}

const DashboardTab = ({
  dashboard, supersetUrl, guestTokenUrl, shouldEmbed,
}: DashboardTabProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const embeddedRef = useRef<EmbeddedDashboard | null>(null);

  useEffect(() => {
    if (shouldEmbed && !embeddedRef.current && containerRef.current) {
      embedDashboard({
        id: dashboard.uuid,
        supersetDomain: supersetUrl,
        mountPoint: containerRef.current,
        fetchGuestToken: () => fetchGuestToken(guestTokenUrl),
        iframeSandboxExtras: ['allow-popups-to-escape-sandbox'],
        dashboardUiConfig: {
          hideTitle: true,
          filters: {
            expanded: false,
          },
          hideTab: true,
          hideChartControls: false,
        },
      }).then((embedded) => {
        embeddedRef.current = embedded;
      });
    }

    return () => {
      if (embeddedRef.current && !shouldEmbed) {
        embeddedRef.current.unmount();
        embeddedRef.current = null;
      }
    };
  }, [shouldEmbed, dashboard.uuid, supersetUrl, guestTokenUrl]);

  return (
    <div
      ref={containerRef}
      className="superset-embedded-container mt-2"
      style={{ width: '100%', minHeight: '600px' }}
    />
  );
};

const ReportsDashboard = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [config, setConfig] = useState<ReportsDashboardConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState<string>('');
  const [embeddedKeys, setEmbeddedKeys] = useState<Set<string>>(new Set());
  const intl = useIntl();

  useEffect(() => {
    if (!courseId) {
      return;
    }
    getReportsDashboardConfig(courseId)
      .then((data) => {
        setConfig(data);
        if (data.superset_dashboards.length > 0) {
          const firstKey = data.superset_dashboards[0].uuid;
          setActiveKey(firstKey);
          setEmbeddedKeys(new Set([firstKey]));
        }
      })
      .catch(() => {
        setError(intl.formatMessage(messages.loadingError));
      });
  }, [courseId, intl]);

  if (error) {
    return (
      <div className="aspects-wrapper">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="aspects-wrapper">
        <Spinner animation="border" screenReaderText="Loading dashboards..." />
      </div>
    );
  }

  if (config.superset_dashboards.length === 0) {
    return (
      <div className="aspects-wrapper">
        <Alert variant="warning">{intl.formatMessage(messages.noDashboards)}</Alert>
      </div>
    );
  }

  const handleTabSelect = (key: string | null) => {
    if (!key) {
      return;
    }
    setActiveKey(key);
    setEmbeddedKeys((prev) => new Set([...prev, key]));
  };

  return (
    <div className="aspects-wrapper">
      <h3 className="text-primary-700 mb-2">{intl.formatMessage(messages.reportsDashboardTitle)}</h3>
      {config.show_dashboard_link && (
        <a
          href={config.superset_url}
          target="_blank"
          rel="noopener noreferrer"
          className="aspects-superset-link mb-2"
        >
          {intl.formatMessage(messages.viewInSuperset)}
        </a>
      )}
      <Tabs
        activeKey={activeKey}
        onSelect={handleTabSelect}
      >
        {config.superset_dashboards.map((dashboard) => (
          <Tab key={dashboard.uuid} eventKey={dashboard.uuid} title={dashboard.name}>
            <DashboardTab
              dashboard={dashboard}
              supersetUrl={config.superset_url}
              guestTokenUrl={config.superset_guest_token_url}
              shouldEmbed={embeddedKeys.has(dashboard.uuid)}
            />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};

export default ReportsDashboard;
