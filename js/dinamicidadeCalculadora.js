function esconderAvancado() {
  var calculadoraNormal = document.getElementById("hiddenCalculadora");
  var calculadoraAvancada = document.getElementById("CalculadoraAvancada");
  var checkbox = document.getElementById("btnAvancado");
  var btnCalculadoraAvancada = document.getElementById(
    "btnCalculadoraAvancada"
  );
  var btnCalculadora = document.getElementById("btnCalculadora");

  if (checkbox.checked) {
    calculadoraNormal.style.display = "none";
    calculadoraAvancada.style.display = "block";
    btnCalculadoraAvancada.style.display = "block";
    btnCalculadora.style.display = "none";
  } else {
    calculadoraNormal.style.display = "block";
    calculadoraAvancada.style.display = "none";
    btnCalculadoraAvancada.style.display = "none";
    btnCalculadora.style.display = "block";
  }
}
