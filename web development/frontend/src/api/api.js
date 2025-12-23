import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export function setAuthToken(token){
  if(token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
}

export async function fetchClasses(){
  try{
    const res = await api.get('/classes');
    return res.data && res.data.classes ? res.data.classes : [];
  }catch(e){
    throw e;
  }
}

export async function fetchSchedule(){
  try{
    const res = await api.get('/schedule');
    return res.data && res.data.schedule ? res.data.schedule : [];
  }catch(e){
    throw e;
  }
}

export async function fetchTrainers(){
  try{
    const res = await api.get('/trainers');
    return res.data && res.data.trainers ? res.data.trainers : [];
  }catch(e){ throw e; }
}

export async function fetchMemberships(){
  try{
    const res = await api.get('/memberships');
    return res.data && res.data.memberships ? res.data.memberships : [];
  }catch(e){ throw e; }
}

export async function bookClass(classId){
  try{
    const res = await api.post(`/classes/${classId}/book`);
    return res.data;
  }catch(e){
    throw e;
  }
}

export async function login(identifier, password){
  try{
    // backend expects `username` for login
    const res = await api.post('/auth/login', { username: identifier, password });
    return res.data; // expected { token, user }
  }catch(e){
    throw e;
  }
}

export async function signup(name, password){
  try{
    // backend register expects `username` and `password`
    const res = await api.post('/auth/register', { username: name, password });
    return res.data; // expected { token, user }
  }catch(e){
    throw e;
  }
}

export default api;

export async function fetchUserBookings(){
  try{
    const res = await api.get('/bookings');
    return res.data && res.data.bookings ? res.data.bookings : [];
  }catch(e){
    throw e;
  }
}

export async function cancelBooking(bookingId){
  try{
    const res = await api.delete(`/bookings/${bookingId}`);
    return res.data;
  }catch(e){
    throw e;
  }
}
