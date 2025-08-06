
function obtenerGastosDesdeAPI() {
  fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/categories")   
    .then(res => res.json())
    .then(data => {
      // Filtrar datos 

      gastos = data.filter(g => g.titulo && g.categoria && g.fecha && !isNaN(g.monto));
     
    })
    .catch(error => {
      console.error("Error al obtener gastos:", error);
      alert("No se pudo cargar la lista de gastos desde la API.");
      mostrarTodosLosGastos(); //Cargar datos
    });
}
// agregar una nueva categoria
async function fucCategoria (categoria) {
      const nombre = document.getElementById("nuevaCategoria").value.trim();
   const mensaje = document.getElementById("mensajeCategoria");
   const select = document.getElementById("categoria");
 
   if (!nombre) {
     mensaje.textContent = " Ingresa un nombre de categoria";
 mensaje.style.color = "red";
     return;
   }
 
 
   fetch(`https://demos.booksandbooksdigital.com.co/practicante/backend/categories/${id}`,
    { method:'GET',
   headers : {
       "content-type": "application/json"
   }}
   )
   .then( response => {
    console.log(response.ok);
    
      if (!response.ok) {
        throw new Error("Error Al escribir mal");
      }
      return response.json();
    })
    .then( (id) => {
      
     id = categoria[0];
     console.log(id);

      if (id) {
        localStorage.setItem('id', JSON.stringify(id));
        localStorage.setItem('autenticado', 'true');
        alert("ok");
        
      } else {
         alert("error al escribir");
      }
    })
    .catch(error => {
      console.error('Error al conectar con el servidor:', error);
      alert("Error al iniciar sesión");
    });
  }

async function agregarCategoria() {
  const name = document.getElementById("nuevaCategoria").value.trim();
  const mensaje = document.getElementById("mensajeCategoria");
  const select = document.getElementById("categoria");

  if (!name) {
    mensaje.textContent = "Ingresa un nombre de categoría";
    mensaje.style.color = "red";
    return;
  }

  try {
    const res = await fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });

    if (!res.ok) throw new Error("No se pudo crear la categoría");

    
    const nuevaOpcion = document.createElement("option");
    nuevaOpcion.value = name;
    nuevaOpcion.textContent = name;
    select.appendChild(nuevaOpcion);

    select.value = name;

    mensaje.textContent = "Categoría agregada correctamente";
    mensaje.style.color = "green";
    document.getElementById("nuevaCategoria").value = "";

    setTimeout(() => {
      mensaje.textContent = "";
    }, 1500);

    mostrarCategoriasEnTabla();

  } catch (error) {
    console.error("Error al agregar categoría:", error);
    mensaje.textContent = "Error al agregar la categoría";
    mensaje.style.color = "red";
    setTimeout(() => {
      mensaje.textContent = "";
    }, 1500);
  }
}

 obtenerGastosDesdeAPI();




async function cargarCategorias() {
  const select = document.getElementById("categorias");
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

 let categoriaEditandoId = null


 function actualizarCategoria() {
   const nombre = document.getElementById("nuevaCategoria").value.trim();
   const mensaje = document.getElementById("mensajeCategoria");

   if (!nombre || !categoriaEditandoId) {
     mensaje.textContent = "Nombre inválido o sin categoria seleccionada.";
     mensaje.style.color = "red";
     return;
   }
 
   fetch(`https://demos.booksandbooksdigital.com.co/practicante/backend/categories/${categoriaEditandoId}`, {
     method: "PUT",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ name: nombre }),
   })
  .then(res => {
       if (!res.ok) throw new Error("Error al actualizar");
       return res.json();
     })
     .then(() => {
       mensaje.textContent = "Categoria actualizada correctamente";
       mensaje.style.color = "green";
       document.getElementById("nuevaCategoria").value = "";
       categoriaEditandoId = null;
       document.getElementById("btnAgregarCategoria").style.display = "inline-block";
       document.getElementById("btnGuardarCategoria").style.display = "none";
       cargarCategorias(); // recargar la lista
     })
     .catch(err => {
       console.error("Error:", err);
       mensaje.textContent = "No se pudo actualizar la categoría.";
       mensaje.style.color = "red";
     })
     .finally(() => {
       setTimeout(() => (mensaje.textContent = ""), 2000);
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

  
   lista.forEach(() => {
    
     tr.innerHTML = `
  
         <button onclick="openModalBtn(${categoria.id})" class="guardarCambioCategoria ">Editar</button>
         <button onclick="eliminarGasto(${categoria.id})">Eliminar</button>
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

btnOpenModal.addEventListener('click', () => {
  document.querySelector(".modal").style.display = "inline-block"

})
//modal gastos
// abrir modal de agregar nun gasto
const modalGastos = document.querySelector(".modalGastos")
const openModalGastos = document.getElementById("btnOpenModalGastos")
async function mostrarCategoriasEnTabla() {
  const tabla = document.getElementById("tablaCategoria");
  tabla.innerHTML=" ";

  try {
    const res=await fetch("https://demos.booksandbooksdigital.com.co/practicante/backend/categories");
    const categorias= await res.json();

    categorias.forEach(cat =>{
      const tr = document.createElement("tr");

      tr.innerHTML=`
      <td>${cat.id}</td>
      <td>${cat.name}</td>
      <td> 
      <button onclick="btnEditarCategoria(${cat.id}, '${cat.name}')">Editar</button>
      <button disabled>Eliminar</button 
      </td>
      `;
          tabla.appendChild(tr);
    });
  } catch (error) {
    console.log("error al cargar la categoria", error)
  alert("Error al cargar la lista de las categorias")  
  }
  
}
 mostrarCategoriasEnTabla();

 function editarCategoria(id,nombre) {
  alert(`Editar categoria ID ${id},con nombre ${nombre}`);

 }

//////////////////////////////////////////////////







// Actualizar por PUT
function actualizarCategoria() {
 const nuevoNombre = document.getElementById("categoria").value.trim();

 if (!nuevoNombre) {
 alert("Debes ingresar un nombre de categoria");

 }

 const categoriaActualizada = { name: nuevoNombre };

 fetch(`https://demos.booksandbooksdigital.com.co/practicante/backend/categories/${categoriaEditandoId}`, {
 method: "PUT",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(categoriaActualizada)
 })
.then(res => {
 if (!res.ok) throw new Error("Error al actualizar");
 return res.json();
 })
 .then(() => {
 alert("Categoria actualizada correctamente");
 document.getElementById("myModal").style.display = "none";
 document.getElementById("categoria").value = "";
 categoriaEditandoId = null;
 obtenerCategoriasDesdeAPI();
 })
 .catch(err => {
 console.error("Error:", err);
 alert("No se pudo actualizar la categoria.");
 });
}





 //////////////////////////////////////////////
 
 const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modal = document.getElementById("myModal");
 
  openModalBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });
  
//  Cerrar Modal
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
 
  // // Cierra el modal si haces clic fuera del contenido
  // window.addEventListener("click", (event) => {
  //   if (event.target === modal) {
  //     modal.style.display = "none";
  //   }
  // });

