/**
 * Function to eliminate both direct and indirect left recursion from a context-free grammar
 * @param {string} grammar - Grammar rules as a string
 * @return {string} - Grammar with left recursion eliminated
 */
function eliminateLeftRecursion(grammar) {
    // Parse the grammar into a structured format
    const parsedGrammar = parseGrammar(grammar);
    
    // Get all non-terminals in the grammar
    const nonTerminals = Object.keys(parsedGrammar);
    
    // Step 1: Arrange non-terminals in some order (A1, A2, ..., An)
    // We'll use the order they appear in the input
    
    // Step 2: Eliminate indirect left recursion
    for (let i = 0; i < nonTerminals.length; i++) {
        const Ai = nonTerminals[i];
        
        // For each previous non-terminal
        for (let j = 0; j < i; j++) {
            const Aj = nonTerminals[j];
            
            // Find productions of Ai that start with Aj
            const newProductions = [];
            const otherProductions = [];
            
            for (const prod of parsedGrammar[Ai]) {
                const parts = prod.split(' ').filter(p => p !== '');
                
                if (parts[0] === Aj) {
                    // This production starts with Aj
                    const beta = parts.slice(1).join(' ');
                    
                    // Substitute each production of Aj
                    for (const AjProd of parsedGrammar[Aj]) {
                        if (AjProd === 'ϵ') {
                            // If Aj produces epsilon, just add beta
                            if (beta) {
                                newProductions.push(beta);
                            } else {
                                newProductions.push('ϵ');
                            }
                        } else {
                            // Otherwise combine Aj's production with beta
                            if (beta) {
                                newProductions.push(AjProd + ' ' + beta);
                            } else {
                                newProductions.push(AjProd);
                            }
                        }
                    }
                } else {
                    // Keep productions that don't start with Aj
                    otherProductions.push(prod);
                }
            }
            
            // Update the productions for Ai
            parsedGrammar[Ai] = [...otherProductions, ...newProductions];
        }
        
        // Step 3: Eliminate direct left recursion for Ai
        eliminateDirectLeftRecursion(parsedGrammar, Ai, nonTerminals);
    }
    
    // Order all productions in the final grammar
    for (const nonTerminal in parsedGrammar) {
        parsedGrammar[nonTerminal] = orderProductions(parsedGrammar[nonTerminal], nonTerminals);
    }
    
    // Convert the eliminated grammar back to string format
    return formatGrammar(parsedGrammar);
}

/**
 * Eliminate direct left recursion for a given non-terminal
 * @param {Object} grammar - The structured grammar object
 * @param {string} nonTerminal - The non-terminal to process
 * @param {Array} allNonTerminals - List of all non-terminals in the grammar
 */
function eliminateDirectLeftRecursion(grammar, nonTerminal, allNonTerminals) {
    const productions = grammar[nonTerminal];
    
    // Separate productions into those with left recursion and those without
    const recursiveProds = [];
    const nonRecursiveProds = [];
    
    for (const production of productions) {
        const parts = production.split(' ').filter(p => p !== '');
        
        if (parts[0] === nonTerminal) {
            recursiveProds.push(parts.slice(1).join(' ') || 'ϵ');
        } else {
            nonRecursiveProds.push(production);
        }
    }
    
    // Check if left recursion exists
    if (recursiveProds.length > 0) {
        // Create a new non-terminal
        const newNonTerminal = nonTerminal + "'";
        allNonTerminals.push(newNonTerminal);
        
        // Create new productions for the original non-terminal
        const newProductions = [];
        for (const prod of nonRecursiveProds) {
            if (prod === 'ϵ') {
                newProductions.push(newNonTerminal);
            } else {
                newProductions.push(prod + ' ' + newNonTerminal);
            }
        }
        grammar[nonTerminal] = orderProductions(newProductions, allNonTerminals);
        
        // Create productions for the new non-terminal
        const newNTProductions = ['ϵ'];
        for (const prod of recursiveProds) {
            if (prod === 'ϵ') {
                newNTProductions.push(newNonTerminal);
            } else {
                newNTProductions.push(prod + ' ' + newNonTerminal);
            }
        }
        grammar[newNonTerminal] = orderProductions(newNTProductions, allNonTerminals);
    }
}