export default function Loading() {
  return (
    <main className="flex items-center justify-center py-10">
      <div className="border rounded-lg bg-white flex flex-col space-y-8 px-8 py-6 drop-shadow w-full md:w-96 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="space-y-4">
          <div>
            <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-12 bg-gray-100 rounded w-full"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-12 mb-2"></div>
            <div className="h-12 bg-gray-100 rounded w-full"></div>
          </div>
        </div>
        <div className="h-12 bg-gray-200 rounded w-full"></div>
      </div>
    </main>
  );
}
