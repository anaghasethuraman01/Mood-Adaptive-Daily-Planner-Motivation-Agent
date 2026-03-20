import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Calendar,
  Settings,
  Brain,
  BookOpen,
  Loader2,
  LogOut
} from 'lucide-react';
import { insforge } from './lib/insforge';

type Task = {
  task: string;
  duration_min: number;
  priority: number;
};

type PlannerResponse = {
  motivation_message: string;
  daily_plan: Task[];
  micro_activity: string;
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'verify'>('login');
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [mood, setMood] = useState('focused');
  const [energy, setEnergy] = useState(3);
  const [time, setTime] = useState(60);
  const [goals, setGoals] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlannerResponse | null>(null);

  useEffect(() => {
    async function checkUser() {
      const { data } = await insforge.auth.getCurrentUser();
      if (data?.user) {
        setUser(data.user);
      }
      setIsLoaded(true);
    }
    checkUser();
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const handleSignOut = async () => {
    await insforge.auth.signOut();
    setUser(null);
    window.location.reload();
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await insforge.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });
      if (error) throw error;
      if (data) window.location.reload();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await insforge.auth.signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name
      });
      if (error) throw error;
      if (data?.requireEmailVerification) {
        setAuthMode('verify');
      } else {
        alert('Account created! Please log in.');
        setAuthMode('login');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  console.log('App Session Status:', user ? 'Logged In' : 'Logged Out');

  const generatePlan = async () => {
    setLoading(true);
    try {
      const { data, error } = await insforge.functions.invoke('generate-plan', {
        body: { mood, energy, time, goals }
      });

      if (error) throw error;
      setPlan(data);
    } catch (err: any) {
      console.error(err);
      alert('Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const moods = ['Focused', 'Lazy', 'Energetic', 'Stressed', 'Calm', 'Bored'];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-indigo-400" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 font-outfit">
            MoodPlanner AI
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {!user ? (
            <div className="opacity-0">Auth Loading...</div>
          ) : (
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto">
        {!user && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            {/* Hero Header */}
            <div className="text-center mb-10">
              <Brain className="w-16 h-16 mx-auto mb-6 text-indigo-400" />
              <h2 className="text-4xl font-bold mb-4 font-outfit">Unlock Your Best Self</h2>
              <p className="text-slate-400 text-lg max-w-lg mx-auto">
                {authMode === 'verify' 
                  ? "Almost there! We've sent you a link." 
                  : "Get a personalized daily plan adapted to your mood and energy level."}
              </p>
            </div>

            {/* Auth Card */}
            <div className="glass-card p-8 w-full max-w-md">
              <AnimatePresence mode="wait">
                {authMode === 'verify' ? (
                  <motion.div
                    key="verify"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center py-4"
                  >
                    <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Check Your Email</h3>
                    <p className="text-slate-400 text-sm mb-6">
                      We've sent a verification link to <span className="text-indigo-400 font-medium">{formData.email}</span>. Click it to activate your account.
                    </p>
                    <button 
                      onClick={() => setAuthMode('login')}
                      className="text-indigo-400 text-sm font-bold hover:underline"
                    >
                      Back to Login
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={authMode === 'login' ? handleSignIn : handleSignUp}
                    className="space-y-4"
                  >
                    {authMode === 'signup' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Display Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="glass-input w-full"
                          placeholder="Your unique name"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="glass-input w-full"
                        placeholder="name@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="glass-input w-full"
                        placeholder="••••••••"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="premium-button w-full mt-4 flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (authMode === 'login' ? 'Sign In' : 'Create Account')}
                      {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>

                    <p className="text-center text-sm text-slate-500 mt-6">
                      {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
                      <button
                        type="button"
                        onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                        className="text-indigo-400 font-bold ml-1 hover:underline"
                      >
                        {authMode === 'login' ? 'Sign Up' : 'Log In'}
                      </button>
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Test Account Section - Subtle */}
            {authMode !== 'verify' && (
              <div className="mt-12 text-center">
                <p className="text-slate-500 text-sm mb-4">Want to skip the form?</p>
                <button 
                  onClick={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    try {
                      const { data, error } = await insforge.auth.signInWithPassword({
                        email: 'testuser@example.com',
                        password: 'Password123!'
                      });
                      if (data) window.location.reload();
                      if (error) alert(error.message);
                    } catch (err: any) {
                      alert(err.message);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="bg-white/5 border border-white/10 hover:border-indigo-500/50 rounded-2xl px-8 py-3 transition-all flex items-center gap-3 text-sm font-medium group"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-500 group-hover:animate-ping" />
                  Sign in as Test User
                </button>
              </div>
            )}
          </motion.div>
        )}

        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="glass-card p-8"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 font-outfit">
                <Settings className="w-6 h-6 text-indigo-400" />
                Plan Settings
              </h2>

              <div className="space-y-6">
                {/* Mood Selector */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-400">Current Mood</label>
                  <div className="flex flex-wrap gap-2">
                    {moods.map((m) => (
                      <button
                        key={m}
                        onClick={() => setMood(m.toLowerCase())}
                        className={`mood-tag ${mood === m.toLowerCase() ? 'selected' : ''}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Energy Slider */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-400 flex justify-between">
                    Energy Level <span>{energy}/5</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={energy}
                    onChange={(e) => setEnergy(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-xs mt-2 text-slate-500">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                {/* Time Input */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-400">Available Time (mins)</label>
                  <input
                    type="number"
                    value={time}
                    onChange={(e) => setTime(parseInt(e.target.value))}
                    className="glass-input w-full"
                    placeholder="e.g., 60"
                  />
                </div>

                {/* Goals Input */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-400">Goals (comma separated)</label>
                  <textarea
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    className="glass-input w-full h-24 pt-3"
                    placeholder="e.g., wash car, laundry, work"
                  />
                </div>

                <button
                  onClick={generatePlan}
                  disabled={loading}
                  className="premium-button w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Daily Plan
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Results Section */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {plan ? (
                  <motion.div
                    key="plan"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-6"
                  >
                    {/* Motivation Message */}
                    <div className="glass-card p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border-indigo-500/30">
                      <Sparkles className="w-6 h-6 text-yellow-400 mb-2" />
                      <p className="text-xl italic text-slate-100 font-medium">
                        "{plan.motivation_message}"
                      </p>
                    </div>

                    {/* Task List */}
                    <div className="glass-card p-6">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 font-outfit">
                        <Calendar className="w-5 h-5 text-indigo-400" />
                        Today's Plan
                      </h3>
                      <div className="space-y-3">
                        {plan.daily_plan.map((t, index) => (
                          <motion.div
                            key={index}
                            variants={itemVariants}
                            className={`flex items-center gap-4 p-4 rounded-xl border ${
                              t.priority === 1 ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-white/5 border-white/5'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              t.priority === 1 ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'
                            }`}>
                              {t.priority}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">{t.task}</p>
                              <p className="text-sm text-slate-500">{t.duration_min} mins</p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-slate-600 hover:text-indigo-400 cursor-pointer transition-colors" />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Micro Activity */}
                    <div className="glass-card p-6 border-emerald-500/30 bg-emerald-500/5">
                      <h3 className="text-lg font-bold mb-2 flex items-center gap-2 font-outfit">
                        <BookOpen className="w-5 h-5 text-emerald-400" />
                        Micro Activity
                      </h3>
                      <p className="text-emerald-100/80">
                        {plan.micro_activity}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card p-12 text-center h-full flex flex-col justify-center items-center opacity-50"
                  >
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                      <Zap className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="text-lg font-medium text-slate-400">
                      Your personalized plan will appear here
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>

      {/* Footer Disclaimer */}
      <footer className="max-w-4xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>© 2026 MoodPlanner AI. Not a replacement for professional clinical help.</p>
        <p className="mt-2">Made with InsForge & Gemini</p>
      </footer>
    </div>
  );
}
