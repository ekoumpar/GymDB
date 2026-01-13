// Minimal toast utility — appends a toast element to the page and removes it after timeout
function ensureContainer(){
  let c = document.getElementById('app-toast-container');
  if(!c){
    c = document.createElement('div');
    c.id = 'app-toast-container';
    document.body.appendChild(c);
  }
  return c;
}

export function showToast(message, { type = 'success', timeout = 3500 } = {}){
  const container = ensureContainer();
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.textContent = message;
  container.appendChild(el);
  // trigger show animation
  requestAnimationFrame(()=> el.classList.add('toast--show'));
  const remove = () => {
    el.classList.remove('toast--show');
    el.addEventListener('transitionend', ()=> el.remove(), { once: true });
  };
  setTimeout(remove, timeout);
  // allow manual dismiss on click
  el.addEventListener('click', remove);
  return () => remove();
}

export default showToast;
