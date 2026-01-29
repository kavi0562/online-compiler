import { useState, useEffect } from 'react';
import { BookOpen, Code2, Play, CheckCircle } from 'lucide-react';
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

    const [activeTopicId, setActiveTopicId] = useState(() => {
        return localStorage.getItem('syllabus_topic_id') || "";
    });

    const [activeTopic, setActiveTopic] = useState(null);

    // State for Completed Modules (Persisted)
    const [completedModules, setCompletedModules] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('completed_modules')) || [];
        } catch {
            return [];
        }
    });

    // Update active topic when topic ID or syllabus changes
    useEffect(() => {
        if (currentSyllabus.length > 0) {
            if (activeTopicId) {
                const found = currentSyllabus.find(t => t.id === activeTopicId);
                setActiveTopic(found || currentSyllabus[0]);
            } else {
                setActiveTopic(currentSyllabus[0]);
                setActiveTopicId(currentSyllabus[0]?.id);
            }
        }
    }, [currentSyllabus, activeTopicId]);

    const handleLanguageChange = (lang) => {
        setActiveLanguage(lang);
        localStorage.setItem('syllabus_lang', lang);

        const newSyllabus = SYLLABUS_MAP[lang];
        setCurrentSyllabus(newSyllabus);

        // Reset topic ID to first of new syllabus
        if (newSyllabus.length > 0) {
            setActiveTopicId(newSyllabus[0].id);
        }
    };

    const handleTopicSelect = (topic) => {
        setActiveTopic(topic);
        setActiveTopicId(topic.id);
        localStorage.setItem('syllabus_topic_id', topic.id);
    };

    const toggleModuleCompletion = (moduleId) => {
        setCompletedModules(prev => {
            const newCompleted = prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId];
            localStorage.setItem('completed_modules', JSON.stringify(newCompleted));
            return newCompleted;
        });
    };

    const handleRunExample = () => {
        // Simple alert for now, effectively "running" the check
        alert(`Running Output:\n${activeTopic?.example_code?.code ? ">> Execution Success" : "No Code"}`);
    };

    const handleChallengeClick = (challenge) => {
        navigate('/', {
            state: {
                challengeCode: challenge.initialCode,
                language: activeLanguage,
                challengeTitle: challenge.title, // Pass title for description
                expectedOutput: challenge.test_case?.output
            }
        });
    }

    const handlePracticeClick = (problem) => {
        navigate('/', {
            state: {
                challengeCode: problem.initialCode,
                language: activeLanguage,
                challengeTitle: problem.title,
                expectedOutput: problem.sampleOutput
            }
        });
    }

    return (
        <div className="h-screen bg-void text-gray-200 font-tech flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-80 bg-[#050510] border-r border-gray-800 flex flex-col shrink-0 z-20 md:h-full h-auto max-h-[40vh] md:max-h-full">
                {/* Header */}
                <div className="p-6 border-b border-gray-800 bg-glass/5 shrink-0">
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

                {/* Topics List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-[#050510] [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 py-2 flex justify-between items-center sticky top-0 bg-[#050510] z-10">
                        <span>Modules</span>
                        <span className="text-xs text-gray-600 font-mono">
                            {completedModules.filter(id => currentSyllabus.find(t => t.id === id)).length} / {currentSyllabus.length}
                        </span>
                    </h3>
                    {currentSyllabus.map((topic, idx) => {
                        const isCompleted = completedModules.includes(topic.id);
                        return (
                            <button
                                key={topic.id || idx}
                                onClick={() => handleTopicSelect(topic)}
                                className={`w-full flex items-center justify-between p-3 text-xs font-bold uppercase tracking-widest transition-all rounded-lg mb-1 text-left
                                    ${activeTopic?.id === topic.id
                                        ? 'bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.1)]'
                                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    {isCompleted ? <CheckCircle size={12} className="text-neon-green" /> : <div className="w-3 h-3"></div>}
                                    {topic.topic_name}
                                </span>
                                {activeTopic?.id === topic.id && <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_5px_rgba(0,243,255,0.8)]"></div>}
                            </button>
                        );
                    })}
                    <div className="h-10 md:hidden"></div> {/* Extra padding for mobile */}
                </div>
            </div>

            {/* Main Content - Module View */}
            <div className="flex-1 bg-void relative overflow-y-auto custom-scrollbar p-6 md:p-10 pb-24 space-y-10 h-full">
                {activeTopic ? (
                    <>
                        {/* Header */}
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{activeTopic.topic_name}</h2>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan text-[10px] uppercase font-bold tracking-widest">
                                        Module: {activeTopic.id?.toUpperCase() || "General"}
                                    </span>
                                    <span className="text-xs text-gray-500 font-mono">5 Steps to Mastery</span>
                                </div>
                            </div>

                            <button
                                onClick={() => toggleModuleCompletion(activeTopic.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border ${completedModules.includes(activeTopic.id)
                                    ? 'bg-neon-green/10 border-neon-green text-neon-green shadow-[0_0_15px_rgba(0,255,0,0.3)]'
                                    : 'bg-white/5 border-gray-700 text-gray-400 hover:border-white/50 hover:text-white'
                                    }`}
                            >
                                <CheckCircle size={14} />
                                {completedModules.includes(activeTopic.id) ? 'Completed' : 'Mark Complete'}
                            </button>
                        </div>

                        {/* 1. CONCEPT EXPLANATION */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-neon-magenta font-bold tracking-widest text-sm uppercase">
                                <BookOpen size={16} /> 1. Concept & Theory
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-[#0a0a1a] border border-gray-800 p-6 rounded-xl">
                                    <h4 className="text-gray-400 text-xs font-bold uppercase mb-2">Theory</h4>
                                    <p className="text-gray-300 leading-relaxed text-sm">
                                        {activeTopic.concept?.theory || "No theory content available."}
                                    </p>
                                </div>
                                <div className="bg-[#0a0a1a] border border-gray-800 p-6 rounded-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <BookOpen size={60} />
                                    </div>
                                    <h4 className="text-neon-green text-xs font-bold uppercase mb-2">Real-Life Analogy</h4>
                                    <p className="text-gray-300 leading-relaxed text-sm italic">
                                        "{activeTopic.concept?.real_life_example || "..."}"
                                    </p>
                                </div>
                            </div>
                            {/* Syntax */}
                            <div className="bg-black/40 border border-gray-800 rounded-lg p-4 font-mono text-sm">
                                <span className="text-gray-500 text-xs uppercase block mb-1">{"// Syntax"}</span>
                                <span className="text-neon-cyan">{activeTopic.concept?.syntax || "syntax_placeholder"}</span>
                            </div>
                        </section>

                        {/* 2. EXAMPLE CODE */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-neon-blue font-bold tracking-widest text-sm uppercase">
                                <Code2 size={16} /> 2. Example Code
                            </div>
                            <div className="bg-[#1e1e1e] border border-gray-700 rounded-xl overflow-hidden relative">
                                <div className="bg-[#252526] px-4 py-2 flex items-center justify-between border-b border-gray-700">
                                    <span className="text-xs text-gray-400 font-mono">example.{activeTopic.example_code?.language === 'python' ? 'py' : 'txt'}</span>
                                    <button onClick={handleRunExample} className="flex items-center gap-1 text-[10px] bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded transition-colors uppercase font-bold">
                                        <Play size={10} /> Run
                                    </button>
                                </div>
                                <textarea
                                    className="w-full h-32 bg-[#1e1e1e] p-4 text-xs font-mono text-gray-300 focus:outline-none resize-none"
                                    readOnly={true} // Editable in future iteration
                                    value={activeTopic.example_code?.code || "# No example"}
                                />
                            </div>
                        </section>

                        {/* 3. PRACTICE QUESTIONS */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-neon-yellow font-bold tracking-widest text-sm uppercase">
                                <CheckCircle size={16} className="text-yellow-400" /> 3. Practice Questions
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeTopic.practice_questions?.map((q, i) => (
                                    <div key={i} className="bg-[#0a0a1a] border border-gray-800 p-4 rounded-xl flex flex-col gap-2 hover:border-yellow-500/30 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-200 text-sm">{q.title}</h4>
                                            <span className={`text-[9px] px-2 py-0.5 rounded border ${q.difficulty === 'Easy' ? 'border-green-500/30 text-green-400' : 'border-yellow-500/30 text-yellow-400'}`}>
                                                {q.difficulty}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-2">{q.definition}</p>
                                        <button
                                            onClick={() => handlePracticeClick(q)}
                                            className="mt-auto self-start text-[10px] text-neon-cyan hover:underline uppercase tracking-wider font-bold"
                                        >
                                            Solve &rarr;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 4. CHALLENGE */}
                        <section className="pt-4 border-t border-gray-800">
                            <div className="bg-gradient-to-r from-neon-purple/10 to-transparent border border-neon-purple/30 rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 rounded bg-neon-purple/20 border border-neon-purple/50 text-neon-purple text-[10px] font-bold uppercase tracking-widest">
                                            Final Challenge
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-mono">Auto-Graded</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{activeTopic.challenge?.title || "Module Challenge"}</h3>
                                    <p className="text-gray-300 text-sm mb-6 max-w-2xl">
                                        {activeTopic.challenge?.definition || "Complete the practice questions to unlock this challenge."}
                                    </p>

                                    <button
                                        onClick={() => handleChallengeClick(activeTopic.challenge)}
                                        className="bg-neon-purple hover:bg-neon-purple/80 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg shadow-[0_0_20px_rgba(200,50,255,0.4)] transition-all hover:scale-105 flex items-center gap-2"
                                    >
                                        <Code2 size={14} /> Start Challenge
                                    </button>
                                </div>
                            </div>
                        </section>

                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                        <BookOpen size={48} className="mb-4 text-gray-600" />
                        <h3 className="text-lg font-bold text-gray-400">Select a Module</h3>
                        <p className="text-xs text-gray-600">Choose a topic from the sidebar to begin learning.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Syllabus;
