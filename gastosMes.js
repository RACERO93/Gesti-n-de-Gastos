const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
  "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

let gastos = [];
let mesSeleccionado = new Date().getMonth();
let idEditando = null;

const mesesContainer = document.getElementById("mesesContainer");
const tbody = document.getElementById("tablaGastos");
const mensajeError = document.getElementById("mensajeError");

// Mostrar botones de meses
tbody.innerHTML = "";
meses.forEach((mes, i) => {
  const btn = document.createElement("button");
  btn.textContent = mes;
  if (i === mesSeleccionado) btn.classList.add("activo");
  btn.onclick = () => {
    mesSeleccionado = i;
    document.querySelectorAll(".meses button").forEach(b => b.classList.remove("activo"));
    btn.classList.add("activo");
    obtenerGastosDesdeAPI();
  };
  mesesContainer.appendChild(btn);
});

//   FUNCION PARA NORMALIZAR DATOS DE LA API 
function normalizarGasto(gasto) {
  return {
    id: gasto.id || null,
    userId: gasto.userId,
    categoria: gasto.categoria || gasto.categoryId || gasto.category,
    titulo: gasto.titulo || gasto.title,
    descripcion: gasto.descripcion || gasto.description,
    monto: isNaN(Number(gasto.monto || gasto.amount)) ? 0 : Number(gasto.monto || gasto.amount),
    fecha: gasto.fecha || gasto.date || new Date().toISOString().split("T")[0]
  };
}



async function obtenerGastosDesdeAPI() {
 mensajeError.style.display = "none";
try {
 const res = await fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/expenses");
 if (!res.ok) throw new Error(`HTTP ${res.status}`);
 const datos = await res.json();
 console.log("API devuelve:", datos);
 gastos = datos.map(normalizarGasto);

 if (!gastos.length) {
 mensajeError.textContent = "No hay gastos disponibles";
 mensajeError.style.display = "block";
 return;
 }

 filtrarGastos();
} catch (err) {
 console.error("Error al cargar gastos:", err);
 mensajeError.textContent = "Error al conectarse con la API.";
mensajeError.style.display = "block";
}
}

function filtrarGastos() {
  const tituloFiltro = document.getElementById("filtroTitulo").value.toLowerCase();
  const categoriaFiltro = document.getElementById("filtroCategoria").value;
  const min = parseFloat(document.getElementById("filtroMin").value);
  const max = parseFloat(document.getElementById("filtroMax").value);

  const filtrados = gastos
    .filter(g => new Date(g.fecha).getMonth() === mesSeleccionado)
    .filter(g => g.titulo.toLowerCase().includes(tituloFiltro))
    .filter(g => categoriaFiltro === "" || g.categoria === categoriaFiltro)
    .filter(g => isNaN(min) || g.monto >= min)
    .filter(g => isNaN(max) || g.monto <= max)
    .sort((a, b) => a.id - b.id);

  Tabla(filtrados);
}
function limpiarFiltros() {
  document.getElementById("filtroTitulo").value = "";
  document.getElementById("filtroCategoria").value = "";
  document.getElementById("filtroMin").value = "";
  document.getElementById("filtroMax").value = "";
  filtrarGastos();
}
 


async function agregarGasto() {
  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;
  const monto = parseFloat(document.getElementById("monto").value);
  const categoria = document.getElementById("categoria").value;
  const fecha = document.getElementById("fecha").value;

  if (!titulo || !monto || !categoria || !fecha || !descripcion) {
    return alert("Completa todos los campos");
  }

  const gasto = {
    userId: 1,
    categoryId: categoria,
    title: titulo,
    description: descripcion,
    amount: monto,
    date: fecha
  };

  try {
    const res = await fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gasto)
    });

    if (!res.ok) throw new Error("Error al agregar gasto");

    alert("Enviado y Guardado correctamente");
    // obtenerGastosDesdeAPI();

    // Limpiar formulario
    document.getElementById("titulo").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("monto").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("fecha").value = "";
  } catch (error) {
    console.error("Error al agregar gasto:", error);
    alert("No se pudo agregar el gasto.");
  }
}

