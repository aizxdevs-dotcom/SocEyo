export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400">
          404
        </h1>
        <p className="mt-4 text-lg">
          Oops! The page you were looking for doesn’t exist.
        </p>
      </div>
    </div>
  );
}