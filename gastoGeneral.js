let gastos = [];
 
document.addEventListener("DOMContentLoaded", () => {
  obtenerGastosDesdeAPI();
 
  // Evento manual al enviar el formulario
  document.getElementById("formFiltros").addEventListener("submit", e => {
    e.preventDefault(); // Evita recargar
    aplicarFiltros();
  });
});
 
function obtenerGastosDesdeAPI() {
fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/expenses")
    .then(res => res.json())
    .then(data => {
gastos = data.map(g => ({
id: g.id,
        titulo: g.titulo || g.title || "Sin título",
        categoria: g.categoria || g.category || g.categoryId || "Sin categoría",
        monto: Number(g.monto || g.amount || 0),
fecha: g.fecha || g.date || ""
      }));
      renderizarTabla(gastos);
    })
    .catch(err => {
      console.error("Error al cargar datos:", err);
      alert("No se pudieron cargar los gastos.");
    });
}
 
function aplicarFiltros() {
  const texto = document.getElementById("filtroTitulo").value.toLowerCase();
  const categoria = document.getElementById("filtroCategoria").value;
  const min = parseFloat(document.getElementById("filtroMin").value) || 0;
  const max = parseFloat(document.getElementById("filtroMax").value) || Infinity;
  const mes = document.getElementById("filtroMes").value;
 
  const filtrados = gastos
    .filter(g => g.titulo.toLowerCase().includes(texto))
    .filter(g => !categoria || g.categoria === categoria)
    .filter(g => g.monto >= min && g.monto <= max)
    .filter(g => mes === "" || new Date(g.fecha).getMonth() === parseInt(mes));
 
  renderizarTabla(filtrados);
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
 
  lista.forEach(g => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${g.titulo}</td>
      <td>${g.categoria}</td>
      <td>$${g.monto.toFixed(2)}</td>
      <td>${new Date(g.fecha).toLocaleDateString()}</td>
      <td>
g.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });
}
 
// Puedes agregar editarGasto y eliminarGasto si lo deseas
 
 
 
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