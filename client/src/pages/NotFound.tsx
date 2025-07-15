import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center px-4">
      <div className="max-w-md">
        <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">Oops! The page you are looking for does not exist.</p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
