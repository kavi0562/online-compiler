import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

export default function Home() {
    const seoData = {
        title: "Online Compiler - Run Python, Java, C++ Code Online",
        description: "Free online compiler and IDE. support for Python, Java, C++, C, and JavaScript. Write, compile, and run code in your browser instantly.",
        keywords: "online compiler, online ide, free code editor, run code online, python compiler, java compiler",
        canonical: "/"
    };

    const languages = [
        { name: 'Python', slug: 'python', color: 'text-yellow-400', desc: 'Run Python 3 scripts instantly' },
        { name: 'Java', slug: 'java', color: 'text-red-400', desc: 'Compile and execute Java code' },
        { name: 'C++', slug: 'cpp', color: 'text-blue-400', desc: 'Modern C++ (GCC) compiler' },
        { name: 'C', slug: 'c', color: 'text-blue-300', desc: 'Fast C programming compiler' },
        { name: 'JavaScript', slug: 'javascript', color: 'text-yellow-300', desc: 'Node.js execution sandbox' },
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Online Compiler",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Free online compiler for Python, Java, C++, and more.",
        "featureList": languages.map(l => l.name).join(", "),
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question",
            "name": "Is this online compiler free?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, our online compiler is 100% free to use for learning, testing, and running code in Python, Java, C++, and more."
            }
        }, {
            "@type": "Question",
            "name": "Do I need to install anything?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "No, you do not need to install any software or plugins. Everything runs exactly in your web browser."
            }
        }]
    };

    return (
        <>
            <SEO {...seoData} />
            <script type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(faqSchema)}
            </script>
            <Navbar />

            <main className="container mx-auto px-4">
                {/* Hero Section */}
                <section className="py-20 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Code Instantly in Your Browser
                    </h1>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        The fastest online compiler for Python, Java, C++, and more.
                        No setup required. Just write code and run it.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/compiler/python" className="btn btn-primary btn-lg">Start Coding (Python)</Link>
                        <Link to="/compiler/java" className="btn btn-secondary btn-lg">Start Coding (Java)</Link>
                    </div>
                </section>

                {/* Language Grid */}
                <section className="py-12">
                    <h2 className="text-3xl font-bold text-center mb-10">Supported Languages</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {languages.map((lang) => (
                            <Link key={lang.slug} to={`/compiler/${lang.slug}`} className="card bg-base-200 shadow-xl hover:bg-base-300 transition-colors">
                                <div className="card-body">
                                    <h3 className={`card-title ${lang.color}`}>{lang.name}</h3>
                                    <p>{lang.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Features Section (Trust Signals) */}
                <section className="py-12 border-t border-base-300">
                    <h2 className="text-3xl font-bold text-center mb-10">Why Use Our Online Compiler?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl mb-4">🚀</div>
                            <h3 className="text-xl font-bold mb-2">Instant Execution</h3>
                            <p className="text-gray-400">Run your code in milliseconds. We use high-performance isolated containers.</p>
                        </div>
                        <div>
                            <div className="text-4xl mb-4">🔒</div>
                            <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
                            <p className="text-gray-400">Your code is executed in a secure sandbox and not shared unless you choose to.</p>
                        </div>
                        <div>
                            <div className="text-4xl mb-4">🌐</div>
                            <h3 className="text-xl font-bold mb-2">Accessible Anywhere</h3>
                            <p className="text-gray-400">Code from any device, mobile or desktop. No installation needed.</p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section (Schema Ready) */}
                <section className="py-12 mb-12">
                    <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                    <div className="space-y-4 max-w-3xl mx-auto">
                        <div className="collapse collapse-arrow bg-base-200">
                            <input type="radio" name="my-accordion-2" defaultChecked />
                            <div className="collapse-title text-xl font-medium">
                                Is this online compiler free?
                            </div>
                            <div className="collapse-content">
                                <p>Yes, our online compiler is 100% free to use for learning, testing, and running code in Python, Java, C++, and more.</p>
                            </div>
                        </div>
                        <div className="collapse collapse-arrow bg-base-200">
                            <input type="radio" name="my-accordion-2" />
                            <div className="collapse-title text-xl font-medium">
                                Do I need to install anything?
                            </div>
                            <div className="collapse-content">
                                <p>No, you do not need to install any software or plugins. Everything runs exactly in your web browser.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
