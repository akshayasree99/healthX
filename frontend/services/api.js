import axios from 'axios';

const api=axios.create(
    {
        baseURL:'http://localhost:5000/api'
    }

)
export const login=async(data)=>{
    return await api.post('/login',data);
}