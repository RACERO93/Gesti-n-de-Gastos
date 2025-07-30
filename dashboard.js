let gastos = [];

function obtenerGastosDesdeAPI() {
  fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/expenses")
    .then(res => res.json())
    .then(data => {
      // Filtrar solo gastos válidos (con monto numérico y fecha válida)
      gastos = data.filter(g => !isNaN(parseFloat(g.monto)) && g.fecha);
      actualizarDashboard(gastos);
    })
    .catch(error => {
      // console.error("Error al obtener los datos:", error);
      // alert("No se pudo cargar la información del dashboard.");
    });
}

function actualizarDashboard(gastos) {
  if (!gastos.length) return;

  // Ordenar de mayor a menor por monto
  const gastosOrdenados = [...gastos].sort((a, b) => parseFloat(b.monto) - parseFloat(a.monto));

  const gastoMasAlto = gastosOrdenados[0];
  const gastoMasBajo = gastosOrdenados[gastosOrdenados.length - 1];

  
  const totalGeneral = gastos.reduce((acc, g) => acc + parseFloat(g.monto), 0);

  // Mostrar en HTML
  document.querySelector("#gastoAlto span").textContent = `$${parseFloat(gastoMasAlto.monto).toFixed(2)}`;
  document.querySelector("#gastoBajo span").textContent = `$${parseFloat(gastoMasBajo.monto).toFixed(2)}`;
  document.querySelector("#totalMes span").textContent = `$${totalGeneral.toFixed(2)}`;
}


obtenerGastosDesdeAPI();


     