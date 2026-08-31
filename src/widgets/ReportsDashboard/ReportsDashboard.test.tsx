import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { IntlProvider } from '@openedx/frontend-base';
import userEvent from '@testing-library/user-event';
import ReportsDashboard from './ReportsDashboard';
import { getReportsDashboardConfig } from './data/api';
import { embedDashboard } from '@superset-ui/embedded-sdk';

jest.mock('./data/api', () => ({
  getReportsDashboardConfig: jest.fn(),
  fetchGuestToken: jest.fn(() => Promise.resolve('mock-token')),
}));

jest.mock('@superset-ui/embedded-sdk', () => ({
  embedDashboard: jest.fn(),
}));

describe('ReportsDashboard', () => {
  const mockConfig = {
    superset_dashboards: [
      { uuid: 'dashboard-1', name: 'Dashboard 1' },
      { uuid: 'dashboard-2', name: 'Dashboard 2' },
    ],
    superset_url: 'https://superset.example.com',
    superset_guest_token_url: 'https://superset.example.com/token',
    show_dashboard_link: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (embedDashboard as jest.Mock).mockResolvedValue({
      unmount: jest.fn(),
    });
  });

  const renderComponent = (initialPath = '/course/course-v1:edX+DemoX+2026') => render(
    <IntlProvider locale="en" messages={{}}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/course/:courseId" element={<ReportsDashboard />} />
        </Routes>
      </MemoryRouter>
    </IntlProvider>
  );

  it('renders loading spinner initially', () => {
    (getReportsDashboardConfig as jest.Mock).mockReturnValue(new Promise(() => {}));

    renderComponent();

    expect(screen.getByText('Loading dashboards...')).toBeInTheDocument();
  });

  it('does not fetch config when courseId is missing', () => {
    render(
      <IntlProvider locale="en" messages={{}}>
        <MemoryRouter initialEntries={['/no-course']}>
          <Routes>
            <Route path="/no-course" element={<ReportsDashboard />} />
          </Routes>
        </MemoryRouter>
      </IntlProvider>
    );

    expect(getReportsDashboardConfig).not.toHaveBeenCalled();
    expect(screen.getByText('Loading dashboards...')).toBeInTheDocument();
  });

  it('renders error message on API failure', async () => {
    (getReportsDashboardConfig as jest.Mock).mockRejectedValue(new Error('API Error'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('An error occurred while loading the dashboard. Please try again later.')).toBeInTheDocument();
    });
  });

  it('renders dashboards and handles tab switching', async () => {
    (getReportsDashboardConfig as jest.Mock).mockResolvedValue(mockConfig);

    const user = userEvent.setup();

    renderComponent('/course/123');

    await waitFor(() => {
      expect(screen.getByText('Dashboard 1')).toBeInTheDocument();
      expect(screen.getByText('Dashboard 2')).toBeInTheDocument();
    });

    expect(screen.getByText('View dashboards in Superset')).toBeInTheDocument();

    const secondTab = screen.getByRole('tab', { name: 'Dashboard 2' });
    await user.click(secondTab);

    await waitFor(() => {
      expect(secondTab).toHaveClass('active');
    });

    await waitFor(() => {
      expect(embedDashboard).toHaveBeenCalledTimes(2);
    });
  });

  it('renders warning when no dashboards are available', async () => {
    (getReportsDashboardConfig as jest.Mock).mockResolvedValue({
      superset_dashboards: [],
      superset_url: 'https://superset.example.com',
      superset_guest_token_url: 'https://superset.example.com/token',
      show_dashboard_link: false,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No dashboards are configured for this course.')).toBeInTheDocument();
    });
  });
});
