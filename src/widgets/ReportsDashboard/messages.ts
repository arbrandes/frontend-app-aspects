import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  reportsDashboardTitle: {
    id: 'aspects.reportsDashboard.title',
    defaultMessage: 'Reports',
    description: 'Title for the reports dashboard widget',
  },
  viewInSuperset: {
    id: 'aspects.reportsDashboard.viewInSuperset',
    defaultMessage: 'View dashboards in Superset',
    description: 'Link text for viewing the dashboard in Superset',
  },
  loadingError: {
    id: 'aspects.reportsDashboard.loadingError',
    defaultMessage: 'An error occurred while loading the dashboard. Please try again later.',
    description: 'Error message displayed when the dashboard fails to load',
  },
  noDashboards: {
    id: 'aspects.reportsDashboard.noDashboards',
    defaultMessage: 'No dashboards are configured for this course.',
    description: 'Message displayed when there are no dashboards configured for the course',
  },
});

export default messages;
