/* Shared Year 5 term/week picker for all spelling games. */
(function(){
function init(){
 const select=document.getElementById('list');if(!select||select.dataset.termPicker)return;
 select.dataset.termPicker='true';
 const customTrigger=document.getElementById('chooseList');
 const style=document.createElement('style');style.textContent=`
 #list.term-native{position:absolute!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important}
 .term-trigger{display:flex!important;align-items:center;gap:10px;justify-content:space-between;width:100%;text-align:left;background:#f3edff!important;color:#39237f!important;border:2px solid #a68be5!important;border-radius:15px!important;padding:12px!important;margin:8px 0!important;font-weight:800!important}
 .term-trigger .term-current{flex:1;min-width:0;overflow-wrap:anywhere}
 dialog.term-dialog{border:0;border-radius:24px;padding:0;width:min(94vw,520px);max-width:94vw;max-height:88dvh;color:#30234f;box-shadow:0 24px 75px #23134c65}
 dialog.term-dialog::backdrop{background:#201344a8}
 .term-inner{padding:16px;background:linear-gradient(150deg,#fff9e8,#f0eaff);max-height:88dvh;overflow-y:auto;box-sizing:border-box}
 .term-inner h2{font-size:1.4rem;margin:4px 0 10px;text-align:center}
 .term-tabs,.term-grid{display:grid;gap:7px;margin:10px 0}
 .term-tabs{grid-template-columns:1fr 1fr}.term-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
 .term-tab,.term-chip,.term-option{font:700 .9rem system-ui,sans-serif!important;color:#38255e!important;background:white!important;border:2px solid #ddd3f4!important;border-radius:13px!important;padding:12px 8px!important;margin:0!important;box-shadow:none!important;white-space:normal}
 .term-tab[aria-pressed=true],.term-chip[aria-pressed=true],.term-option[aria-pressed=true]{background:#eae2ff!important;border-color:#6845ce!important}
 .term-options{display:grid;gap:8px;margin:10px 0}.term-option{display:flex!important;align-items:center;justify-content:space-between;text-align:left;padding:12px!important}
 .term-option small{display:block;color:#6b617f;font-weight:500;margin-top:4px;font-size:.78rem}
 .term-heading{font-size:.85rem;font-weight:800;color:#54428a;margin:14px 0 6px}
 .term-close{width:100%;background:#6852d5!important;color:white!important;margin:8px 0 0!important}
 `;document.head.append(style);
 select.classList.add('term-native');
 const trigger=customTrigger||document.createElement('button');
 if(!customTrigger){trigger.type='button';trigger.className='term-trigger';trigger.innerHTML='<span>📚</span><span class="term-current"></span><span>⌄</span>';select.insertAdjacentElement('afterend',trigger)}
 const label=customTrigger?document.getElementById('chosenList'):trigger.querySelector('.term-current');
 const dialog=document.createElement('dialog');dialog.className='term-dialog';dialog.setAttribute('aria-label','Choose your spelling list');
 dialog.innerHTML='<div class="term-inner"><h2>📚 Choose your words</h2><div class="term-tabs"></div><div class="term-content"></div><button class="term-close" type="button">Close</button></div>';
 document.body.append(dialog);
 const tabs=dialog.querySelector('.term-tabs'),content=dialog.querySelector('.term-content');
 const terms=['Autumn 1','Autumn 2','Spring 1','Spring 2','Summer 1','Summer 2'];
 const key='school-is-cool-last-spelling-list-v1';
 let view='year',term='Autumn 1';
 function names(){return Array.from(select.options).map(o=>o.value).filter(Boolean)}
 function parse(n){const m=/^Y5 (Autumn [12]|Spring [12]|Summer [12]) – Week ([1-6]) – (.+)$/.exec(n);return m?{term:m[1],week:Number(m[2]),focus:m[3]}:null}
 function choose(name){if(!names().includes(name))return;select.value=name;try{localStorage.setItem(key,name)}catch{}select.dispatchEvent(new Event('change',{bubbles:true}));updateLabel();dialog.close();trigger.focus()}
 function updateLabel(){label.textContent=select.value||'Choose your spelling list'}
 function button(text,active,fn,cls='term-chip'){const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=text;b.setAttribute('aria-pressed',String(active));b.onclick=fn;return b}
 function render(){
  tabs.replaceChildren();content.replaceChildren();
  tabs.append(button('🎓 Year 5',view==='year',()=>{view='year';render()},'term-tab'),button('📚 Other lists',view==='other',()=>{view='other';render()},'term-tab'));
  if(view==='year'){
   const heading=document.createElement('div');heading.className='term-heading';heading.textContent='1. Choose your term';content.append(heading);
   const grid=document.createElement('div');grid.className='term-grid';terms.forEach(t=>grid.append(button((t.startsWith('Autumn')?'🍂 ':t.startsWith('Spring')?'🌷 ':'☀️ ')+t,t===term,()=>{term=t;render()})));content.append(grid);
   const heading2=document.createElement('div');heading2.className='term-heading';heading2.textContent='2. Choose your week';content.append(heading2);
   const opts=document.createElement('div');opts.className='term-options';
   names().forEach(n=>{const p=parse(n);if(!p||p.term!==term)return;const b=document.createElement('button');b.type='button';b.className='term-option';b.setAttribute('aria-pressed',String(n===select.value));const txt=document.createElement('span');const strong=document.createElement('strong');strong.textContent='Week '+p.week;const small=document.createElement('small');small.textContent=p.focus;txt.append(strong,small);const check=document.createElement('span');check.textContent=n===select.value?'✓':'›';b.append(txt,check);b.onclick=()=>choose(n);opts.append(b)});content.append(opts);
   if(!opts.children.length){const p=document.createElement('p');p.textContent='Loading Year 5 lists…';content.append(p)}
  }else{
   const opts=document.createElement('div');opts.className='term-options';names().filter(n=>!parse(n)).forEach(n=>opts.append(button(n+(n===select.value?' ✓':''),n===select.value,()=>choose(n),'term-option')));content.append(opts);
  }
 }
 function open(){const p=parse(select.value);if(p){view='year';term=p.term}else if(!names().some(n=>parse(n))){view='other'}render();dialog.showModal()}
 trigger.onclick=open;
 dialog.querySelector('.term-close').onclick=()=>dialog.close();
 select.addEventListener('change',()=>{updateLabel();if(select.value)try{localStorage.setItem(key,select.value)}catch{}});
 let restored=false;
 function sync(){if(!restored&&names().length){restored=true;let saved;try{saved=localStorage.getItem(key)}catch{}if(saved&&names().includes(saved)){select.value=saved;select.dispatchEvent(new Event('change',{bubbles:true}))}}updateLabel();if(dialog.open)render()}
 const observer=new MutationObserver(sync);observer.observe(select,{childList:true});sync();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();