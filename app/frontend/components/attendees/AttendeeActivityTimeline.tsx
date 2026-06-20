'use client';

import { useId, useMemo, useState } from 'react';
import {
  BadgeCheck,
  CalendarCheck2,
  Clock3,
  CreditCard,
  LogIn,
  LogOut,
  ShieldAlert,
  TicketCheck,
  type LucideIcon,
} from 'lucide-react';

export type AttendeeActivityType =
  | 'ticket_purchase'
  | 'check_in'
  | 'verification'
  | 'event_participation';

export type AttendeeActivityStatus = 'success' | 'pending' | 'failed' | 'info';

export interface AttendeeActivity {
  id: string;
  type: AttendeeActivityType;
  /** The point in time at which the action happened. */
  occurredAt: string | number | Date;
  title: string;
  description?: string;
  status?: AttendeeActivityStatus;
  /** Optional event context, useful when the timeline spans several events. */
  eventName?: string;
  /** Short supporting values such as a ticket number or verification method. */
  metadata?: Array<{ label: string; value: string }>;
  /** Distinguishes check-out records while keeping them in the check-in category. */
  direction?: 'in' | 'out';
}

export interface AttendeeActivityTimelineProps {
  activities: AttendeeActivity[];
  title?: string;
  description?: string;
  emptyMessage?: string;
  loading?: boolean;
  /** Show category controls when more than one activity category is present. */
  showFilters?: boolean;
  className?: string;
  locale?: string;
}

type ActivityFilter = 'all' | AttendeeActivityType;

const TYPE_LABELS: Record<AttendeeActivityType, string> = {
  ticket_purchase: 'Tickets',
  check_in: 'Check-ins',
  verification: 'Verification',
  event_participation: 'Participation',
};

const TYPE_STYLES: Record<
  AttendeeActivityType,
  { icon: LucideIcon; className: string }
> = {
  ticket_purchase: {
    icon: CreditCard,
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  },
  check_in: {
    icon: LogIn,
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  },
  verification: {
    icon: BadgeCheck,
    className: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  },
  event_participation: {
    icon: CalendarCheck2,
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  },
};

const STATUS_STYLES: Record<AttendeeActivityStatus, string> = {
  success:
    'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950 dark:text-emerald-300',
  pending:
    'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950 dark:text-amber-300',
  failed: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-950 dark:text-red-300',
  info: 'bg-gray-100 text-gray-700 ring-gray-500/20 dark:bg-gray-800 dark:text-gray-300',
};

function toDate(value: AttendeeActivity['occurredAt']) {
  return value instanceof Date ? value : new Date(value);
}

function formatDateTime(value: AttendeeActivity['occurredAt'], locale: string) {
  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function getActivityVisual(activity: AttendeeActivity) {
  if (activity.type === 'check_in' && activity.direction === 'out') {
    return { ...TYPE_STYLES.check_in, icon: LogOut };
  }
  if (activity.type === 'verification' && activity.status === 'failed') {
    return { ...TYPE_STYLES.verification, icon: ShieldAlert };
  }
  if (activity.type === 'ticket_purchase' && activity.status === 'success') {
    return { ...TYPE_STYLES.ticket_purchase, icon: TicketCheck };
  }
  return TYPE_STYLES[activity.type];
}

function TimelineSkeleton() {
  return (
    <div className="space-y-6 px-5 py-6" aria-label="Loading attendee activity" role="status">
      {[0, 1, 2].map((item) => (
        <div className="flex animate-pulse gap-4" key={item}>
          <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 w-2/5 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-4/5 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading attendee activity</span>
    </div>
  );
}

export function AttendeeActivityTimeline({
  activities,
  title = 'Attendee activity',
  description = 'Ticket, verification, and event history',
  emptyMessage = 'No attendee activity yet.',
  loading = false,
  showFilters = true,
  className = '',
  locale = 'en-US',
}: AttendeeActivityTimelineProps) {
  const [filter, setFilter] = useState<ActivityFilter>('all');
  const titleId = useId();

  const availableTypes = useMemo(
    () => Array.from(new Set(activities.map((activity) => activity.type))),
    [activities]
  );

  const visibleActivities = useMemo(
    () =>
      activities
        .filter((activity) => filter === 'all' || activity.type === filter)
        .sort((a, b) => toDate(b.occurredAt).getTime() - toDate(a.occurredAt).getTime()),
    [activities, filter]
  );

  const filters: ActivityFilter[] = ['all', ...availableTypes];

  return (
    <section
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 ${className}`}
      aria-labelledby={titleId}
    >
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id={titleId}
              className="font-semibold text-gray-950 dark:text-white"
            >
              {title}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </div>
          {!loading && activities.length > 0 ? (
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {activities.length}
              <span className="sr-only"> activities</span>
            </span>
          ) : null}
        </div>

        {showFilters && availableTypes.length > 1 ? (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Filter activity">
            {filters.map((option) => {
              const active = filter === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(option)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {option === 'all' ? 'All activity' : TYPE_LABELS[option]}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {loading ? (
        <TimelineSkeleton />
      ) : visibleActivities.length === 0 ? (
        <div className="flex flex-col items-center px-5 py-12 text-center">
          <Clock3 className="h-9 w-9 text-gray-300 dark:text-gray-600" aria-hidden />
          <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-300">
            {filter === 'all' ? emptyMessage : `No ${TYPE_LABELS[filter].toLowerCase()} activity.`}
          </p>
        </div>
      ) : (
        <ol className="px-5 py-2" aria-live="polite">
          {visibleActivities.map((activity, index) => {
            const visual = getActivityVisual(activity);
            const Icon = visual.icon;
            const date = toDate(activity.occurredAt);
            const isLast = index === visibleActivities.length - 1;

            return (
              <li className="relative flex gap-4 py-4" key={activity.id}>
                {!isLast ? (
                  <span
                    className="absolute bottom-0 left-5 top-14 w-px bg-gray-200 dark:bg-gray-700"
                    aria-hidden
                  />
                ) : null}
                <span
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${visual.className}`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>

                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-950 dark:text-white">
                        {activity.title}
                      </h3>
                      {activity.status ? (
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ring-1 ring-inset ${STATUS_STYLES[activity.status]}`}
                        >
                          {activity.status}
                        </span>
                      ) : null}
                    </div>
                    <time
                      className="shrink-0 text-xs text-gray-500 dark:text-gray-400"
                      dateTime={Number.isNaN(date.getTime()) ? undefined : date.toISOString()}
                    >
                      {formatDateTime(activity.occurredAt, locale)}
                    </time>
                  </div>

                  {activity.eventName ? (
                    <p className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                      {activity.eventName}
                    </p>
                  ) : null}
                  {activity.description ? (
                    <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                      {activity.description}
                    </p>
                  ) : null}
                  {activity.metadata?.length ? (
                    <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                      {activity.metadata.map((item) => (
                        <div className="flex gap-1 text-xs" key={`${item.label}-${item.value}`}>
                          <dt className="text-gray-500 dark:text-gray-400">{item.label}:</dt>
                          <dd className="font-medium text-gray-700 dark:text-gray-200">
                            {item.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
