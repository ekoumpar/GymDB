export function formatDate(value){
  if(!value) return '';
  try{
    const d = new Date(value);
    if(isNaN(d)) return String(value);
    return d.toLocaleString();
  }catch(e){
    return String(value);
  }
}

export default { formatDate };
