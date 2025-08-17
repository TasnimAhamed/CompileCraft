/**
 * Function to eliminate left factoring from a context-free grammar
 * @param {string} grammar - Grammar rules as a string
 * @return {string} - Grammar with left factoring eliminated
 */
function eliminateLeftFactoring(grammar) {
    // Parse the grammar into a structured format
    const parsedGrammar = parseGrammar(grammar);
    
    // Get all non-terminals in the grammar
    const nonTerminals = Object.keys(parsedGrammar);
    
    // Process each non-terminal
    const resultGrammar = {};
    const nonTerminalPrimes = {}; // Track number of primes for each non-terminal
    
    for (const nonTerminal in parsedGrammar) {
        // Initialize prime count for this non-terminal
        nonTerminalPrimes[nonTerminal] = 0;
        
        // Apply left factoring to this non-terminal
        const { newProductions, newNonTerminals } = applyLeftFactoring(
            nonTerminal, 
            parsedGrammar[nonTerminal], 
            nonTerminalPrimes,
            nonTerminals
        );
        
        // Add the processed productions to the result
        resultGrammar[nonTerminal] = orderProductions(newProductions, nonTerminals);
        
        // Add any new non-terminals created during left factoring
        for (const newNT in newNonTerminals) {
            nonTerminals.push(newNT);
            resultGrammar[newNT] = orderProductions(newNonTerminals[newNT], nonTerminals);
        }
    }
    
    // Convert the processed grammar back to string format
    return formatGrammar(resultGrammar);
}

/**
 * Apply left factoring to a set of productions for a non-terminal
 * @param {string} nonTerminal - The non-terminal being processed
 * @param {Array} productions - Array of productions for the non-terminal
 * @param {Object} primeCount - Object tracking prime counts for non-terminals
 * @param {Array} allNonTerminals - List of all non-terminals in the grammar
 * @return {Object} - Object containing new productions and any new non-terminals
 */
function applyLeftFactoring(nonTerminal, productions, primeCount, allNonTerminals) {
    let newProductions = [...productions];
    const newNonTerminals = {};
    let changed = true;
    
    // Continue until no more factoring can be done
    while (changed) {
        changed = false;
        
        // Group productions by their common prefixes
        const prefixGroups = groupByPrefix(newProductions);
        
        // Process each group with a common prefix
        for (const prefix in prefixGroups) {
            // Skip if there's only one production with this prefix or if prefix is empty
            if (prefixGroups[prefix].length <= 1 || prefix === '') continue;
            
            changed = true;
            
            // Create a new non-terminal with prime notation
            primeCount[nonTerminal]++;
            const primes = "'".repeat(primeCount[nonTerminal]);
            const newNT = `${nonTerminal}${primes}`;
            allNonTerminals.push(newNT);
            
            // Extract the suffixes after the common prefix
            const suffixes = prefixGroups[prefix].map(prod => {
                const restOfProduction = prod.substring(prefix.length).trim();
                return restOfProduction === '' ? 'ϵ' : restOfProduction;
            });
            
            // Remove the original productions from the list
            newProductions = newProductions.filter(prod => 
                !prefixGroups[prefix].includes(prod)
            );
            
            // Add the new production with the factored prefix
            newProductions.push(`${prefix} ${newNT}`);
            
            // Create productions for the new non-terminal
            newNonTerminals[newNT] = orderProductions(suffixes, allNonTerminals);
        }
    }
    
    return { newProductions, newNonTerminals };
}