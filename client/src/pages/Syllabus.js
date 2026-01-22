import { useState } from 'react';
import { PROBLEMS_DATA } from '../data/problemsData';
import { BookOpen, ChevronRight, Code2, Play, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Syllabus = () => {
    // Default to first problem
    const [selectedProblem, setSelectedProblem] = useState(PROBLEMS_DATA[0]);
    // Default language for code generation context
    const [practiceLang, setPracticeLang] = useState('python');
    const navigate = useNavigate();

    const handleSolve = () => {
        // Get initial code for the selected language, or fallback to python
        const codeToLoad = selectedProblem.initialCode[practiceLang] || selectedProblem.initialCode['python'];

        navigate('/user', {
            state: {
                challengeCode: codeToLoad,
                language: practiceLang
            }
        });
    };

    return (
        <div className="min-h-screen bg-void text-gray-200 font-tech flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-80 bg-[#050510] border-r border-gray-800 flex flex-col h-screen z-10">
                {/* Header */}
                <div className="p-6 border-b border-gray-800 bg-glass/5">
                    <div className="flex items-center gap-2 text-neon-cyan mb-6">
                        <Code2 size={24} />
                        <h1 className="text-xl font-bold tracking-wider">PRACTICE HUB</h1>
                    </div>
                </div>

                {/* Problems List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {PROBLEMS_DATA.map((problem, index) => (
                        <button
                            key={problem.id}
                            onClick={() => setSelectedProblem(problem)}
                            className={`w-full flex items-center gap-3 p-4 text-left transition-all rounded-xl border ${selectedProblem.id === problem.id
                                ? 'bg-neon-cyan/5 border-neon-cyan/30 text-white shadow-inner'
                                : 'bg-transparent border-transparent hover:bg-gray-900 text-gray-400'
                                }`}
                        >
                            <span className={`flex items-center justify-center w-6 h-6 rounded text-xs font-mono ${selectedProblem.id === problem.id ? 'bg-neon-cyan text-black' : 'bg-gray-800 text-gray-500'
                                }`}>
                                {index + 1}
                            </span>
                            <span className="text-sm font-medium truncate">{problem.title}</span>
                            {selectedProblem.id === problem.id && <ChevronRight size={14} className="ml-auto text-neon-cyan" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content - Problem Detail */}
            <div className="flex-1 bg-void relative overflow-y-auto custom-scrollbar">

                {/* Hero Section */}
                <div className="relative p-8 md:p-12 border-b border-gray-800 bg-gradient-to-b from-neon-blue/5 to-transparent">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-mono mb-4">
                            <BookOpen size={12} />
                            PROBLEM #{selectedProblem.id.toUpperCase()}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            {selectedProblem.title}
                        </h2>

                        <div className="bg-[#0a0a1a] border-l-4 border-neon-magenta p-4 rounded-r-lg mb-8">
                            <p className="text-lg text-gray-300 italic">
                                "{selectedProblem.definition}"
                            </p>
                        </div>

                        {/* Language Selection for Solving */}
                        <div className="flex items-center gap-4 mt-8">
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Select Language:</span>
                            <div className="flex bg-black/50 rounded-lg p-1 border border-gray-800">
                                {['python', 'java'].map(lang => (
                                    <button
                                        key={lang}
                                        onClick={() => setPracticeLang(lang)}
                                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${practiceLang === lang
                                            ? 'bg-neon-cyan text-black shadow-sm'
                                            : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleSolve}
                                className="flex items-center gap-2 bg-neon-cyan hover:bg-neon-cyan/90 text-black px-6 py-2.5 rounded-lg font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,243,255,0.3)] ml-auto"
                            >
                                <Play size={18} fill="currentColor" />
                                SOLVE NOW
                            </button>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="p-8 md:p-12 max-w-4xl mx-auto space-y-12 pb-24">

                    {/* Logic Steps */}
                    <div className="bg-[#0a0a1a] border border-gray-800 rounded-2xl p-6 md:p-8">
                        <h3 className="text-xl font-bold text-neon-green flex items-center gap-3 mb-6">
                            <Lightbulb size={24} />
                            Algorithm / Logic
                        </h3>
                        <ul className="space-y-3">
                            {selectedProblem.logic.map((step, i) => (
                                <li key={i} className="flex gap-3 text-gray-300">
                                    <CheckCircle2 size={18} className="text-neon-green/50 flex-shrink-0 mt-0.5" />
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* I/O Samples */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-[#0a0a1a] border border-gray-800 rounded-2xl p-6">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Sample Input</h4>
                            <div className="bg-black/50 p-4 rounded-lg font-mono text-gray-300 text-sm border border-gray-800">
                                <pre>{selectedProblem.sampleInput}</pre>
                            </div>
                        </div>
                        <div className="bg-[#0a0a1a] border border-gray-800 rounded-2xl p-6">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Sample Output</h4>
                            <div className="bg-black/50 p-4 rounded-lg font-mono text-neon-cyan text-sm border border-gray-800">
                                <pre>{selectedProblem.sampleOutput}</pre>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Syllabus;
