document.querySelectorAll(".copy-btn").forEach(button => {
    button.addEventListener("click", function () {
        const textToCopy = this.parentElement.innerText.replace("Copy", "").trim(); // Remove "Copy" text
        navigator.clipboard.writeText(textToCopy).then(() => {
            // alert("Copied: " + textToCopy);
        }).catch(err => console.error("Failed to copy:", err));
    });
});




/**
 * Format the grammar object back to a string with productions on separate lines
 * @param {Object} grammar - The structured grammar object
 * @return {string} - Formatted grammar as a string
 */
function formatGrammar(grammar) {
    let result = '';
    
    for (const nonTerminal in grammar) {
        const productions = grammar[nonTerminal];
        
        if (productions.length > 0) {
            result += nonTerminal + ' -> ' + productions[0] + '\n';
            
            for (let i = 1; i < productions.length; i++) {
                result += '    | ' + productions[i] + '\n';
            }
        } else {
            result += nonTerminal + ' -> \n';
        }
        
        // Add an extra newline between non-terminals, except for the last one
        if (Object.keys(grammar).indexOf(nonTerminal) < Object.keys(grammar).length - 1) {
            result += '\n';
        }
    }
    
    return result.trim();
}

function orderProductions(productions, nonTerminals) {
    // Create three arrays for different types of productions
    const nonTerminalProds = [];
    const terminalProds = [];
    const epsilonProds = [];
    
    for (const prod of productions) {
        if (prod === 'ϵ') {
            epsilonProds.push(prod);
        } else {
            const firstToken = prod.split(' ')[0];
            if (nonTerminals.includes(firstToken)) {
                nonTerminalProds.push(prod);
            } else {
                terminalProds.push(prod);
            }
        }
    }
    
    // Combine the arrays in the desired order
    return [...nonTerminalProds, ...terminalProds, ...epsilonProds];
}

/**
 * Group productions by their common prefixes
 * @param {Array} productions - Array of productions
 * @return {Object} - Object with prefixes as keys and arrays of productions as values
 */
function groupByPrefix(productions) {
    const prefixGroups = {};
    
    for (const prod of productions) {
        // Skip epsilon productions when looking for prefixes
        if (prod === 'ϵ') {
            if (!prefixGroups['']) {
                prefixGroups[''] = [];
            }
            prefixGroups[''].push(prod);
            continue;
        }
        
        // Get the first token of the production
        const tokens = prod.split(' ');
        const firstToken = tokens[0];
        
        // Find the longest common prefix with existing groups
        let longestPrefix = '';
        let longestPrefixLength = 0;
        
        for (const prefix in prefixGroups) {
            if (prefix === '') continue;
            
            // Check if this production starts with the current prefix
            if (prod.startsWith(prefix)) {
                // Update if this is a longer prefix
                if (prefix.length > longestPrefixLength) {
                    longestPrefix = prefix;
                    longestPrefixLength = prefix.length;
                }
            }
        }
        
        // If we found a matching prefix group, add to it
        if (longestPrefix !== '') {
            prefixGroups[longestPrefix].push(prod);
        } 
        // Otherwise, create a new group with the first token as prefix
        else {
            if (!prefixGroups[firstToken]) {
                prefixGroups[firstToken] = [];
            }
            prefixGroups[firstToken].push(prod);
        }
    }
    
    return prefixGroups;
}


/**
 * Parse a grammar string into a structured object
 * @param {string} grammar - The grammar as a string
 * @return {Object} - Object with non-terminals as keys and arrays of productions as values
 */
function parseGrammar(grammar) {
    const parsedGrammar = {};
  
    // Split the grammar into lines and process each line
    const lines = grammar.trim().split("\n");
    let currentNonTerminal = null;
  
    for (const line of lines) {
      const trimmedLine = line.trim();
  
      // Skip empty lines
      if (trimmedLine === "") continue;
  
      // Check if line defines a new non-terminal
      if (trimmedLine.includes("->")) {
        const parts = trimmedLine.split("->");
        currentNonTerminal = parts[0].trim();
  
        let productions = parts[1].trim();
        parsedGrammar[currentNonTerminal] = [];
  
        if (productions.includes("|")) {
          const prods = productions.split("|").map((p) => p.trim());
          parsedGrammar[currentNonTerminal].push(...prods);
        } else {
          parsedGrammar[currentNonTerminal].push(productions);
        }
      }
      // If line continues with productions for the current non-terminal
      else if (trimmedLine.startsWith("|") && currentNonTerminal) {
        const production = trimmedLine.substring(1).trim();
        parsedGrammar[currentNonTerminal].push(production);
      }
    }
  
    return parsedGrammar;
  }