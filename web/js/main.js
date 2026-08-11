const warning = document.getElementById("server-warning");

if (warning && window.location.protocol === "file:") {
    warning.classList.remove("hidden");
}

