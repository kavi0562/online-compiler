import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { MessageSquare, X, Cpu, Zap, ChevronRight, Terminal, Copy, Check, Mic, MicOff, Volume2, VolumeX, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const ChatAssistant = ({ language, onInsertCode, onLanguageChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Systems Online. I am your AI Co-Pilot. Ready to assist with code generation and debugging.' }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const messagesEndRef = useRef(null);

    // VOICE STATE
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voice, setVoice] = useState(null);
    const synthesisRef = useRef(window.speechSynthesis);
    const recognitionRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // --- TTS: LOAD VOICES ---
    useEffect(() => {
        const loadVoices = () => {
            const voices = synthesisRef.current.getVoices();
            // Try to find a "Google US English" or similar nice voice
            const preferredVoice = voices.find(v => v.name.includes("Google US English")) ||
                voices.find(v => v.name.includes("Zira")) ||
                voices.find(v => v.lang.startsWith("en-US"));
            setVoice(preferredVoice || voices[0]);
        };

        loadVoices();
        if (synthesisRef.current.onvoiceschanged !== undefined) {
            synthesisRef.current.onvoiceschanged = loadVoices;
        }
    }, []);

    // --- TTS: SPEAK FUNCTION ---
    const speak = useCallback((text) => {
        if (!isVoiceEnabled || !synthesisRef.current) return;

        // Cancel any current speaking
        synthesisRef.current.cancel();

        // Strip markdown symbols for smoother speech
        const cleanText = text.replace(/[*`#_]/g, '');

        const utterance = new SpeechSynthesisUtterance(cleanText);
        if (voice) utterance.voice = voice;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        synthesisRef.current.speak(utterance);
    }, [isVoiceEnabled, voice]);

    // --- STT: SETUP ---
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(prev => prev + (prev ? ' ' : '') + transcript);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    // --- AUTO-SPEAK NEW AI MESSAGES ---
    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.role === 'ai' && isOpen) {
            speak(lastMsg.content);
        }
    }, [messages, isOpen, speak]);


    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:5051"}/api/ai/chat`, {
                message: userMsg.content,
                language: language
            });

            const aiMsg = { role: 'ai', content: res.data.response };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            let errorMsg = "CONNECTION_LOST: Re-connecting to Neural Link...";

            if (err.response) {
                if (err.response.status === 401 || err.response.data?.error === "INVALID_API_KEY") {
                    errorMsg = "⚠️ AUTHENTICATION ERROR: Invalid Groq API Key. Please update the server .env file.";
                } else if (err.response.data?.error) {
                    errorMsg = `SYSTEM FAILURE: ${err.response.data.error}`;
                }
            }

            setMessages(prev => [...prev, { role: 'ai', content: errorMsg }]);
        } finally {
            setIsThinking(false);
        }
    };

    const clearChat = () => {
        if (window.confirm("Purge all neural memory systems? This action cannot be undone.")) {
            setMessages([
                { role: 'ai', content: 'Systems Online. I am your AI Co-Pilot. Ready to assist with code generation and debugging.' }
            ]);
            setInput('');
        }
    };


    const handleCopy = (code, index) => {
        navigator.clipboard.writeText(code);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    // Custom Code Block Renderer
    const CodeBlock = ({ node, inline, className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || '');
        const codeLang = match ? match[1] : '';
        const codeContent = String(children).replace(/\n$/, '');

        // Generate a unique ID for this block for copy state tracking (simple index here)
        const blockId = node?.position?.start?.line;

        const handleInsertWrapper = () => {
            if (codeLang) {
                // Map common markdown language tags to our internal system identifiers
                const langMap = {
                    'py': 'python',
                    'python': 'python',
                    'js': 'javascript',
                    'javascript': 'javascript',
                    'java': 'java',
                    'cpp': 'cpp',
                    'c': 'c',
                    'cs': 'csharp',
                    'csharp': 'csharp',
                    'go': 'go',
                    'rs': 'rust',
                    'rust': 'rust',
                    'php': 'php',
                    'rb': 'ruby',
                    'ruby': 'ruby',
                    'swift': 'swift',
                    'ts': 'typescript',
                    'typescript': 'typescript',
                    'sh': 'bash',
                    'bash': 'bash'
                };

                const targetLang = langMap[codeLang.toLowerCase()];
                if (targetLang && onLanguageChange) {
                    onLanguageChange(targetLang);
                }
            }
            onInsertCode(codeContent);
        };

        if (!inline && match) {
            return (
                <div className="relative group my-4 rounded-lg overflow-hidden border border-[#30363d] bg-[#1e1e1e]">
                    {/* Code Header / Actions */}
                    <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-[#30363d]">
                        <span className="text-xs text-gray-400 font-mono">{codeLang.toUpperCase()}</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleCopy(codeContent, blockId)}
                                className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-white transition-colors"
                                title="Copy Code"
                            >
                                {copiedIndex === blockId ? <Check size={12} className="text-neon-green" /> : <Copy size={12} />}
                                {copiedIndex === blockId ? "COPIED" : "COPY"}
                            </button>
                            <button
                                onClick={handleInsertWrapper}
                                className="flex items-center gap-1 text-[10px] bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan px-2 py-0.5 rounded transition-colors"
                                title="Insert into Editor"
                            >
                                <Terminal size={10} /> INSERT
                            </button>
                        </div>
                    </div>
                    {/* Highlighter */}
                    <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={codeLang}
                        PreTag="div"
                        customStyle={{ margin: 0, padding: '1rem', fontSize: '0.85rem' }}
                        {...props}
                    >
                        {codeContent}
                    </SyntaxHighlighter>
                </div>
            );
        }

        return (
            <code className={`${className} bg-gray-800/50 rounded px-1 py-0.5 text-neon-magenta text-xs font-mono`} {...props}>
                {children}
            </code>
        );
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">

            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 h-[600px] bg-[#0a0a1a]/95 backdrop-blur-xl border border-neon-cyan/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300">

                    {/* Header */}
                    <div className="p-3 bg-gradient-to-r from-neon-cyan/10 to-transparent border-b border-neon-cyan/20 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <Cpu size={18} className="text-neon-cyan animate-pulse" />
                            <span className="text-sm font-bold text-white tracking-widest">AI_CO_PILOT</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* CLEAR CHAT */}
                            <button
                                onClick={clearChat}
                                className="p-1.5 rounded-lg transition-colors text-gray-500 hover:text-red-500 hover:bg-red-500/10"
                                title="Clear History"
                            >
                                <Trash2 size={16} />
                            </button>
                            {/* VOICE TOGGLE */}
                            <button
                                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                                className={`p-1.5 rounded-lg transition-colors ${isVoiceEnabled ? 'text-neon-cyan bg-neon-cyan/10' : 'text-gray-500 hover:text-gray-300'}`}
                                title={isVoiceEnabled ? "Mute Voice" : "Enable Voice"}
                            >
                                {isVoiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                            </button>

                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[95%] rounded-xl p-3 text-sm 
                                    ${msg.role === 'user'
                                        ? 'bg-neon-cyan/10 border border-neon-cyan/30 text-gray-200'
                                        : 'bg-[#050510] border border-[#30363d] text-gray-300'
                                    }`}>
                                    {msg.role === 'user' ? (
                                        <div className="whitespace-pre-wrap">{msg.content}</div>
                                    ) : (
                                        <ReactMarkdown
                                            components={{ code: CodeBlock }}
                                            remarkPlugins={[remarkGfm]}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isThinking && (
                            <div className="flex justify-start">
                                <div className="bg-[#050510] border border-[#30363d] rounded-xl p-3 flex items-center gap-2">
                                    <Zap size={14} className="text-neon-magenta animate-spin" />
                                    <span className="text-xs text-gray-500 animate-pulse">PROCESSING_QUERY...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-[#30363d] bg-[#050510]/50 flex-shrink-0">
                        <div className="relative flex items-center gap-2">
                            {/* MICROPHONE BUTTON */}
                            <button
                                onClick={toggleListening}
                                className={`p-2 rounded-lg transition-all ${isListening
                                    ? 'bg-red-500/20 text-red-500 animate-pulse border border-red-500/50'
                                    : 'bg-neon-cyan/5 text-neon-cyan hover:bg-neon-cyan/10 border border-transparent'
                                    }`}
                                title="Voice Input"
                            >
                                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                            </button>

                            <div className="relative flex-1 flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={isListening ? "Listening..." : "Execute command..."}
                                    className="w-full bg-[#0a0a1a] border border-[#30363d] rounded-lg pl-3 pr-10 py-2 text-sm text-gray-300 focus:border-neon-cyan focus:outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    className="absolute right-2 p-1 bg-neon-cyan/20 rounded hover:bg-neon-cyan/40 text-neon-cyan transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button with Label */}
            <div className="flex items-center gap-4">
                <div className={`
                    relative px-4 py-2 bg-[#050510]/90 border border-neon-cyan/50 rounded-xl backdrop-blur-xl 
                    shadow-[0_0_20px_rgba(0,243,255,0.2)] 
                    flex items-center gap-2
                    transition-all duration-500 ease-out transform
                    hover:scale-105 hover:border-neon-cyan hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]
                    ${isOpen ? 'opacity-0 translate-x-8 pointer-events-none' : 'opacity-100 translate-x-0'}
                `}>
                    {/* Pulsing Status Dot */}
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
                    </span>

                    <span className="text-[10px] font-bold text-white tracking-[0.2em] font-mono typing-effect drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]">
                        AI_ASSISTANT
                    </span>

                    {/* Decorative Corner Accent */}
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-cyan rounded-tr-sm opacity-50"></div>
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center justify-center w-14 h-14 rounded-full 
                        ${isOpen ? 'bg-neon-cyan text-black' : 'bg-black/80 text-neon-cyan border border-neon-cyan shadow-[0_0_20px_rgba(0,243,255,0.4)]'}
                        transition-all duration-300 hover:scale-110 group z-50`}
                >
                    {isOpen ? <X size={24} /> : <MessageSquare size={24} className="group-hover:animate-bounce" />}
                </button>
            </div>
        </div>
    );
};

export default ChatAssistant;
