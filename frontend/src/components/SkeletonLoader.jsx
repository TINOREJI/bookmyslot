const SkeletonLoader = () => (
  <div className="animate-pulse bg-white border border-gray-200 rounded-xl overflow-hidden">
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="mt-6 space-y-4">
        <div className="h-2 bg-gray-200 rounded-full"></div>
        <div className="h-2 bg-gray-200 rounded-full"></div>
      </div>
    </div>
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div className="h-10 bg-gray-200 rounded-md"></div>
    </div>
  </div>
);

export default SkeletonLoader;
