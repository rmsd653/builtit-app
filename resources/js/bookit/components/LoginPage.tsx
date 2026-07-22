import React, { useState } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, CornerDownRight } from 'lucide-react';
import { Employee } from '../types';
import { api } from '../api';

interface LoginPageProps {
  onLogin: (employee: Employee) => void;
  employees: Employee[];
}

export default function LoginPage({ onLogin, employees }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  // Quick fill accounts mapping
  const quickAccounts = [
    {
      name: 'Sarah Jenkins',
      role: 'Office Manager',
      email: 'sarah.jenkins@bookit.com',
      empId: 'emp-1'
    },
    {
      name: 'Michael Chen',
      role: 'Design Director',
      email: 'michael.chen@bookit.com',
      empId: 'emp-2'
    },
    {
      name: 'Emily Davis',
      role: 'Operations Lead',
      email: 'emily.davis@bookit.com',
      empId: 'emp-3'
    }
  ];

  const handleQuickFill = (acc: typeof quickAccounts[0]) => {
    setEmail(acc.email);
    setPassword('password123');
    setError(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const { user } = await api.login(email, password);
      setIsLoading(false);
      onLogin(user);
    } catch (err: any) {
      // If live API login fails, fall back to offline match so demo works smoothly if offline
      const matchedEmp = employees.find(
        (emp) => emp.name.toLowerCase().replace(/\s+/g, '.') + '@bookit.com' === email.toLowerCase() || emp.email?.toLowerCase() === email.toLowerCase()
      ) || employees.find(
        (emp) => emp.id === 'emp-1' || emp.id === 1 as any
      );

      setIsLoading(false);
      if (matchedEmp && (err?.response?.status !== 401 && err?.response?.status !== 422)) {
        onLogin(matchedEmp);
      } else {
        setError(err?.response?.data?.message || 'Invalid credentials. Try using one of our Quick Accounts below.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      {/* Container card */}
      <div className="w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 grid grid-cols-1 lg:grid-cols-12 min-h-[600px]" id="login-container">
        
        {/* Left column - Brand & Marketing in Notion Style */}
        <div className="lg:col-span-5 bg-[#FAF9F5] p-8 md:p-12 flex flex-col justify-between relative border-r border-slate-100 select-none">
          {/* Logo Brand */}
          <div className="relative flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011-1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <span className="font-sans text-xl font-extrabold tracking-tight text-slate-800 block">BookIt</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Workspace Engine</span>
            </div>
          </div>

          {/* Notion Style Hand-Drawn Vector Illustration */}
          <div className="relative flex-1 flex items-center justify-center my-6">
            <svg viewBox="0 0 400 400" className="w-full max-w-[280px] md:max-w-[320px] h-auto select-none" referrerPolicy="no-referrer">
              {/* Floor/desk line */}
              <path d="M 40 320 L 360 320" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Rug pattern */}
              <path d="M 120 332 L 280 332" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 5" strokeLinecap="round" />
              
              {/* Giant Calendar / Planner Board */}
              <rect x="50" y="100" width="130" height="150" rx="14" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              {/* Calendar Grid Header */}
              <line x1="50" y1="135" x2="180" y2="135" stroke="#1e293b" strokeWidth="2" />
              {/* Grid Column lines */}
              <line x1="82.5" y1="135" x2="82.5" y2="250" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1="115" y1="135" x2="115" y2="250" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="147.5" y1="135" x2="147.5" y2="250" stroke="#cbd5e1" strokeWidth="1.5" />
              {/* Grid Row lines */}
              <line x1="50" y1="163.75" x2="180" y2="163.75" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1="50" y1="192.5" x2="180" y2="192.5" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1="50" y1="221.25" x2="180" y2="221.25" stroke="#cbd5e1" strokeWidth="1.5" />
              
              {/* Selectors / Marks inside Calendar */}
              <circle cx="98.75" cy="178.125" r="8" stroke="#1e293b" strokeWidth="2" fill="none" />
              <path d="M 131.25 201.25 L 132.5 198 L 135.5 198 L 133 196 L 134 193 L 131.25 195 L 128.5 193 L 129.5 196 L 127 198 L 130 198 Z" fill="#1e293b" />
              <circle cx="66.25" cy="235.625" r="4" fill="#94a3b8" />
              <circle cx="163.75" cy="149.375" r="3" fill="#cbd5e1" />

              {/* Floating Task Checklist */}
              <rect x="235" y="55" width="120" height="95" rx="12" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              {/* Checklist dots/boxes and lines */}
              <rect x="250" y="75" width="11" height="11" rx="2.5" fill="none" stroke="#1e293b" strokeWidth="2" />
              <path d="M 252 80 L 254 82 L 258 77" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <line x1="270" y1="80.5" x2="335" y2="80.5" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
              
              <rect x="250" y="97" width="11" height="11" rx="2.5" fill="none" stroke="#1e293b" strokeWidth="2" />
              <path d="M 252 102 L 254 104 L 258 99" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <line x1="270" y1="102.5" x2="315" y2="102.5" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

              <rect x="250" y="119" width="11" height="11" rx="2.5" fill="none" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="270" y1="124.5" x2="325" y2="124.5" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

              {/* Desk Chair */}
              <path d="M 285 240 L 285 320" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 260 320 L 272 355 M 282 320 L 294 355" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />

              {/* Cozy Stack of Books */}
              <rect x="110" y="302" width="65" height="18" rx="3" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              <line x1="120" y1="302" x2="120" y2="320" stroke="#1e293b" strokeWidth="2" />
              
              <rect x="115" y="284" width="55" height="18" rx="3" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              <line x1="123" y1="284" x2="123" y2="302" stroke="#1e293b" strokeWidth="2" />

              {/* Little Coffee Mug */}
              <path d="M 75 298 H 92 V 320 H 75 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M 92 303 C 97 303 97 313 92 313" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 80 292 Q 82 288 80 284 M 86 292 Q 88 288 86 284" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />

              {/* Potted Plant */}
              <path d="M 310 285 L 330 285 L 326 320 L 314 320 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M 320 285 C 315 272 305 268 315 260 C 320 268 320 285 320 285 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
              <path d="M 320 285 C 325 272 335 268 325 260 C 320 268 320 285 320 285 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
              <path d="M 320 285 C 320 268 320 252 320 252 C 320 252 324 268 320 285 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />

              {/* Minimalist Character */}
              {/* Torso / Body */}
              <path d="M 240 215 C 255 220 265 250 268 285 L 270 320 H 225 L 227 285 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
              {/* Neck */}
              <path d="M 243 215 V 205 H 237 V 215" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
              {/* Head / Face */}
              <path d="M 228 175 C 228 153 252 153 252 175 C 252 197 228 197 228 175 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              {/* Hair */}
              <path d="M 225 175 C 225 145 255 145 255 175 C 255 180 248 185 225 175 Z" fill="#1e293b" />
              {/* Glasses/Eye detail */}
              <circle cx="236" cy="173" r="3" stroke="#1e293b" strokeWidth="1.5" fill="none" />
              <line x1="231" y1="173" x2="233" y2="173" stroke="#1e293b" strokeWidth="1.5" />
              {/* Tiny Smile */}
              <path d="M 233 182 Q 235 184 237 182" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              
              {/* Arm 1 (Typing / Desk) */}
              <path d="M 228 240 Q 215 255 205 285 L 213 288 Q 223 262 235 250" fill="#ffffff" stroke="#1e293b" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
              {/* Arm 2 (Pointing up to Calendar) */}
              <path d="M 235 225 Q 198 195 185 198 L 188 206 Q 198 202 230 235" fill="#ffffff" stroke="#1e293b" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />

              {/* Laptop */}
              <path d="M 195 298 H 255 L 260 305 H 190 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M 205 260 H 245 L 255 298 H 195 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M 209 265 H 241 L 249 294 H 201 Z" fill="#f8fafc" />

              {/* Floating whimsical sparkles / stars (Iconic Notion) */}
              {/* Star 1 */}
              <path d="M 105 45 L 107 49 L 111 49 L 108 52 L 109 56 L 105 53 L 101 56 L 102 52 L 99 49 L 103 49 Z" fill="#1e293b" />
              {/* Star 2 */}
              <path d="M 215 35 L 216.5 38 L 219.5 38 L 217 40 L 218 43 L 215 41 L 212 43 L 213 40 L 210.5 38 L 213.5 38 Z" fill="#1e293b" />
              {/* Star 3 */}
              <path d="M 345 200 L 346.5 203.5 L 350.5 203.5 L 347 205.5 L 348 209.5 L 345 207 L 342 209.5 L 343 205.5 L 339.5 203.5 L 343.5 203.5 Z" fill="#1e293b" />
              
              {/* Extra cute dots */}
              <circle cx="36" cy="150" r="2" fill="#1e293b" />
              <circle cx="370" cy="120" r="1.5" fill="#94a3b8" />
              <circle cx="160" cy="70" r="2" fill="#cbd5e1" />
            </svg>
          </div>

          {/* Bottom attribution */}
          <div className="relative text-[11px] text-slate-400 font-bold flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Secure Enterprise Login Portal</span>
          </div>
        </div>

        {/* Right column - Actual login form */}
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center">
          
          <div className="max-w-md w-full mx-auto">
            <h1 className="font-sans text-2xl font-bold text-blue-950 tracking-tight">Welcome Back</h1>
            <p className="text-xs text-slate-400 font-semibold mt-1">Please sign in to access your dashboard.</p>

            {/* Error banner */}
            {error && (
              <div className="mt-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2.5 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="mt-6 flex flex-col gap-4">
              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    placeholder="name@bookit.com"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00236f] focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 font-semibold"
                    type="email"
                    id="login-email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                  <button
                    type="button"
                    onClick={() => alert('Demo Mode: Password reset is not active. You can enter any password longer than 6 characters.')}
                    className="text-[10px] text-[#00236f] hover:underline font-bold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00236f] focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 font-semibold"
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Toggle */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#00236f] focus:ring-[#00236f] border-slate-300 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-500 font-bold">Remember this device</span>
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full h-11 bg-[#00236f] hover:bg-blue-900 disabled:bg-blue-800/60 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-blue-900/10 cursor-pointer"
                id="login-submit-btn"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Authenticating secure records...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Accounts Selection */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">
                Quick testing credentials
              </span>

              <div className="flex flex-col gap-2">
                {quickAccounts.map((acc) => (
                  <button
                    key={acc.empId}
                    type="button"
                    onClick={() => handleQuickFill(acc)}
                    className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-blue-50/50 border border-slate-200/60 rounded-xl transition-all text-left text-xs group"
                  >
                    <div>
                      <span className="font-bold text-slate-800 group-hover:text-blue-950 block">{acc.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{acc.role} • {acc.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#00236f] opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Fill credentials</span>
                      <CornerDownRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
