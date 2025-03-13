import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Register from './Register/RegisterP';


export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const navigate=useNavigate();
  const handleRegister=()=>{
    navigate('/register');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        <form>
          
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-center">
          {"Don't have an account?"}
          <button
            className="text-blue-500 ml-2 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            <span onClick={handleRegister('/register')}>Register</span>
          </button>
        </p>
      </div>
    </div>
  );
}
