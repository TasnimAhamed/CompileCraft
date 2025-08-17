function computeFirstAndFollowSets(grammarStr) {
  // Parse grammar
  const productionsRaw = parseGrammar(grammarStr);
  const nonTerminals = Object.keys(productionsRaw);
  const start = nonTerminals[0];

  // Normalize productions into token arrays per RHS
  const EPSILON_SYMBOLS = new Set(['ε','ϵ','e','Epsilon']);
  const productions = {}; // {A: [ [sym1,sym2,...] , ['ε'] , ... ]}
  nonTerminals.forEach(nt => {
    productions[nt] = productionsRaw[nt].map(p => {
      const trimmed = p.trim();
      if(EPSILON_SYMBOLS.has(trimmed)) return ['ε'];
      // tokens separated by spaces; ignore extra spaces
      return trimmed.split(/\s+/).filter(Boolean);
    });
  });

  // FIRST and FOLLOW sets
  const FIRST = {}; const FOLLOW = {};
  nonTerminals.forEach(nt=>{ FIRST[nt]=new Set(); FOLLOW[nt]=new Set(); });
  FOLLOW[start].add('$');

  // Helper: check nullable sequence
  function sequenceNullable(seq){
    for(const sym of seq){
      if(nonTerminals.includes(sym)) { if(!FIRST[sym].has('ε')) return false; }
      else if(sym !== 'ε') return false; // terminal (non-epsilon)
    }
    return true;
  }

  // Iteratively compute FIRST
  let changed=true; let guard=0;
  while(changed && guard<100){
    changed=false; guard++;
    for(const A of nonTerminals){
      for(const rhs of productions[A]){
        if(rhs.length===1 && rhs[0]==='ε'){
          if(!FIRST[A].has('ε')){ FIRST[A].add('ε'); changed=true; }
          continue;
        }
        let allNullable=true;
        for(const sym of rhs){
          if(nonTerminals.includes(sym)){
            for(const t of FIRST[sym]) if(t!=='ε' && !FIRST[A].has(t)){ FIRST[A].add(t); changed=true; }
            if(!FIRST[sym].has('ε')){ allNullable=false; break; }
          } else { // terminal
            if(sym!=='ε' && !FIRST[A].has(sym)){ FIRST[A].add(sym); changed=true; }
            allNullable=false; break;
          }
        }
        if(allNullable){ if(!FIRST[A].has('ε')){ FIRST[A].add('ε'); changed=true; } }
      }
    }
  }

  // Iteratively compute FOLLOW
  changed=true; guard=0;
  while(changed && guard<200){
    changed=false; guard++;
    for(const A of nonTerminals){
      for(const rhs of productions[A]){
        for(let i=0;i<rhs.length;i++){
          const B = rhs[i];
          if(!nonTerminals.includes(B)) continue; // terminals don't get follow
          const beta = rhs.slice(i+1);
            if(beta.length===0){
              // add FOLLOW(A)
              for(const sym of FOLLOW[A]) if(!FOLLOW[B].has(sym)){ FOLLOW[B].add(sym); changed=true; }
            } else {
              // compute FIRST(beta)
              let nullableBeta=true;
              for(const sym of beta){
                if(nonTerminals.includes(sym)){
                  for(const t of FIRST[sym]) if(t!=='ε' && !FOLLOW[B].has(t)){ FOLLOW[B].add(t); changed=true; }
                  if(!FIRST[sym].has('ε')){ nullableBeta=false; break; }
                } else { // terminal
                  if(sym!=='ε' && !FOLLOW[B].has(sym)){ FOLLOW[B].add(sym); changed=true; }
                  nullableBeta=false; break;
                }
              }
              if(nullableBeta){
                for(const sym of FOLLOW[A]) if(!FOLLOW[B].has(sym)){ FOLLOW[B].add(sym); changed=true; }
              }
            }
        }
      }
    }
  }

  // Prepare result (sorted arrays for stable display)
  const result={ first:{}, follow:{}, grammar:{ start, productions: productionsRaw } };
  nonTerminals.forEach(nt=>{
    result.first[nt]=Array.from(FIRST[nt]).sort();
    result.follow[nt]=Array.from(FOLLOW[nt]).sort();
  });
  return result;
}