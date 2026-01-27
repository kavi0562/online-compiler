import React, { useState } from 'react';
// import { motion } from 'framer-motion'; // Unused
import { Check, Shield, Zap, Star } from 'lucide-react';
import axios from 'axios';
import ReactorLogo from '../components/scifi/ReactorLogo';

const PricingPage = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [billingCycle, setBillingCycle] = useState('monthly');

    const handleUpgrade = async (plan) => {
        setLoading(true);
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            // Mock Payment Call
            const res = await axios.post('http://localhost:5051/api/payment/upgrade',
                { plan, billingCycle }, // Passing cycle to backend
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setMessage(`ACCESS GRANTED: WELCOME TO ${plan.toUpperCase()} TIER.`);
                // Simple reload to refresh user state in App.js (or we could use context)
                setTimeout(() => window.location.href = '/', 1500);
            }
        } catch (err) {
            console.error(err);
            setMessage("TRANSACTION FAILED: " + (err.response?.data?.error || "Unknown Error"));
        } finally {
            setLoading(false);
        }
    };

    const PlanCard = ({ title, price, features, icon: Icon, color, planId }) => (
        <div className={`relative p-8 rounded-2xl border bg-glass backdrop-blur-md flex flex-col gap-6 group hover:-translate-y-2 transition-transform duration-300
        ${title === 'PRO' ? 'border-neon-cyan shadow-[0_0_30px_rgba(0,243,255,0.2)]' : 'border-[#30363d] hover:border-white/20'}
    `}>
            {title === 'PRO' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neon-cyan text-black px-4 py-1 rounded-full text-[10px] font-bold tracking-widest">
                    RECOMMENDED
                </div>
            )}

            <div className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center border border-${color}/30 text-${color}`}>
                <Icon size={24} />
            </div>

            <div>
                <h3 className={`text-2xl font-bold tracking-wider text-${color}`}>{title}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-bold text-white">{price}</span>
                    <span className="text-sm text-gray-400">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
            </div>

            <ul className="flex-1 flex flex-col gap-3">
                {features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                        <Check size={16} className={`mt-0.5 text-${color} shrink-0`} />
                        {feat}
                    </li>
                ))}
            </ul>

            <button
                onClick={() => handleUpgrade(planId)}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold tracking-widest text-xs border transition-all
                ${title === 'PRO'
                        ? `bg-neon-cyan text-black border-neon-cyan hover:bg-white hover:border-white hover:shadow-[0_0_20px_rgba(0,243,255,0.5)]`
                        : `bg-transparent text-white border-${color}/50 hover:bg-${color}/10`}
            `}
            >
                {loading ? 'PROCESSING...' : 'ACTIVATE UPLINK'}
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-void text-white font-tech relative overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Background FX */}
            <div className="starfield-layer stars-sm"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 pointer-events-none"></div>

            <div className="relative z-10 max-w-6xl w-full flex flex-col gap-12">

                <div className="text-center space-y-4">
                    <div className="flex justify-center mb-6">
                        <ReactorLogo className="w-16 h-16 text-neon-cyan animate-pulse-slow" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-neon-cyan to-neon-magenta">
                        UPGRADE PROTOCOLS
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Unlock advanced computing resources. Secure your connection to the Neural Uplink.
                        Enhanced processing power available immediately.
                    </p>
                </div>

                {message && (
                    <div className="mx-auto px-6 py-3 bg-neon-green/10 border border-neon-green text-neon-green rounded-lg text-sm font-bold tracking-widest animate-pulse">
                        {message}
                    </div>
                )}

                <div className="flex justify-center items-center gap-4 mb-4">
                    <span className={`text-sm font-bold tracking-widest transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>MONTHLY</span>

                    <button
                        onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                        className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 relative ${billingCycle === 'yearly' ? 'bg-neon-cyan' : 'bg-gray-700'}`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'}`}></div>
                    </button>

                    <span className={`text-sm font-bold tracking-widest transition-colors flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>
                        YEARLY
                        <span className="text-[10px] bg-neon-magenta/20 text-neon-magenta px-2 py-0.5 rounded-full border border-neon-magenta/30">SAVE 20%</span>
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {/* FREE TIER */}
                    <PlanCard
                        title="INITIATE"
                        price="₹0"
                        color="gray-400"
                        icon={Shield}
                        planId="free"
                        features={[
                            "Basic Code Execution",
                            "Public Access",
                            "Standard Processing Speed",
                            "Limited Language Support",
                            "No Cloud Sync"
                        ]}
                    />

                    {/* PRO TIER */}
                    <PlanCard
                        title="PRO"
                        price={billingCycle === 'monthly' ? "₹349" : "₹3,499"}
                        color="neon-cyan"
                        icon={Zap}
                        planId="pro"
                        features={[
                            "Everything in Initiate",
                            "GitHub Secure Uplink (Sync)",
                            "Unlimited History Logs",
                            "Priority Execution Queue",
                            "Advanced AI Assistant",
                            "Pro Badge on Profile"
                        ]}
                    />

                    {/* ENTERPRISE TIER */}
                    <PlanCard
                        title="SYNDICATE"
                        price={billingCycle === 'monthly' ? "₹999" : "₹9,999"}
                        color="neon-magenta"
                        icon={Star}
                        planId="enterprise"
                        features={[
                            "Everything in Pro",
                            "Dedicated Server Node",
                            "Team Collaboration (Soon)",
                            "Custom Environments",
                            "24/7 Neural Support",
                            "Early Access features"
                        ]}
                    />
                </div>

                <div className="text-center mt-12">
                    <a href="/" className="text-xs text-gray-500 hover:text-white transition-colors tracking-widest border-b border-transparent hover:border-gray-500">
                        RETURN TO DASHBOARD
                    </a>
                </div>

            </div>
        </div>
    );
};

export default PricingPage;
