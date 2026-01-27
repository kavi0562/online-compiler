import { useState, useEffect } from 'react';
import { BookOpen, Code2, Play, ChevronDown, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import Syllabus Data
import { PYTHON_SYLLABUS } from '../data/pythonSyllabus';
import { JAVA_SYLLABUS } from '../data/javaSyllabus';
import { C_SYLLABUS } from '../data/cSyllabus';
import { CPP_SYLLABUS } from '../data/cppSyllabus';

const Syllabus = () => {
    const navigate = useNavigate();

    // Language Map
    const SYLLABUS_MAP = {
        'python': PYTHON_SYLLABUS,
        'java': JAVA_SYLLABUS,
        'c': C_SYLLABUS,
        'cpp': CPP_SYLLABUS
    };

    // State Initialization with Persistence
    const [activeLanguage, setActiveLanguage] = useState(() => {
        return localStorage.getItem('syllabus_lang') || 'python';
    });

    const [currentSyllabus, setCurrentSyllabus] = useState(() => {
        const savedLang = localStorage.getItem('syllabus_lang') || 'python';
        return SYLLABUS_MAP[savedLang] || PYTHON_SYLLABUS;
    });

    const [selectedProblem, setSelectedProblem] = useState(() => {
        const savedLang = localStorage.getItem('syllabus_lang') || 'python';
        const savedProblemId = localStorage.getItem('syllabus_problem_id');
        const syllabus = SYLLABUS_MAP[savedLang] || PYTHON_SYLLABUS;

        if (savedProblemId) {
            // Flatten topics to find problem
            for (const topic of syllabus) {
                const found = topic.programs.find(p => p.id === savedProblemId);
                if (found) return found;
            }
        }
        // Fallback to first problem
        return syllabus[0]?.programs[0] || null;
    });

    // Completed Problems State
    const [completedProblems] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('completed_problems')) || [];
        } catch {
            return [];
        }
    });

    // Collapsed Topics State (all expanded by default)
    const [expandedTopics, setExpandedTopics] = useState({});

    // Update syllabus when language changes
    const handleLanguageChange = (lang) => {
        setActiveLanguage(lang);
        localStorage.setItem('syllabus_lang', lang);

        const newSyllabus = SYLLABUS_MAP[lang];
        setCurrentSyllabus(newSyllabus);

        // Reset to first problem of *new* language
        if (newSyllabus.length > 0 && newSyllabus[0].programs.length > 0) {
            const firstProblem = newSyllabus[0].programs[0];
            setSelectedProblem(firstProblem);
            localStorage.setItem('syllabus_problem_id', firstProblem.id);
        }
    };

    const handleProblemSelect = (problem) => {
        setSelectedProblem(problem);
        localStorage.setItem('syllabus_problem_id', problem.id);
    }

    // Toggle Topic Accordion
    const toggleTopic = (index) => {
        setExpandedTopics(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Auto-expand all topics on mount or language switch
    useEffect(() => {
        const allExpanded = {};
        currentSyllabus.forEach((_, idx) => allExpanded[idx] = true);
        setExpandedTopics(allExpanded);
    }, [currentSyllabus]);


    const handleSolve = () => {
        let codeKey = activeLanguage;
        if (activeLanguage === 'cpp') codeKey = 'cpp';

        const codeToLoad = selectedProblem.initialCode[codeKey] || selectedProblem.initialCode['python'] || "// Code not available";

        navigate('/', {
            state: {
                challengeCode: codeToLoad,
                language: activeLanguage,
                expectedOutput: selectedProblem.sampleOutput,
                problemId: selectedProblem.id
            }
        });
    };

    return (
        <div className="min-h-screen bg-void text-gray-200 font-tech flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-96 bg-[#050510] border-r border-gray-800 flex flex-col h-screen z-10">
                {/* Header */}
                <div className="p-6 border-b border-gray-800 bg-glass/5">
                    <div className="flex items-center gap-2 text-neon-cyan mb-4">
                        <Code2 size={24} />
                        <h1 className="text-xl font-bold tracking-wider">HACKERMODE</h1>
                    </div>

                    {/* Language Tabs */}
                    <div className="flex bg-black/40 p-1 rounded-lg border border-gray-800">
                        {['python', 'java', 'c', 'cpp'].map(lang => (
                            <button
                                key={lang}
                                onClick={() => handleLanguageChange(lang)}
                                className={`flex-1 py-1.5 rounded-md text-[10px] md:text-xs uppercase transition-all duration-300 ${activeLanguage === lang
                                    ? 'bg-neon-cyan/20 border border-neon-cyan text-neon-cyan font-black shadow-[0_0_20px_rgba(0,243,255,0.4)] scale-105 z-10'
                                    : 'text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20'
                                    }`}
                            >
                                {lang === 'cpp' ? 'C++' : lang}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Problems List (Accordion) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {currentSyllabus.map((topic, topicIdx) => (
                        <div key={topicIdx} className="mb-2">
                            {/* Topic Header */}
                            <button
                                onClick={() => toggleTopic(topicIdx)}
                                className="w-full flex items-center justify-between p-3 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-neon-cyan transition-colors bg-white/5 rounded-lg mb-1"
                            >
                                <span>{topic.topic_name}</span>
                                <ChevronDown size={14} className={`transition-transform duration-300 ${expandedTopics[topicIdx] ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Programs */}
                            <div className={`space-y-1 pl-2 transition-all duration-300 overflow-hidden ${expandedTopics[topicIdx] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                {topic.programs.map((problem, pIdx) => (
                                    <button
                                        key={problem.id}
                                        onClick={() => handleProblemSelect(problem)}
                                        className={`w-full flex items-center gap-3 p-3 text-left transition-all rounded-lg border-l-2 ml-1 ${selectedProblem.id === problem.id
                                            ? 'bg-neon-cyan/5 border-neon-cyan text-white'
                                            : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                            }`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedProblem.id === problem.id ? 'bg-neon-cyan' : 'bg-gray-700'}`}></div>
                                        <span className="text-sm font-medium truncate w-[80%]">{problem.title}</span>
                                        {completedProblems.includes(problem.id) && (
                                            <CheckCircle size={14} className="text-neon-green ml-auto shrink-0" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content - Problem Detail */}
            <div className="flex-1 bg-void relative overflow-y-auto custom-scrollbar">

                {/* Hero Section */}
                <div className="relative p-8 md:p-12 border-b border-gray-800 bg-gradient-to-b from-neon-blue/5 to-transparent">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-mono">
                                <BookOpen size={12} />
                                PROBLEM ID: {selectedProblem?.id.toUpperCase()}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${selectedProblem?.difficulty === 'Easy' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                                selectedProblem?.difficulty === 'Medium' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                                    'border-red-500/30 text-red-400 bg-red-500/10'
                                }`}>
                                {selectedProblem?.difficulty || 'Practice'}
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            {selectedProblem?.title}
                        </h2>

                        <div className="bg-[#0a0a1a] border-l-4 border-neon-magenta p-6 rounded-r-lg mb-8 shadow-lg shadow-black/50">
                            <p className="text-lg text-gray-300 leading-relaxed">
                                {selectedProblem?.definition}
                            </p>
                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center gap-4 mt-8">
                            <div className="hidden md:flex flex-col">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">SELECTED LANGUAGE</span>
                                <span className="text-neon-cyan font-mono text-sm uppercase">{activeLanguage === 'cpp' ? 'C++' : activeLanguage}</span>
                            </div>

                            <button
                                onClick={handleSolve}
                                className="flex items-center gap-2 bg-neon-cyan/10 hover:bg-neon-cyan border border-neon-cyan text-white hover:text-black px-8 py-3 rounded-lg font-black tracking-widest text-sm transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(0,243,255,0.2)] hover:shadow-[0_0_40px_rgba(0,243,255,0.6)] ml-auto"
                            >
                                <Play size={20} fill="currentColor" />
                                SOLVE CHALLENGE
                            </button>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="p-8 md:p-12 max-w-4xl mx-auto space-y-12 pb-24">

                    {/* Logic Steps */}
                    <div className="bg-[#0a0a1a] border border-gray-800 rounded-2xl p-6 md:p-8 relative group hover:border-neon-green/30 transition-colors">
                        <div className="absolute -top-3 left-6 px-3 py-1 bg-void border border-gray-800 text-neon-green text-xs font-bold uppercase tracking-widest rounded-full group-hover:border-neon-green/30">
                            Logic & Approach
                        </div>
                        <ul className="space-y-4 mt-2">
                            {selectedProblem?.logic.map((step, i) => (
                                <li key={i} className="flex gap-4 text-gray-300">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-neon-green/10 flex items-center justify-center text-neon-green text-xs font-mono border border-neon-green/20">
                                        {i + 1}
                                    </div>
                                    <span className="leading-relaxed">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* I/O Samples */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-[#0a0a1a] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div> Sample Input
                            </h4>
                            <div className="bg-black/50 p-4 rounded-lg font-mono text-gray-300 text-sm border border-gray-800 overflow-x-auto">
                                <pre>{selectedProblem?.sampleInput}</pre>
                            </div>
                        </div>
                        <div className="bg-[#0a0a1a] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-neon-cyan"></div> Sample Output
                            </h4>
                            <div className="bg-black/50 p-4 rounded-lg font-mono text-neon-cyan text-sm border border-gray-800 overflow-x-auto">
                                <pre>{selectedProblem?.sampleOutput}</pre>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Syllabus;