let gastoEditandoId = null;

function iniciarEdicion(id) {
  fetch(`https://demos.booksandbooksdigital.com.co/practicante/backend/expenses/${id}`)
    .then(res => res.json())
    .then(data => {
      // click para abrir modal al btn de abrir modal
      document.getElementById("btnOpenModalGastos").click()

      document.getElementById("titulo").value = data.titulo;
      document.getElementById("descripcion").value = data.descripcion;
      document.getElementById("monto").value = data.monto;
      document.getElementById("fecha").value = data.fecha;

      gastoEditandoId = id;


      document.getElementById("tituloModal").innerText = "Editar Gasto"
      document.getElementById("btnAgregar").style.display = "none";
      document.getElementById("btnGuardar").style.display = "inline-block";
      document.getElementById("btnCancelar").style.display = "inline-block";



    })
    .catch(err => console.error("Error al cargar gasto:", err));
}
function cancelarEdicion() {
  // Limpiar campos del formulario
  document.getElementById("titulo").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("monto").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("fecha").value = "";

  // Restaurar botones
  document.getElementById("btnAgregar").style.display = "inline-block";
  document.getElementById("btnGuardar").style.display = "none";
  document.getElementById("btnCancelar").style.display = "none";

  // Resetear ID de edición
  gastoEditandoId = null;

  // Ocultar errores si hay
  const mensajeError = document.getElementById("mensajeError");
  if (mensajeError) mensajeError.style.display = "none";
}

