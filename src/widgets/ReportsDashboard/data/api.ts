import { getAuthenticatedHttpClient, getSiteConfig } from '@openedx/frontend-base';

export interface SupersetDashboard {
  name: string;
  uuid: string;
  slug: string;
  allow_translations?: boolean;
}

export interface ReportsDashboardConfig {
  superset_dashboards: SupersetDashboard[];
  superset_url: string;
  superset_guest_token_url: string;
  show_dashboard_link: boolean;
}

export const getReportsDashboardConfig = async (courseId: string): Promise<ReportsDashboardConfig> => {
  const { lmsBaseUrl } = getSiteConfig();
  const { data } = await getAuthenticatedHttpClient().get<ReportsDashboardConfig>(
    `${lmsBaseUrl}/aspects/superset_instructor_dashboard/${courseId}/`,
  );
  return data;
};

export const fetchGuestToken = async (guestTokenUrl: string): Promise<string> => {
  const { data } = await getAuthenticatedHttpClient().get<{ guestToken: string }>(guestTokenUrl);
  return data.guestToken;
};
