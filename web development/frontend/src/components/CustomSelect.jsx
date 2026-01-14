import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// CustomSelect: accessible dropdown rendered in a portal. Handles keyboard
// navigation, positions the list relative to the button, and returns selected value.
export default function CustomSelect({ value, onChange, options = [], id, ariaLabel, placeholder = 'Select' }){
  const [open, setOpen] = useState(false);
  const [listStyle, setListStyle] = useState(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  useEffect(()=>{
    function onDoc(e){
      if(!buttonRef.current) return;
      if(buttonRef.current.contains(e.target)) return;
      if(listRef.current && listRef.current.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener('pointerdown', onDoc);
    return ()=> document.removeEventListener('pointerdown', onDoc);
  },[]);

  useEffect(()=>{
    if(open && listRef.current){
      const sel = listRef.current.querySelector('[role="option"]');
      if(sel) sel.focus();
    }
  },[open]);

  // compute portal position when opening
  useEffect(()=>{
    if(!open) return;
    function updatePos(){
      const btn = buttonRef.current;
      if(!btn) return;
      const r = btn.getBoundingClientRect();
      const top = r.bottom + 8 + window.scrollY;
      const left = r.left + window.scrollX;
      setListStyle({ top, left, width: r.width });
    }
    updatePos();
    window.addEventListener('resize', updatePos);
    window.addEventListener('scroll', updatePos, true);
    return ()=>{ window.removeEventListener('resize', updatePos); window.removeEventListener('scroll', updatePos, true); };
  },[open]);

  function toggle(){ setOpen(s => !s); }
  function handleKey(e){
    if(e.key === 'ArrowDown'){ e.preventDefault(); setOpen(true); }
    if(e.key === 'Escape'){ setOpen(false); buttonRef.current?.focus(); }
  }

  function onSelect(opt){
    onChange && onChange(opt.value);
    setOpen(false);
    buttonRef.current?.focus();
  }

  const selected = options.find(o=>o.value===value);
  const currentLabel = selected ? selected.label : placeholder;

  return (
    <div className="custom-select" id={id}>
      {/* Button opens the listbox; uses ARIA attributes for accessibility */}
      <button
        type="button"
        ref={buttonRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="custom-select__button"
        onClick={toggle}
        onKeyDown={handleKey}
      >
        <span className={`custom-select__label ${selected ? '' : 'is-placeholder'}`}>{currentLabel}</span>
        <span className="custom-select__chev" aria-hidden>▾</span>
      </button>

      {open && listStyle && createPortal(
        <ul
          role="listbox"
          tabIndex={-1}
          ref={listRef}
          className="custom-select__list custom-select__list--portal"
          aria-activedescendant={selected ? selected.value : undefined}
          style={{position:'absolute',left:listStyle.left,top:listStyle.top,width:listStyle.width}}
        >
          {options.map(opt => (
            <li
              key={opt.value}
              id={opt.value}
              role="option"
              tabIndex={0}
              aria-selected={opt.value===value}
              className={`custom-select__item ${opt.value===value ? 'is-selected' : ''}`}
              onClick={()=>onSelect(opt)}
              onKeyDown={e=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); onSelect(opt); } }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      , document.body)}
    </div>
  );
}