function actualizarGasto() {
  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;
  const monto = parseFloat(document.getElementById("monto").value);
  const fecha = document.getElementById("fecha").value;
  const categoria = document.getElementById("categoria").value;

  const gastoActualizado = {
    title: titulo,
    description: descripcion,
    amount: monto,
    date: fecha,
    categoryId: categoria
  };

  fetch(`https://demos.booksandbooksdigital.com.co/practicante/backend/expenses/${gastoEditandoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gastoActualizado)
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al actualizar");
      return res.json();
    })
    .then(() => {
      alert("Gasto actualizado correctamente");

      // Limpiar formulario y restaurar botones
      document.getElementById("btnAgregar").style.display = "inline-block";
      document.getElementById("btnGuardar").style.display = "none";
      document.getElementById("titulo").value = "";
      document.getElementById("descripcion").value = "";
      document.getElementById("monto").value = "";
      document.getElementById("fecha").value = "";
      document.getElementById("categoria").value = "";

      gastoEditandoId = null;
      obtenerGastosDesdeAPI();
    })
    .catch(err => {
      console.error("Error:", err);
      alert("No se pudo actualizar el gasto.");
    });
}

async function agregarCategoria() {
  const name = document.getElementById("nuevaCategoria").value.trim();
  const mensaje = document.getElementById("mensajeCategoria");
  const select = document.getElementById("categoria");

  if (!name) {
    mensaje.textContent = " Ingresa un nombre de categoria";
    mensaje.style.color = "red";
    return;
  }

  try {
    const res = await fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name})
    });

    if (!res.ok) throw new Error("No se pudo crear la categoria");

    const nuevaOpcion = document.createElement("option");
    nuevaOpcion.value = nombre;
    nuevaOpcion.textContent = nombre;
    select.appendChild(nuevaOpcion);

    select.value = nombre;

    mensaje.textContent = " Categoria agregada";
    mensaje.style.color = "green";
    document.getElementById("nuevaCategoria").value = "";


    setTimeout(() => {

      mensaje.textContent = "";
    }, 1500);
    

  } catch (error) {
    console.error("Error al agregar categoria:", error);
    mensaje.textContent = "Error al agregar la categoria";
    mensaje.style.color = "red";
    setTimeout(() => {
      mensaje.textContent = "";
    }, 1500);
  }
}
// obtenerGastosDesdeAPI();
async function cargarCategorias() {
  const select = document.getElementById("categoria");
  select.innerHTML = "";

  try {
    const res = await fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/categories");
    const categorias = await res.json();

    categorias.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.nombre;
      option.textContent = cat.nombre;
      select.appendChild(option);
    });

  } catch (error) {
    console.error("Error al cargar categorias:", error);
  }
}

obtenerGastosDesdeAPI();

function eliminarGasto(id) {
  if (!confirm("¿Estas seguro de eliminar este gasto?")) return;

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

function Tabla(lista) {
  tbody.innerHTML = "";
  if (lista.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5">No hay gastos en este mes</td>`;
    tbody.appendChild(tr);
    return;
  }

  lista.forEach((gasto) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${gasto.titulo}</td>
      <td>${gasto.categoria}</td>
      <td>$${Number(gasto.monto)}</td>
      <td>${new Date(gasto.fecha).toLocaleDateString('es-CO')}</td>
      <td>
        <button onclick="iniciarEdicion(${gasto.id})" class="btnEditar">Editar</button>
        <button onclick="eliminarGasto(${gasto.id})">Eliminar</button>
      </td>
    `;

    function limpiarFormulario() {
      document.getElementById("titulo").value = "";
      document.getElementById("descripcion").value = "";
      document.getElementById("monto").value = "";
      document.getElementById("categoria").value = "";
      document.getElementById("fecha").value = "";

      document.getElementById("btnGuardar").style.display = "none"
      document.getElementById("btnAgregar").style.display = "inline-block"

      const mensajeError = document.getElementById("mensajeError");
      if (mensajeError) {
        mensajeError.style.display = "none"
      }

      //  document.getElementById("mensajeError").style.display="none";

    }
    tbody.appendChild(tr);
  });
}

obtenerGastosDesdeAPI();

//close Modal categoria
const btnCloseModal = document.getElementById("closeModal")

btnCloseModal.addEventListener('click', () => {
  document.querySelector(".modal").style.display = "none"

})
// Open modal de categoria 
const btnOpenModal = document.getElementById("btnOpenModal")

//modal gastos
// abrir modal de agregar nun gasto
const modalGastos = document.querySelector(".modalGastos")
const openModalGastos = document.getElementById("btnOpenModalGastos")
openModalGastos.addEventListener("click", () => {
  modalGastos.style.display = "inline-block"

  document.getElementById("titulo").value = null;
  document.getElementById("descripcion").value = null;
  document.getElementById("monto").value = null;
  document.getElementById("fecha").value = null;


  document.getElementById("tituloModal").innerText = "Nuevo Gasto"
  document.getElementById("btnAgregar").style.display = "inline-block";
  document.getElementById("btnGuardar").style.display = "none";

})
document.querySelectorAll(".btnModal").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".modalGastos").style.display = "none";
  });
});


//obtener  categoria
const url = "https://.booksandbooksdigital.com.co/practicante/backend/categories";
 
let categoriaAPI = [];
 
async function cargarCategoria() {
  try {
    const respuestaCategoria = await fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/categories");
 
    
    categoriaAPI = await respuestaCategoria.json();
 
   
    // console.log("Categorias cargadas:", categoriaAPI);
  } catch (error) {
    console.error(" Error al traer las categorías:", error);
  }
}
 

function mostrarCategorias() {
  
    const  categoria= document.getElementById("categoria")
    const categoriaFiltro = document.getElementById("filtroCategoria")
    categoriaAPI.map((dato)=>{       
      const option1 = document.createElement("option")
    
      option1.id= dato.id
      option1.text = dato.name
      categoria.appendChild(option1)

      const option2 = document.createElement("option")
      option2.id= dato.id
      option2.text = dato.name
      categoriaFiltro.appendChild(option2)
      
    })
}

cargarCategoria();

setTimeout(() => {
  mostrarCategorias(); 
}, 200);


