document.querySelectorAll(".btn-tool").forEach((button) => {
    button.addEventListener("click", () => {
        // console.log("Button clicked:", button.innerText);
        const buttonId = button.getAttribute("id"); 
        activeSection('sec-' + buttonId);
        // console.log("Button ID:", buttonId);
        activeButton(buttonId);
    });
}
);

function activeButton(buttonId) {
    const buttons = document.querySelectorAll(".btn-tool");
    buttons.forEach((button) => {
        if (button.getAttribute("id") === buttonId) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
}

function activeSection(sectionId) {
    document.getElementById(sectionId).classList.remove("hidden");
    document.querySelectorAll(".section").forEach((section) => {
        if (section.id !== sectionId) {
            section.classList.add("hidden");
        }
    });
}




document.getElementById("btn-process-lr").addEventListener("click", () => {
    const grammarInput = document.getElementById("lr-input").value;
    // console.log("Grammar Input:", grammarInput);
    const result = eliminateLeftRecursion(grammarInput);
    document.getElementById("lr-output").innerText = "";
    document.getElementById("lr-output").innerHTML = `<pre class="text-black overflow-auto h-68">${result}</pre>`;
    // console.log("Left Recursion Eliminated:", result);
});

document.getElementById("btn-process-lf").addEventListener("click", () => {
    const grammarInput = document.getElementById("lf-input").value;
    // console.log("Grammar Input:", grammarInput);
    const result = eliminateLeftFactoring(grammarInput);
    document.getElementById("lf-output").innerText = "";
    document.getElementById("lf-output").innerHTML = `<pre class="text-black overflow-auto h-68">${result}</pre>`;
    // console.log("Left Factoring Eliminated:", result);
}
);


document.getElementById("btn-process-ff").addEventListener("click", () => {
    const grammarInput = document.getElementById("ff-input").value;
    // console.log("Grammar Input:", grammarInput);
    const result = computeFirstAndFollowSets(grammarInput);
    console.log("First and Follow Sets Computed:", result);
    document.getElementById("ff-output").innerText = "";
    let tableHTML = "<table class='text-sm md:text-lg text-black overflow-auto w-full rounded-box border-collapse border border-gray-300'><thead><tr><th class='border border-gray-300 px-4 py-2'>Non-Terminal</th><th class='border border-gray-300 px-4 py-2'>First</th><th class='border border-gray-300 px-4 py-2'>Follow</th></tr></thead><tbody>";

    for (const nonTerminal of Object.keys(result.first)) {
        const firstSet = result.first[nonTerminal].join(" ");  // No quotes
        const followSet = result.follow[nonTerminal].join(" ");  // No quotes
        
        tableHTML += `<tr>
            <td class='border border-gray-300 px-4 py-2'>${nonTerminal}</td>
            <td class='border border-gray-300 px-4 py-2'>${firstSet}</td>
            <td class='border border-gray-300 px-4 py-2'>${followSet}</td>
        </tr>`;
    }
    
    tableHTML += "</tbody></table>";
    document.getElementById("ff-output").innerHTML = tableHTML;
    
    
});
