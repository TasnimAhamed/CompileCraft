document.getElementById("btn-tools").addEventListener
("click", () => {
    window.location.href = "tools.html";
}
);

document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", () => {
        console.log("Button clicked:", button.innerText);
        const buttonId = button.getAttribute("id"); 
        console.log("Button ID:", buttonId);
    });
}
);