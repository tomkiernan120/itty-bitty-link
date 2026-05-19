export default function Loading() {
  return (
    <main>
      <div className="container px-8 md:px-0 md:mx-auto space-y-2 py-10">
        <div className="flex flex-col space-y-2 mb-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
        <div className="space-y-3 animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-full"></div>
          <div className="h-12 bg-gray-200 rounded w-full"></div>
          <div className="h-12 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </main>
  );
}
