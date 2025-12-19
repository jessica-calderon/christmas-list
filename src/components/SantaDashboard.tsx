import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Person } from '../types/person';
import type { SantaRecipientStatus } from '../types/santaTracking';
import { useSantaTracking } from '../hooks/useSantaTracking';
import Card from './Card';

interface SantaDashboardProps {
  people: Person[];
}

const STATUS_COLORS: Record<SantaRecipientStatus, { bg: string; text: string; border: string }> = {
  not_started: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-300 dark:border-gray-600',
  },
  in_progress: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-300 dark:border-purple-600',
  },
  purchased: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-600',
  },
  wrapped: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-300 dark:border-yellow-600',
  },
  complete: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-300 dark:border-green-600',
  },
};

const STATUS_LABELS: Record<SantaRecipientStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  purchased: 'Purchased',
  wrapped: 'Wrapped',
  complete: 'Complete',
};

export default function SantaDashboard({ people }: SantaDashboardProps) {
  const navigate = useNavigate();
  const { tracking, isLoading, getRecipientStatus, updateStatus, isSantaMode } = useSantaTracking();

  const recipientsWithStatus = useMemo(() => {
    return people.map((person) => {
      const statusData = getRecipientStatus(person.id);
      const status: SantaRecipientStatus = statusData?.status || 'not_started';
      return {
        person,
        status,
        statusData,
      };
    });
  }, [people, tracking, getRecipientStatus]);

  const handleStatusChange = async (recipientId: string, newStatus: SantaRecipientStatus) => {
    await updateStatus(recipientId, newStatus);
  };

  if (!isSantaMode) {
    return null;
  }

  return (
    <Card className="p-4 sm:p-6 mb-4 sm:mb-6 bg-gradient-to-r from-red-500/10 via-green-500/10 to-red-500/10 dark:from-red-600/20 dark:via-green-600/20 dark:to-red-600/20 border-red-400/30 dark:border-red-500/30">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
          <span>🎅</span>
          <span>Santa Gift Progress</span>
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Track your gift progress for each recipient
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading progress...</p>
        </div>
      ) : recipientsWithStatus.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">No recipients to track yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recipientsWithStatus.map(({ person, status, statusData }) => {
            const colors = STATUS_COLORS[status];
            
            return (
              <div
                key={person.id}
                className={`p-3 sm:p-4 rounded-xl border-2 ${colors.bg} ${colors.border} transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-red-500 to-green-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                      {person.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-100 truncate">
                        {person.name}
                      </h3>
                      {statusData?.notes && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                          {statusData.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/person/${person.id}`)}
                    className="ml-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    View
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold ${colors.text} ${colors.bg} border ${colors.border}`}
                  >
                    {STATUS_LABELS[status]}
                  </span>

                  <div className="flex gap-1 flex-1 min-w-0">
                    {(['not_started', 'in_progress', 'purchased', 'wrapped', 'complete'] as SantaRecipientStatus[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(person.id, s)}
                        className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                          status === s
                            ? `${colors.bg} ${colors.text} ${colors.border} border-2 font-bold`
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 border-2 border-transparent'
                        }`}
                        title={STATUS_LABELS[s]}
                      >
                        {s === 'not_started' ? 'Not Started' : s === 'in_progress' ? 'Some Bought' : s === 'purchased' ? 'Bought' : s === 'wrapped' ? 'Wrapped' : 'Done'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

