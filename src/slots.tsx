import { SlotOperation, WidgetOperationTypes } from '@openedx/frontend-base';
import ReportsDashboard from './widgets/ReportsDashboard';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const PlaceholderSlot = (_props: Record<string, any>) => null;

const slots: SlotOperation[] = [
  {
    slotId: 'org.openedx.frontend.slot.instructorDashboard.routes.v1',
    id: 'org.openedx.frontend.widget.instructorDashboard.route.aspects',
    op: WidgetOperationTypes.APPEND,
    element: <PlaceholderSlot tabId="aspects" content={<ReportsDashboard />} />,
  }
];

export default slots;
