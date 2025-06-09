export default function Loading() {
  return (
    <div className="container px-4 py-8 animate-pulse">
      {/* Skeleton for Collection Title and Description */}
      <div className="mb-8">
        <div className="h-8 bg-gray-300 rounded w-3/4 mb-4 dark:bg-gray-700"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 dark:bg-gray-600"></div>
      </div>

      {/* Skeletons for Bookmark Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="block h-full border border-overlay/20 rounded-lg p-4 bg-card shadow-sm">
            <div className="mb-3 aspect-video flex justify-center p-6 items-center overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-6 bg-gray-300 rounded w-full mb-2 dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4 dark:bg-gray-600"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4 ml-auto dark:bg-gray-600"></div>
          </div>
        ))}
      </div>
    </div>
  );
} 