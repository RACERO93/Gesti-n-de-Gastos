let gastos =  [];

// Mostrar todos los gastos de todos los meses
function mostrarTodosLosGastos() {
  const tbody = document.getElementById("tablaGastos");
  tbody.innerHTML = "";

  if (gastos.length === 0) {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td colspan="5">No hay gastos registrados</td>`;
    tbody.appendChild(fila);
    return;
  }

  gastos.forEach((gasto, i) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${gasto.title ?? 'Sin título'}</td>
      <td>${gasto.categoryId ?? 'Sin categoría'}</td>
      <td>$${Number(gasto.amount || 0).toFixed(2)}</td>
      <td>${gasto.date ? new Date(gasto.date).toLocaleDateString() : 'Sin fecha'}</td>
      <td>
       <button onclick="editarGasto(${gasto.id})">Editar</button>
      <button onclick="eliminarGasto(${gasto.id})">Eliminar</button>

      </td>
    `;
    gastos = data
  .map(g => ({
    ...g,
    titulo: g.titulo || g.title,
    categoria: g.categoria || g.category || g.categoryId,
    monto: Number(g.monto || g.amount),
    fecha: g.fecha || g.date
  }))
  .filter(g => g.titulo && g.categoria && g.fecha && !isNaN(g.monto));

renderizarTabla(gastos); 

    tbody.appendChild(fila);
  });
}

// Cargar desde API y actualizar tabla y localStorage
function obtenerGastosDesdeAPI() {
  fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/expenses")   
    .then(res => res.json())
    .then(data => {
      // Filtrar datos 

      
      
      gastos = data.filter(g => g.titulo && g.categoria && g.fecha && !isNaN(g.monto));
      console.log('data', gastos);
     
    })
    .catch(error => {
      console.error("Error al obtener gastos:", error);
      alert("No se pudo cargar la lista de gastos desde la API.");
      mostrarTodosLosGastos(); //Cargar datos
    });
}


// Editar gasto (PUT en API)
async function editarGasto(id) {
  const gasto = gastos.find(g => g.id === id);
 
  const nuevoTitulo = prompt("Nuevo título:", gasto.titulo);
  const nuevaCategoria = prompt("Nueva categoría:", gasto.categoria);
  const nuevoMonto = parseFloat(prompt("Nuevo monto:", gasto.monto));
  const nuevaFecha = prompt("Nueva fecha (YYYY-MM-DD):", gasto.fecha);
 
  if (nuevoTitulo && nuevaCategoria && !isNaN(nuevoMonto) && nuevaFecha) {
    try {
      const res = await fetch(`https://demos.booksandbooksdigital.com.co/practicante/backend/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: nuevoTitulo,
          categoria: nuevaCategoria,
          monto: nuevoMonto,
          fecha: nuevaFecha
        })
      });
 
      if (!res.ok) throw new Error("Error al actualizar gasto");
 
      alert(" Gasto actualizado correctamente");
      obtenerGastosDesdeAPI(); //para actulizar la api
    } catch (error) {
      console.error("Error al actualizar gasto:", error);
      alert("No se pudo actualizar el gasto.");
    }
  }
}

function eliminarGasto(id) {
  if (!confirm("¿Estas seguro de eliminar?")) return;

  fetch(`https://demos.booksandbooksdigital.com.co/practicante/backend/expenses/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => {
      if (!response.ok) throw new Error("Error al eliminar el gasto");
      alert("Gasto eliminado");
      obtenerGastosDesdeAPI();
    })
    .catch(error => {
      console.error("Error:", error);
      alert("No se pudo eliminar el gasto.");
    });
}

function aplicarFiltros() {
  const texto = document.getElementById("filtroTitulo").value.toLowerCase();
  const categoria = document.getElementById("filtroCategoria").value;
  const min = parseFloat(document.getElementById("filtroMin").value) || 0;
  const max = parseFloat(document.getElementById("filtroMax").value) || Infinity;
  const mes = document.getElementById("filtroMes").value;

  const filtrados = gastos
    .filter(g => (g.titulo ?? '').toLowerCase().includes(texto))
    .filter(g => !categoria || g.categoria === categoria)
    .filter(g => g.monto >= min && g.monto <= max)
    .filter(g => mes === "" || new Date(g.fecha).getMonth() === parseInt(mes))
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  renderizarTabla(filtrados);
  obtenerGastosDesdeAPI();
}

function renderizarTabla(lista) {
  const tbody = document.getElementById("tablaGastos");
  tbody.innerHTML = "";

  if (lista.length === 0) {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td colspan="5">No hay resultados</td>`;
    tbody.appendChild(fila);
    return;
  }

  lista.forEach((gasto, ) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${gasto.titulo}</td>
      <td>${gasto.categoria}</td>
      <td>$${Number(gasto.monto )}</td>
      <td>${new Date(gasto.fecha).toLocaleDateString()}</td>
      <td>
        <button onclick="editarGasto(${gasto.id})">Editar</button>
        <button onclick="eliminarGasto(${gasto.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

//obtener  categoria
const url = "https://.booksandbooksdigital.com.co/practicante/backend/categories";
 
let categoriaAPI = [];
 
async function cargarCategoria() {
  try {
    const respuestaCategoria = await fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/categories");
 
    
    categoriaAPI = await respuestaCategoria.json();
 
   
    // console.log("Categorias cargadas:", categoriaAPI);
  } catch (error) {
    console.error(" Error al traer las categorias:", error);
  }
}
 

function mostrarCategorias() {
  
    const categoriaFiltro = document.getElementById("filtroCategoria")
    categoriaAPI.map((dato)=>{       
      const option = document.createElement("option")
    

      
      option.id= dato.id
      option.text = dato.name
      categoriaFiltro.appendChild(option)
      
    })
}
 
cargarCategoria();

setTimeout(() => {
  mostrarCategorias(); 
}, 200);

obtenerGastosDesdeAPI();
