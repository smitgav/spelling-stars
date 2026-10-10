/* Shared friendly spelling-list picker for all games. Native select stays as the source of truth. */
(function(){
function init(){
 const select=document.getElementById('list');if(!select||select.dataset.friendlyPicker)return;
 select.dataset.friendlyPicker='true';
 const style=document.createElement('style');style.textContent=`
 #list.friendly-native-select{position:absolute!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important;padding:0!important;margin:0!important}
 .friendly-list-trigger{display:flex!important;align-items:center;gap:10px;justify-content:space-between;width:100%;max-width:100%;min-width:0;box-sizing:border-box;text-align:left;background:#f3edff!important;color:#39237f!important;border:2px solid #a68be5!important;border-radius:15px!important;padding:12px 14px!important;margin:8px 0!important;font-weight:800!important;box-shadow:none!important}
 .friendly-list-trigger span:nth-child(2){flex:1;min-width:0;overflow-wrap:anywhere}
 dialog.friendly-list-dialog{border:0;border-radius:24px;padding:0;width:min(92vw,490px);max-width:92vw;max-height:86dvh;box-sizing:border-box;color:#30234f;box-shadow:0 24px 75px #23134c65}
 dialog.friendly-list-dialog::backdrop{background:#201344a8;backdrop-filter:blur(5px)}
 .friendly-list-inner{box-sizing:border-box;padding:20px;background:linear-gradient(150deg,#fff9e8,#f0eaff);max-height:86dvh;overflow-y:auto;text-align:center}
 .friendly-list-inner h2{font-size:1.5rem;margin:5px 0}.friendly-list-inner p{margin:6px 0 14px}
 .friendly-list-options{display:grid;gap:10px;margin:12px 0}
 .friendly-list-option{display:flex!important;align-items:center;gap:12px;width:100%;text-align:left;margin:0!important;padding:13px!important;background:#fff!important;color:#332451!important;border:2px solid #ddd3f4!important;border-radius:15px!important;box-shadow:none!important;font:700 .95rem system-ui,sans-serif!important;white-space:normal}
 .friendly-list-option[aria-pressed="true"]{border-color:#6d4bd1!important;background:#eee7ff!important}
 .friendly-list-copy{flex:1;min-width:0;overflow-wrap:anywhere}.friendly-list-copy small{display:block;color:#6b617f;font-size:.78rem;font-weight:500;margin-top:4px}
 .friendly-list-check{font-size:1.4rem;color:#6845ce}
 .friendly-list-close{margin:8px 0 0!important;background:#e9e3ff!important;color:#45349d!important}
 @media(max-width:600px){.friendly-list-trigger{font-size:.9rem!important;padding:10px 12px!important}.friendly-list-inner{padding:14px}.friendly-list-option{padding:12px!important;font-size:.9rem!important}}
 `;document.head.append(style);
 select.classList.add('friendly-native-select');
 const trigger=document.createElement('button');trigger.type='button';trigger.className='friendly-list-trigger';trigger.setAttribute('aria-haspopup','dialog');trigger.innerHTML='<span aria-hidden="true">📚</span><span class="friendly-current">Choose your spelling list</span><span aria-hidden="true">⌄</span>';select.insertAdjacentElement('afterend',trigger);
 const dialog=document.createElement('dialog');dialog.className='friendly-list-dialog';dialog.setAttribute('aria-label','Choose your spelling list');dialog.innerHTML='<div class="friendly-list-inner"><h2>📚 Choose your words</h2><p>Pick a spelling challenge to practise.</p><div class="friendly-list-options"></div><button type="button" class="friendly-list-close">Close</button></div>';document.body.append(dialog);
 const options=dialog.querySelector('.friendly-list-options');
 function refresh(){const active=select.selectedOptions[0];trigger.querySelector('.friendly-current').textContent=active?.textContent||'Choose your spelling list';options.replaceChildren();Array.from(select.options).forEach((opt,i)=>{const b=document.createElement('button');b.type='button';b.className='friendly-list-option';b.setAttribute('aria-pressed',String(opt.value===select.value));const icon=document.createElement('span');icon.textContent=['📚','✏️','🧩','🌟'][i%4];const copy=document.createElement('span');copy.className='friendly-list-copy';const title=document.createElement('strong');title.textContent=opt.textContent;copy.append(title);const check=document.createElement('span');check.className='friendly-list-check';check.textContent=opt.value===select.value?'✓':'○';b.append(icon,copy,check);b.onclick=()=>{select.value=opt.value;select.dispatchEvent(new Event('change',{bubbles:true}));refresh();dialog.close();trigger.focus()};options.append(b)})}
 trigger.onclick=()=>{refresh();dialog.showModal()};dialog.querySelector('.friendly-list-close').onclick=()=>dialog.close();select.addEventListener('change',refresh);
 const observer=new MutationObserver(()=>refresh());observer.observe(select,{childList:true,subtree:true,attributes:false});
 refresh();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();