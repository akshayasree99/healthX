import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChooseRole = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
                <h2 className="text-2xl font-bold mb-6">Register As</h2>
                <div className="flex flex-col gap-4">
                    <button 
                        onClick={() => navigate('/register/patientp')} 
                        className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
                    >
                        Register as Patient
                    </button>
                    <button 
                        onClick={() => navigate('/register/doctor')} 
                        className="bg-green-500 text-white p-3 rounded hover:bg-green-600"
                    >
                        Register as Doctor
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChooseRole;
