const warning = document.getElementById("server-warning");

if (warning && window.location.protocol === "file:") {
    warning.textContent = "Diese Seite verwendet WebAssembly. Bitte starte sie mit scripts/start.sh oder scripts/start.ps1 über einen lokalen Server.";
    warning.classList.remove("hidden");
}
