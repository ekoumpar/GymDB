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

export async function bookClass(classInfo){
  try{
    // backend expects protected POST /register with member_id and either:
    // - reservation_id
    // - or workout/day/time
    const raw = localStorage.getItem('gymdb_user');
    const user = raw ? JSON.parse(raw) : null;
    const member_id = user && (user.id || user.member_id || user.userId);
    if(!member_id) throw new Error('Not authenticated');

    let payload = { member_id };
    if(!classInfo) throw new Error('classInfo required');

    if(typeof classInfo === 'string'){
      // legacy: treat as reservation_id or workout name
      payload.class_id = classInfo;
    } else if(typeof classInfo === 'object'){
      // accept { reservation_id } or { workout, day, time }
      if(classInfo.reservation_id) payload.reservation_id = classInfo.reservation_id;
      else if(classInfo.workout || classInfo.workout_type || classInfo.name){
        payload.workout = classInfo.workout || classInfo.workout_type || classInfo.name;
        payload.day = classInfo.day;
        payload.time = classInfo.time;
      } else if(classInfo.class_id){
        payload.class_id = classInfo.class_id;
      } else {
        throw new Error('Invalid classInfo');
      }
    } else {
      throw new Error('Invalid classInfo');
    }

    const res = await api.post('/register', payload);
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

export async function signup(name, password, details = {}){
  try{
    // backend register expects `username`, `password`, and member details
    const res = await api.post('/auth/register', {
      username: name,
      password,
      dateOfBirth: details.dateOfBirth || '',
      sex: details.sex || 'M',
      phoneNumber: details.phoneNumber || '',
      height: details.height || 0,
      weight: details.weight || 0
    });
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
