import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Editor from '../components/Editor';
import Output from '../components/Output';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import { languageContent } from '../data/languageContent';

const languageConfig = {
    python: {
        title: "Online Python Compiler - Run Python Code Instantly",
        description: "Best online Python compiler. Write, run, and share Python code in your browser. No installation required. Supports Python 3.x with standard libraries.",
        keywords: "python compiler, online python interpreter, run python online, python editor",
    },
    java: {
        title: "Online Java Compiler - Run Java Code Instantly",
        description: "Fastest online Java compiler. Compile and execute Java code in your browser. Supports Java JDK 17+. Perfect for students and developers.",
        keywords: "java compiler, online java runner, execute java online, java editor",
    },
    cpp: {
        title: "Online C++ Compiler - Run C++ Code Instantly",
        description: "Powerful online C++ compiler (GCC). Compile and run C++17/20 code directly in your browser. Fast execution and standard library support.",
        keywords: "cpp compiler, online c++ compiler, run c++ online, gcc online",
    },
    javascript: {
        title: "Online JavaScript Compiler - Run NodeJS Instantly",
        description: "Execute JavaScript (Node.js) code online. Test scripts and algorithms in a secure sandbox environment.",
        keywords: "javascript compiler, nodejs online, run js online, js editor",
    },
    c: {
        title: "Online C Compiler - Run C Code Instantly",
        description: "Fast online C compiler (GCC). Compile and execute C programs in your browser without setup. Ideal for learning C programming.",
        keywords: "c compiler, online c compiler, run c online, c programming",
    }
};

export default function CompilerPage() {
    const { lang } = useParams();
    const normalizedLang = lang?.toLowerCase();
    const config = languageConfig[normalizedLang] || {
        title: "Online Code Compiler",
        description: "Run code online in multiple languages including Python, Java, C++, and more.",
        keywords: "online compiler, code editor, programming"
    };

    const content = languageContent[normalizedLang];

    return (
        <>
            <SEO
                title={config.title}
                description={config.description}
                keywords={config.keywords}
                canonical={`/compiler/${lang}`}
            />
            <Navbar />
            <div className="container mx-auto px-4 py-6">
                <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: `${lang} Compiler`, url: null }]} />

                <header className="mb-6 text-center">
                    <h1 className="text-3xl font-bold mb-2 capitalize">{content?.title || `${lang} Compiler`}</h1>
                    <p className="text-gray-400">{content?.heroText || config.description}</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[700px] mb-12">
                    <div className="h-full">
                        <Editor />
                    </div>
                    <div className="h-full">
                        <Output />
                    </div>
                </div>

                {/* Deep Content Section for SEO */}
                {content && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                        <div className="lg:col-span-3">
                            <div
                                className="prose prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: content.content }}
                            />
                        </div>
                        <div className="bg-base-200 p-6 rounded-lg h-fit">
                            <h3 className="text-xl font-bold mb-4">Other Compilers</h3>
                            <ul className="space-y-2">
                                {Object.keys(languageConfig).map(l => (
                                    l !== normalizedLang && (
                                        <li key={l}>
                                            <Link to={`/compiler/${l}`} className="text-blue-400 hover:underline capitalize">
                                                {l} Compiler
                                            </Link>
                                        </li>
                                    )
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
