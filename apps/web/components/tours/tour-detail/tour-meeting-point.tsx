import { MeetingPoint } from "@/lib/types/tour";

interface TourMeetingPointProps {
  meetingPoint?: MeetingPoint;
}

export function TourMeetingPoint({ meetingPoint }: TourMeetingPointProps) {
  if (!meetingPoint) return null;

  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Meeting Point
      </h2>
      <div className="space-y-4">
        {/* Static Map Placeholder */}
        <div className="aspect-video w-full rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-gray-400">
              map
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {meetingPoint.coordinates.lat.toFixed(4)},{" "}
              {meetingPoint.coordinates.lng.toFixed(4)}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-blue-500 text-base mt-0.5">
              location_on
            </span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">
                {meetingPoint.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {meetingPoint.address}
              </p>
            </div>
          </div>
          {meetingPoint.instructions && (
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-blue-500 text-base mt-0.5">
                info
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {meetingPoint.instructions}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
