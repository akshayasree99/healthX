import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase.js'; // Ensure you have configured Supabase client

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
  
    // Step 1: Authenticate User
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
  
    if (authError || !authData.user) {
      setErrorMsg('Invalid email or password');
      return;
    }
  
    const userId = authData.user.id;
  
    // Step 2: Fetch user type
    const { data: userData, error: userError } = await supabase
      .from('register')
      .select('user_type')
      .eq('id', userId)
      .single();
  
    if (userError || !userData) {
      setErrorMsg('Failed to fetch user type');
      return;
    }
  
    // Step 3: Redirect Based on User Type
    if (userData.user_type === 'patient') {
      // Step 4: Fetch Patient ID for Unique Dashboard
      const { data: patientData, error: patientError } = await supabase
        .from('patient')
        .select('patient_id')
        .eq('id', userId)
        .single();
  
      if (patientError || !patientData) {
        setErrorMsg('Patient record not found');
        return;
      }
  
      // Redirect to patient-specific dashboard with ID
      navigate(`/patient/dashboard/${patientData.patient_id}`);
    } else if (userData.user_type === 'doctor') {
      navigate('/doctor/dashboard');
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        {errorMsg && <p className="text-red-500 text-center mb-4">{errorMsg}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            onClick={handleRegister}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
