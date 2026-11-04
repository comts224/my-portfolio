const tokenize = text => text.toLowerCase().match(/[가-힣a-z0-9]+/g) || [];
const splitSentences = text => (text.match(/[^.!?\n]+[.!?]?/g) || []).map(x=>x.trim()).filter(Boolean);
let bm25SelectedScores = [];
function chooseBM25(text, question, budget) {
  bm25SelectedScores = [];
  const sentences = splitSentences(text);
  const qTerms = [...new Set(tokenize(question))];
  if (!sentences.length || !qTerms.length) return '';
  const docs = sentences.map(tokenize);
  const avg = docs.reduce((sum,t)=>sum+t.length,0)/docs.length || 1;
  const N = docs.length;
  const scored = docs.map((tokens,i)=>{
    let score=0;
    for (const term of qTerms) {
      const tf=tokens.filter(t=>t===term).length;
      if (!tf) continue;
      const df=docs.filter(d=>d.includes(term)).length;
      const idf=Math.log(1+(N-df+0.5)/(df+0.5));
      score += idf*(tf*2.5)/(tf+1.5*(0.25+0.75*tokens.length/avg));
    }
    return {i,score};
  }).sort((a,b)=>b.score-a.score || a.i-b.i);
  const selected=[];
  let used=0;
  for (const item of scored) {
    if (item.score<=0) break;
    const sentence=sentences[item.i];
    const extra=sentence.length+(selected.length?1:0);
    if (used+extra<=budget) {selected.push(item.i);used+=extra;}
  }
  bm25SelectedScores = selected.map(i => ({
    index: i + 1,
    score: scored.find(item => item.i === i).score
  }));
  return selected.sort((a,b)=>a-b).map(i=>sentences[i]).join(' ');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    chooseBM25,
    tokenize,
    splitSentences,
    getSelectedScores: () => bm25SelectedScores
  };
}