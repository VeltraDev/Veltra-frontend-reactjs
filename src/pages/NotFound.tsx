import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-600 mb-2">Page Not Found</h2>
                <p className="text-gray-500 mb-6">Sorry, the page you are looking for does not exist.</p>
                <Link to="/" className="text-primary hover:underline">Go back to Home</Link>
            </div>
        </div>
    );
}

export default NotFound;