/* Shared spelling-list loader for both games. */
const SPELLING_LIST_FILES=["lists/statutory-year5-6.json","lists/spelling-patterns.json","lists/school-cial-tial.json","lists/custom-lists.json"];
function validWords(words){return Array.isArray(words)?[...new Set(words.filter(w=>typeof w==="string").map(w=>w.trim()).filter(w=>/^[a-zA-Z -]+$/.test(w)))]:[]}
async function fetchSpellingLists(){
 const result={};let failures=[];
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

/* Display a previously loaded list immediately, then refresh quietly. */
function loadSpellingLists(){
 let cached=null;
 try{cached=JSON.parse(localStorage.getItem("spelling-stars-cache")||"null")}catch{}
 const fresh=fetchSpellingLists().then(result=>{
  if(Object.keys(result.lists).length){
   try{localStorage.setItem("spelling-stars-cache",JSON.stringify(result.lists))}catch{}
   if(cached)window.dispatchEvent(new CustomEvent("spelling-lists-refreshed",{detail:result}));
  }
  return result;
 });
 if(cached&&Object.keys(cached).length){
  try{const local=JSON.parse(localStorage.getItem("spelling-stars-lists")||"{}");Object.assign(cached,local)}catch{}
  return Promise.resolve({lists:cached,failures:[]});
 }
 return fresh;
}
