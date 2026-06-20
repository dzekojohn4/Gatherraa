import type { Meta, StoryObj } from '@storybook/react';
import {
  AttendeeActivityTimeline,
  type AttendeeActivity,
} from './AttendeeActivityTimeline';

const activities: AttendeeActivity[] = [
  {
    id: 'activity-5',
    type: 'event_participation',
    occurredAt: '2026-06-18T20:15:00Z',
    title: 'Event completed',
    eventName: 'Stellar Builders Summit',
    description: 'Attended the closing session and completed the event experience.',
    status: 'success',
    metadata: [{ label: 'Sessions attended', value: '5 of 6' }],
  },
  {
    id: 'activity-4',
    type: 'check_in',
    occurredAt: '2026-06-18T08:42:00Z',
    title: 'Checked in',
    eventName: 'Stellar Builders Summit',
    description: 'Entry recorded at the main venue entrance.',
    status: 'success',
    direction: 'in',
    metadata: [{ label: 'Gate', value: 'Main entrance' }],
  },
  {
    id: 'activity-3',
    type: 'verification',
    occurredAt: '2026-06-16T14:05:00Z',
    title: 'Identity verified',
    description: 'Attendee verification was approved for event access.',
    status: 'success',
    metadata: [{ label: 'Method', value: 'Wallet signature' }],
  },
  {
    id: 'activity-2',
    type: 'ticket_purchase',
    occurredAt: '2026-06-12T10:30:00Z',
    title: 'Ticket purchased',
    eventName: 'Stellar Builders Summit',
    description: 'General admission ticket payment was confirmed.',
    status: 'success',
    metadata: [
      { label: 'Ticket', value: '#GB-2048' },
      { label: 'Amount', value: '$49.00' },
    ],
  },
  {
    id: 'activity-1',
    type: 'event_participation',
    occurredAt: '2026-05-03T17:00:00Z',
    title: 'Joined event',
    eventName: 'Web3 Community Meetup',
    description: 'Registration added to the attendee participation history.',
    status: 'info',
  },
];

const meta = {
  title: 'Attendees/AttendeeActivityTimeline',
  component: AttendeeActivityTimeline,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-2xl bg-gray-50 p-6 dark:bg-gray-950">
        <Story />
      </div>
    ),
  ],
  args: { activities },
} satisfies Meta<typeof AttendeeActivityTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteHistory: Story = {};

export const Empty: Story = {
  args: { activities: [] },
};

export const Loading: Story = {
  args: { activities: [], loading: true },
};

export const WithoutFilters: Story = {
  args: { showFilters: false },
};

