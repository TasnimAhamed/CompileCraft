// (Event listeners for tool buttons added after DOM content load)

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

// Dynamic examples data
const EXAMPLES = {
    ff: {
        title: 'FIRST & FOLLOW Examples',
        items: [
            `E -> T E'\nE' -> + T E' | ϵ\nT -> F T'\nT' -> * F T' | ϵ\nF -> ( E ) | id`,
            'S -> A a | b\nA -> A c | S d | ϵ',
            'S -> ( L ) | a\nL -> L , S | S'
        ]
    },
    lr: {
        title: 'Left Recursion Examples',
        items: [
            'A -> A a | b',
            'E -> E + T | T\nT -> T * F | F\nF -> ( E ) | id',
            'S -> S a | S b | c'
        ]
    },
    tac: {
        title: '3-Address Code Examples',
        items: [
            'A = a + b * c',
            't = ( a + b ) * ( c - d )',
            'x = a ^ b ^ c',
            'y = ( p + q * r ) - s / t'
        ]
    },
    lf: { title: 'Left Factoring (Upcoming)', items: ['// Module in development'] },
    ll1: { title: 'LL(1) Table (Upcoming)', items: ['// Module in development'] },
    ast: { title: 'Syntax Tree (Upcoming)', items: ['// Module in development'] }
};

function escapeHTML(str){
    return str.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
}

