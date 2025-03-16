import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../supabase"; 
import { ArrowLeft, Stethoscope, User } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userType, setUserType] = useState("patient");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    specialty: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "doctor" || type === "patient") {
      setUserType(type);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // ✅ 1. Check if user already exists
      const { data: existingUser } = await supabase
        .from("Register")
        .select("email")
        .eq("email", formData.email)
        .single();

      if (existingUser) {
        setError("This email is already registered. Please log in.");
        setLoading(false);
        return;
      }

      // ✅ 2. Sign up user with email verification
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`, 
        },
      });

      if (error) throw error;

      const userId = data.user?.id;
      if (!userId) throw new Error("User ID not found. Please try again.");

      // ✅ 3. Insert into Register table
      const { error: registerError } = await supabase.from("Register").insert([
        {
          id: userId,
          email: formData.email,
          user_type: userType,
        },
      ]);

      if (registerError) throw registerError;

      // ✅ 4. Insert into Patient or Doctor table
      if (userType === "patient") {
        const { error: patientError } = await supabase.from("Patient").insert([
          {
            id: userId,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            dob: formData.dob,
          },
        ]);
        if (patientError) throw patientError;
      } else if (userType === "doctor") {
        const { error: doctorError } = await supabase.from("Doctor").insert([
          {
            id: userId,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            specialty: formData.specialty,
          },
        ]);
        if (doctorError) throw doctorError;
      }

      // ✅ 5. Inform user & redirect
      alert("Check your email for a verification link before logging in.");
      navigate("/login");
      
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="container flex min-h-screen w-full flex-col items-center justify-center bg-white py-8">
      <button onClick={() => navigate("/login")} className="absolute left-4 top-4 flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-3 py-1 rounded">
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-blue-900">Create an account</h1>
          <p className="text-sm text-gray-600">Register to access MediConnect</p>
        </div>

        <div className="flex bg-blue-100 rounded">
          <button className={`flex-1 py-2 ${userType === "patient" ? "bg-blue-600 text-white" : "text-blue-900"}`} onClick={() => setUserType("patient")}>
            <User className="inline-block h-4 w-4 mr-1" /> Patient
          </button>
          <button className={`flex-1 py-2 ${userType === "doctor" ? "bg-blue-600 text-white" : "text-blue-900"}`} onClick={() => setUserType("doctor")}>
            <Stethoscope className="inline-block h-4 w-4 mr-1" /> Doctor
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <h2 className="text-blue-800">{userType === "patient" ? "Patient" : "Doctor"} Registration</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-blue-800">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full border p-2 rounded focus:border-blue-400" />
            </div>
            <div>
              <label className="text-blue-800">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full border p-2 rounded focus:border-blue-400" />
            </div>
          </div>

          <div>
            <label className="text-blue-800">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border p-2 rounded focus:border-blue-400" />
          </div>

          <div>
            <label className="text-blue-800">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full border p-2 rounded focus:border-blue-400" />
          </div>
          <div>
            <label className="text-blue-800">Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full border p-2 rounded focus:border-blue-400" />
          </div>

          {userType === "patient" && (
            <div>
              <label className="text-blue-800">Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full border p-2 rounded focus:border-blue-400" />
            </div>
          )}

          {userType === "doctor" && (
            <div>
              <label className="text-blue-800">Specialty</label>
              <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} required className="w-full border p-2 rounded focus:border-blue-400" />
            </div>
          )}

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}