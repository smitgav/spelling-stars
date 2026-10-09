/* Shared spelling-list loader for both games. */
const SPELLING_LIST_FILES=["lists/statutory-year5-6.json","lists/spelling-patterns.json","lists/school-cial-tial.json","lists/custom-lists.json"];
function validWords(words){return Array.isArray(words)?[...new Set(words.filter(w=>typeof w==="string").map(w=>w.trim()).filter(w=>/^[a-zA-Z -]+$/.test(w)))]:[]}
async function loadSpellingLists(){
 const result={};let failures=[];
 for(const file of SPELLING_LIST_FILES){
  try{
   const response=await fetch(file,{cache:"no-cache"});
   if(!response.ok)throw Error("HTTP "+response.status);
   const data=await response.json();
   if(data.lists&&typeof data.lists==="object"){for(const [name,words] of Object.entries(data.lists)){const clean=validWords(words);if(clean.length)result[name]=clean}}
   else if(typeof data.name==="string"){const clean=validWords(data.words);if(clean.length)result[data.name]=clean}
  }catch(e){failures.push(file)}
 }
 try{const local=JSON.parse(localStorage.getItem("spelling-stars-lists")||"{}");for(const [name,words] of Object.entries(local)){const clean=validWords(words);if(clean.length)result[name]=clean}}catch{}
 return {lists:result,failures};
}
