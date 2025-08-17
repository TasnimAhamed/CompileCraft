function computeFirstAndFollowSets(grammarStr) {
    // Parse the grammar and identify the start symbol
    const productions = parseGrammar(grammarStr);
    const nonTerminals = Object.keys(productions);
    const start = nonTerminals[0]; // Assuming the first non-terminal is the start symbol
    
    // Initialize sets
    const first = {};
    const follow = {};
    
    // Initialize empty sets for all non-terminals
    nonTerminals.forEach(nt => {
      first[nt] = new Set();
      follow[nt] = new Set();
    });
    
    // Special case: Add $ to follow set of start symbol
    follow[start].add('$');
    
    // Helper function to determine if a symbol is a terminal
    function isTerminal(symbol) {
      return !nonTerminals.includes(symbol);
    }
    
    // Track symbols being computed to avoid infinite recursion
    const computing = new Set();
    
    // Function to compute First set of a symbol
    function computeFirst(symbol) {
      // If symbol is epsilon
      if (symbol === 'ϵ' || symbol === 'ε') {
        return new Set(['ε']);
      }
      
      // If symbol is a terminal
      if (isTerminal(symbol)) {
        return new Set([symbol]);
      }
      
      // If we're already computing this symbol's first set, return what we have
      // to break the recursion
      if (computing.has(symbol)) {
        return new Set(first[symbol]);
      }
      
      // If we've already computed this non-terminal's first set
      if (first[symbol].size > 0) {
        return new Set(first[symbol]);
      }
      
      // Mark this symbol as being computed
      computing.add(symbol);
      
      // Compute First set for each production
      productions[symbol].forEach(production => {
        if (production === 'ϵ' || production === 'ε') {
          // If production is epsilon, add it to First set
          first[symbol].add('ε');
        } else {
          // Split production into symbols (assuming they're space-separated)
          const symbols = production.split(' ').filter(Boolean);
          
          // For each symbol in the production
          let allDeriveEpsilon = true;
          
          for (let i = 0; i < symbols.length; i++) {
            const currentSymbol = symbols[i];
            const currentFirst = computeFirst(currentSymbol);
            
            // Add all symbols from currentFirst except epsilon
            currentFirst.forEach(s => {
              if (s !== 'ε') {
                first[symbol].add(s);
              }
            });
            
            // If current symbol doesn't derive epsilon, stop here
            if (!currentFirst.has('ε')) {
              allDeriveEpsilon = false;
              break;
            }
            
            // If this is the last symbol and all symbols derive epsilon
            if (i === symbols.length - 1 && allDeriveEpsilon) {
              first[symbol].add('ε');
            }
          }
        }
      });
      
      // Remove this symbol from the computing set
      computing.delete(symbol);
      
      return new Set(first[symbol]);
    }
    
    // First compute all First sets
    nonTerminals.forEach(nt => {
      computeFirst(nt);
    });
    
    // Function to compute First set of a string of symbols
    function computeFirstOfString(symbolsArray) {
      if (symbolsArray.length === 0) {
        return new Set(['ε']);
      }
      
      const result = new Set();
      let allDeriveEpsilon = true;
      
      for (let i = 0; i < symbolsArray.length; i++) {
        const currentSymbol = symbolsArray[i];
        let currentFirst;
        
        if (currentSymbol === 'ϵ' || currentSymbol === 'ε') {
          currentFirst = new Set(['ε']);
        } else if (isTerminal(currentSymbol)) {
          currentFirst = new Set([currentSymbol]);
        } else {
          currentFirst = new Set(first[currentSymbol]);
        }
        
        // Add all symbols from currentFirst except epsilon
        currentFirst.forEach(s => {
          if (s !== 'ε') {
            result.add(s);
          }
        });
        
        // If current symbol doesn't derive epsilon, stop here
        if (!currentFirst.has('ε')) {
          allDeriveEpsilon = false;
          break;
        }
        
        // If this is the last symbol and all symbols derive epsilon
        if (i === symbolsArray.length - 1 && allDeriveEpsilon) {
          result.add('ε');
        }
      }
      
      return result;
    }
    
    // Now compute Follow sets - limit iterations to prevent infinite loops
    let followSetChanged = true;
    let iterations = 0;
    const MAX_ITERATIONS = 100; // Reasonable limit to prevent infinite loops
    
    while (followSetChanged && iterations < MAX_ITERATIONS) {
      followSetChanged = false;
      iterations++;
      
      nonTerminals.forEach(nt => {
        // For each production of each non-terminal
        nonTerminals.forEach(lhs => {
          productions[lhs].forEach(production => {
            if (production === 'ϵ' || production === 'ε') return;
            
            // Split production into symbols
            const symbols = production.split(' ').filter(Boolean);
            
            // Find all occurrences of nt in the production
            for (let i = 0; i < symbols.length; i++) {
              if (symbols[i] === nt) {
                // Get the First set of the suffix after nt
                const suffix = symbols.slice(i + 1);
                const suffixFirst = computeFirstOfString(suffix);
                
                // Add all elements from suffixFirst except epsilon to Follow(nt)
                const oldSize = follow[nt].size;
                
                suffixFirst.forEach(s => {
                  if (s !== 'ε') {
                    follow[nt].add(s);
                  }
                });
                
                // If suffix can derive epsilon or is empty, add all elements from Follow(lhs) to Follow(nt)
                if (suffixFirst.has('ε') || suffix.length === 0) {
                  follow[lhs].forEach(s => {
                    follow[nt].add(s);
                  });
                }
                
                // Check if Follow(nt) changed
                if (follow[nt].size > oldSize) {
                  followSetChanged = true;
                }
              }
            }
          });
        });
      });
    }
    
    // Convert Set objects to arrays for cleaner output
    const result = {
      first: {},
      follow: {},
      grammar: { start, productions } // Include the parsed grammar for reference
    };
    
    nonTerminals.forEach(nt => {
      result.first[nt] = Array.from(first[nt]);
      result.follow[nt] = Array.from(follow[nt]);
    });
    
    return result;
  }