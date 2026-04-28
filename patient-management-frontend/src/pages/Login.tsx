import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { LOGIN_MUTATION } from '../graphql/mutations'; // Import eka udata gaththa

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

  // Backend ekata data yawana Hook eka
  const [login, { loading }] = useMutation<LoginMutationData, LoginMutationVariables>(LOGIN_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ variables: { email, password } });

      if (response.data) {
        const token = response.data.login.access_token;
        const role = response.data.login.user.role;

        // Token eka browser eke save karagannawa
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        alert(`Login Success! Welcome ${role}`);
        console.log('--- Backend Response Data ---');
        console.log('Token:', token);
        console.log('User Role:', role);
        console.log('Full Data:', response.data);

        // Dan page eka reload wenna hari dashboard ekata yanna kiyanna puluwan
        // window.location.href = '/dashboard'; 
      }
    } catch (err) {
      console.error('Login error:', err);
      alert("Login Failed! Check your email and password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
              placeholder="hirusha@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;