function updateExamples(key){
    const panel=document.getElementById('examples-panel');
    const titleEl=document.getElementById('examples-title');
    const list=document.getElementById('grammar-list');
    if(!panel||!titleEl||!list) return;
    const data=EXAMPLES[key] || {title:'Examples', items:[]};
    titleEl.textContent=data.title;
    list.innerHTML='';
    data.items.forEach(txt=>{
        const li=document.createElement('li');
        li.className='py-2 border-b border-slate-700/60 last:border-none group';
        li.innerHTML='<pre class="whitespace-pre-wrap text-white/90 text-[11px] leading-snug">'+escapeHTML(txt)+'</pre>'+
            '<button class="insert-btn btn btn-xs mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-0">Insert</button>';
        li.dataset.exampleValue = txt;
        li.dataset.exampleTool = key;
        list.appendChild(li);
    });
    // bind insert buttons
    document.querySelectorAll('#grammar-list .insert-btn').forEach(btn=>{
        btn.addEventListener('click', function(){
            const li=this.parentElement;
            const value=li.dataset.exampleValue || '';
            const tool=li.dataset.exampleTool;
            const map={ ff:'#ff-input', lr:'#lr-input', tac:'#tac-input' };
            const targetSel=map[tool];
            if(targetSel){
                const textarea=document.querySelector(targetSel);
                if(textarea){
                    textarea.value=value;
                    textarea.focus();
                }
                this.textContent='Inserted';
                setTimeout(()=>{ this.textContent='Insert'; },1200);
            } else {
                this.textContent='Upcoming';
                setTimeout(()=>{ this.textContent='Insert'; },1200);
            }
        });
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

// Left factoring button (currently module marked Upcoming, so guard for absence)
const btnLf = document.getElementById("btn-process-lf");
if (btnLf) {
    btnLf.addEventListener("click", () => {
        const grammarInput = document.getElementById("lf-input").value;
        const result = eliminateLeftFactoring(grammarInput);
        document.getElementById("lf-output").innerText = "";
        document.getElementById("lf-output").innerHTML = `<pre class=\"text-black overflow-auto h-68\">${result}</pre>`;
    });
}


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

// ---------------- 3-ADDRESS CODE GENERATOR ----------------
// Simple expression to 3-address code converter (handles + - * / ^ and parentheses, assignment)
(function(){
    function tokenize(expr){
        const tokens=[]; let i=0; expr=expr.replace(/\s+/g,'');
        while(i<expr.length){
            const c=expr[i];
            if(/[A-Za-z_]/.test(c)){ let id=c; i++; while(i<expr.length && /[A-Za-z0-9_]/.test(expr[i])) id+=expr[i++]; tokens.push({type:'id',val:id}); continue; }
            if(/[0-9]/.test(c)){ let num=c; i++; while(i<expr.length && /[0-9]/.test(expr[i])) num+=expr[i++]; tokens.push({type:'num',val:num}); continue; }
            if('=+-*/^()'.includes(c)){ tokens.push({type:c,val:c}); i++; continue; }
            // unknown
            i++; 
        }
        return tokens;
    }
    // Shunting-yard to postfix (excluding assignment)
    const prec={'+':1,'-':1,'*':2,'/':2,'^':3};
    function toPostfix(tokens){
        const out=[]; const stack=[];
        for(const t of tokens){
            if(t.type==='id'||t.type==='num') out.push(t);
            else if(t.type==='(') stack.push(t);
            else if(t.type===')') { while(stack.length && stack[stack.length-1].type!=='(') out.push(stack.pop()); stack.pop(); }
            else if(['+','-','*','/','^'].includes(t.type)){
                while(stack.length){ const top=stack[stack.length-1]; if(['+','-','*','/','^'].includes(top.type) && (prec[top.type] > prec[t.type] || (prec[top.type]===prec[t.type] && t.type!=='^'))){ out.push(stack.pop()); } else break; }
                stack.push(t);
            }
        }
        while(stack.length) out.push(stack.pop());
        return out;
    }
    function postfixTo3AC(post){
        const stack=[]; const code=[]; let tempIdx=1;
        function newTemp(){ return 't'+(tempIdx++); }
        for(const t of post){
            if(t.type==='id'||t.type==='num') stack.push(t.val);
            else if(['+','-','*','/','^'].includes(t.type)){
                const b=stack.pop(); const a=stack.pop(); const tmp=newTemp(); code.push(tmp+' = '+a+' '+t.type+' '+b); stack.push(tmp);
            }
        }
        return {result:stack.pop(), code};
    }
    function generate3AC(line){
        // support assignment like A= a + b * c
        const assignParts=line.split('=');
        if(assignParts.length===2){
            const lhs=assignParts[0].trim();
            const rhs=assignParts[1].trim();
            const post=toPostfix(tokenize(rhs));
            const {result,code}=postfixTo3AC(post);
            code.push(lhs+' = '+result);
            return code;
        } else {
            const post=toPostfix(tokenize(line));
            const {result,code}=postfixTo3AC(post);
            code.push('result = '+result);
            return code;
        }
    }
    function processExpressions(src){
        const lines=src.split(/\n+/).map(l=>l.trim()).filter(Boolean);
        let all=[]; lines.forEach(l=>{ try{ all=all.concat(generate3AC(l)); }catch(e){ all.push('// Error processing line: '+l); } });
        return all.join('\n');
    }
    // Event bindings if elements exist
    const tacBtn=document.getElementById('btn-process-tac');
    if(tacBtn){
        tacBtn.addEventListener('click',()=>{
            const src=document.getElementById('tac-input').value;
            const out=processExpressions(src);
            document.getElementById('tac-output').textContent=out||'// No expressions';
        });
    }
    const tacClear=document.getElementById('btn-clear-tac');
    if(tacClear){ tacClear.addEventListener('click',()=>{ document.getElementById('tac-input').value=''; document.getElementById('tac-output').textContent='// 3AC will appear here...'; }); }
    const tacCopy=document.getElementById('btn-copy-tac');
    if(tacCopy){ tacCopy.addEventListener('click',()=>{ const text=document.getElementById('tac-output').textContent; navigator.clipboard.writeText(text); tacCopy.textContent='Copied'; setTimeout(()=>tacCopy.textContent='Copy Output',1600); }); }
})();

// (No change needed: generic handler already supports new IDs tac, ll1, ast and matching section IDs sec-tac, sec-ll1, sec-ast)

// Set initial active button and section
document.addEventListener("DOMContentLoaded", () => {
    // Bind tool buttons after DOM ready
    document.querySelectorAll('.btn-tool').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.id;
            // Always show the section (placeholders for upcoming ok)
            activeSection('sec-' + id);
            const isUpcoming = button.dataset.upcoming === 'true';
            if(!isUpcoming){
                activeButton(id);
            } else {
                document.querySelectorAll('.btn-tool.active').forEach(b=>b.classList.remove('active'));
            }
            updateExamples(id);
        });
    });

    activeButton('ff');
    activeSection('sec-ff');
    updateExamples('ff');

    // Popover logic for Supported Grammars
    const btn = document.getElementById('btn-grammars');
    const pop = document.getElementById('popover-grammars');
    const closeBtn = document.getElementById('close-grammars');
    const insertBtn = document.getElementById('btn-insert-sample');
    const ffInput = document.getElementById('ff-input');
    if(btn && pop){
        const hide = () => { pop.classList.add('hidden'); btn.setAttribute('aria-expanded','false'); };
        const show = () => { pop.classList.remove('hidden'); btn.setAttribute('aria-expanded','true'); };
        btn.addEventListener('click', (e)=>{ e.stopPropagation(); pop.classList.contains('hidden') ? show() : hide(); });
        closeBtn && closeBtn.addEventListener('click', (e)=>{ e.stopPropagation(); hide(); });
        document.addEventListener('click',(e)=>{ if(!pop.contains(e.target) && e.target!==btn){ hide(); } });
        document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') hide(); });
        insertBtn && insertBtn.addEventListener('click', ()=>{ if(ffInput){ ffInput.value = 'A -> A c | A a d | b d | ϵ'; hide(); ffInput.focus(); } });
    }
});
