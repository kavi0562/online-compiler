import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Editor from '../components/Editor';
import Output from '../components/Output';
import SEO from '../components/SEO';

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
    const config = languageConfig[lang?.toLowerCase()] || {
        title: "Online Code Compiler",
        description: "Run code online in multiple languages including Python, Java, C++, and more.",
        keywords: "online compiler, code editor, programming"
    };

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
                <header className="mb-6 text-center">
                    <h1 className="text-3xl font-bold mb-2 capitalize">{lang ? `${lang} Compiler` : 'Online Compiler'}</h1>
                    <p className="text-gray-400">{config.description}</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-200px)]">
                    <div className="h-full">
                        <Editor />
                    </div>
                    <div className="h-full">
                        <Output />
                    </div>
                </div>
            </div>
        </>
    );
}
