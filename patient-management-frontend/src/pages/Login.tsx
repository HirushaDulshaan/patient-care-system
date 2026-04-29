import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { LOGIN_MUTATION } from '../graphql/mutations';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

type LoginMutationData = {
  login: {
    access_token: string;
    user: {
      role: string;
    };
  };
};

type LoginMutationVariables = {
  email: string;
  password: string;
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [login, { loading }] = useMutation<LoginMutationData, LoginMutationVariables>(LOGIN_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ variables: { email, password } });

      if (response.data) {
        const token = response.data.login.access_token;
        const role = response.data.login.user.role;

        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        // Role එක අනුව අදාළ Dashboard එකට යවනවා
        switch (role) {
          case 'SUPER_ADMIN':
            navigate('/superadmin/dashboard');
            break;
          case 'ADMIN':
            navigate('/admin/dashboard');
            break;
          case 'DOCTOR':
            navigate('/doctor/dashboard');
            break;
          case 'RECEPTIONIST':
            navigate('/reception/register'); // Register page ekata yawamu direct
            break;
          case 'STAFF':
            navigate('/staff/dashboard');
            break;
          default:
            navigate('/'); // Patient nam home page ekata
        }
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-[1000px] w-full bg-white rounded-[3.5rem] shadow-2xl shadow-blue-500/5 border border-slate-100 overflow-hidden flex flex-col md:flex-row">

        {/* --- Left Side: Branding & Info --- */}
        <div className="w-full md:w-1/2 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="font-black italic text-xl">M</span>
              </div>
              <h1 className="text-xl font-black tracking-tighter">MEDICOS STAFF</h1>
            </div>

            <h2 className="text-5xl font-black leading-[0.9] tracking-tighter mb-6">
              Secure <br /> Access Portal.
            </h2>
            <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs uppercase tracking-widest text-[10px]">
              Authorized personnel only. Please enter your credentials to manage clinical operations.
            </p>
          </div>

          <div className="relative z-10 pt-10 border-t border-white/5">
            <div className="flex items-center gap-3 text-emerald-400">
              <ShieldCheck size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">End-to-End Encrypted</span>
            </div>
          </div>

          {/* Background Deco */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full"></div>
        </div>

        {/* --- Right Side: Login Form --- */}
        <div className="flex-1 p-12 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Sign In</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Hospital Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold text-sm text-slate-700"
                  placeholder="name@hospital.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold text-sm text-slate-700"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Validating...
                </>
              ) : (
                <>
                  Enter System <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            Contact IT Support if you forgot your password
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;