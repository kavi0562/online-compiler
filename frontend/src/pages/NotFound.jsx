import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';

export default function NotFound() {
    return (
        <>
            <SEO
                title="Page Not Found - Online Compiler"
                description="The page you are looking for does not exist. Visit our homepage to run Python, Java, C++, and other code online."
                keywords="404, not found, online compiler"
                canonical="/404"
            />
            <Navbar />
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-9xl font-bold text-gray-500">404</h1>
                        <h2 className="text-5xl font-bold mt-4">Page Not Found</h2>
                        <p className="py-6 text-xl">
                            Oops! The page you are looking for seems to have gone missing.
                            But don't worry, you can still compile code instantly.
                        </p>
                        <div className="flex flex-col gap-4">
                            <Link to="/" className="btn btn-primary btn-wide mx-auto">Go to Homepage</Link>
                            <div className="divider">OR TRY</div>
                            <div className="flex justify-center gap-2">
                                <Link to="/compiler/python" className="link link-hover">Python Compiler</Link> |
                                <Link to="/compiler/java" className="link link-hover">Java Compiler</Link> |
                                <Link to="/compiler/cpp" className="link link-hover">C++ Compiler</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
