const container = document.getElementById("container");
const registroBtn = document.getElementById("registro");
const loginBtn = document.getElementById("login");

registroBtn.addEventListener("click", () => {
  container.classList.add("ativo");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("ativo");
});
