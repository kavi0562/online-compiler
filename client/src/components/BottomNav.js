import { NavLink } from 'react-router-dom';
import { Code2, BookOpen, MessageSquare } from 'lucide-react';

const BottomNav = () => {
    // We can use a simple state or context to toggle chat if needed, 
    // but per requirements, we'll just link to '/chat' or similar if it existed, 
    // or keep it visual. Since ChatAssistant is an overlay, we might need a way to trigger it.
    // However, for "Navigation", we usually route.
    // The prompt asked for "icons for 'Editor', 'Syllabus', and 'Chatbot'".
    // I will link Chatbot to #chat for now or use a button if I could access the overlay state.
    // Given the constraints and separate components, I'll make it a visual link that 
    // effectively might not "open" the overlay unless we lift state.
    // BUT optimization: purely for navigation as requested.

    const navItems = [
        { name: 'Editor', path: '/user', icon: <Code2 size={24} /> },
        { name: 'Syllabus', path: '/syllabus', icon: <BookOpen size={24} /> },
        // For Chatbot, we can ideally link to a standalone chat page if we had one, 
        // or just keep it as a route that might redirect / overlay.
        // Let's assume there might be a /chat route or just putting it here as a placeholder.
        { name: 'Chatbot', path: '/user?chat=true', icon: <MessageSquare size={24} /> }
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#050510]/95 backdrop-blur-xl border-t border-gray-800 z-[9999] flex items-center justify-around px-4 pb-safe">
            {navItems.map((item) => (
                <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) => `
                        flex flex-col items-center justify-center gap-1 w-full h-full
                        ${isActive
                            ? 'text-neon-cyan'
                            : 'text-gray-500 hover:text-gray-300'}
                    `}
                >
                    {item.icon}
                    <span className="text-[10px] font-bold tracking-wide">{item.name}</span>
                </NavLink>
            ))}
        </div>
    );
};

export default BottomNav;
