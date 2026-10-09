/* Instant built-in lists, generated from the JSON files. JSON remains the editable source. */
const DEFAULT_SPELLING_LISTS={"England Years 5–6 statutory words":["accommodate","accompany","according","achieve","aggressive","amateur","ancient","apparent","appreciate","attached","available","average","awkward","bargain","bruise","category","cemetery","committee","communicate","community","competition","conscience","conscious","controversy","convenience","correspond","criticise","curiosity","definite","desperate","determined","develop","dictionary","disastrous","embarrass","environment","equip","especially","exaggerate","excellent","existence","explanation","familiar","foreign","forty","frequently","government","guarantee","harass","hindrance","identity","immediate","individual","interfere","interrupt","language","leisure","lightning","marvellous","mischievous","muscle","necessary","neighbour","nuisance","occupy","occur","opportunity","parliament","persuade","physical","prejudice","privilege","profession","programme","pronunciation","queue","recognise","recommend","relevant","restaurant","rhyme","rhythm","sacrifice","secretary","shoulder","signature","sincere","soldier","stomach","sufficient","suggest","symbol","system","temperature","thorough","twelfth","variety","vegetable","vehicle","yacht"],"Years 5–6 spelling patterns":["precious","delicious","ambitious","cautious","official","special","artificial","partial","confidential","essential","observant","observance","expectant","hesitant","tolerant","innocence","decency","confidence","assistant","assistance","obedient","obedience","independent","independence"],"School Spellings – cial/tial":["commercial","controversial","controversially","financial","financially","initial","initially","spatial"]};
const SPELLING_LIST_FILES=["lists/statutory-year5-6.json","lists/spelling-patterns.json","lists/school-cial-tial.json","lists/custom-lists.json"];
function validWords(words){return Array.isArray(words)?[...new Set(words.filter(w=>typeof w==="string").map(w=>w.trim()).filter(w=>/^[a-zA-Z -]+$/.test(w)))]:[]}
function localSpellingLists(){
 const lists={...DEFAULT_SPELLING_LISTS};
 try{const cached=JSON.parse(localStorage.getItem("spelling-stars-cache")||"null");if(cached&&typeof cached==="object")Object.assign(lists,cached)}catch{}
 try{const custom=JSON.parse(localStorage.getItem("spelling-stars-lists")||"{}");for(const [name,words] of Object.entries(custom)){const clean=validWords(words);if(clean.length)lists[name]=clean}}catch{}
 return lists;
}
async function fetchSpellingLists(){
 const result={};const failures=[];
 await Promise.all(SPELLING_LIST_FILES.map(async file=>{
  try{
   const response=await fetch(file);
   if(!response.ok)throw Error("HTTP "+response.status);
   const data=await response.json();
   if(data.lists&&typeof data.lists==="object"){for(const [name,words] of Object.entries(data.lists)){const clean=validWords(words);if(clean.length)result[name]=clean}}
   else if(typeof data.name==="string"){const clean=validWords(data.words);if(clean.length)result[data.name]=clean}
  }catch(e){failures.push(file)}
 }));
 try{const local=JSON.parse(localStorage.getItem("spelling-stars-lists")||"{}");for(const [name,words] of Object.entries(local)){const clean=validWords(words);if(clean.length)result[name]=clean}}catch{}
 return {lists:result,failures};
}
function loadSpellingLists(){
 const immediate=localSpellingLists();
 fetchSpellingLists().then(result=>{
  if(Object.keys(result.lists).length){
   try{localStorage.setItem("spelling-stars-cache",JSON.stringify(result.lists))}catch{}
   window.dispatchEvent(new CustomEvent("spelling-lists-refreshed",{detail:result}));
  }
 }).catch(()=>{});
 return Promise.resolve({lists:immediate,failures:[]});
}
