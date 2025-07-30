document.getElementById('perfilForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const correo = document.getElementById('correo').value.trim();
  const contraseña = document.getElementById('contraseña').value.trim();
  const nombre = document.getElementById('nombre').value.trim();
   const usuario = JSON.parse(localStorage.getItem('usuario'));
   const id = usuario.id;


 
//    if (!id) {
//      alert("No se pudo obtener el ID del usuario.");
//      return;
//    }

  perfil(id, nombre, correo, contraseña);
});

function perfil(id, nombre, correo, contraseña) {
  fetch(`https://demos.booksandbooksdigital.com.co/practicante/backend/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": "Bearer TU_TOKEN_AQUI"
    },
   body: JSON.stringify({
  name: nombre,         
  email: correo,
  password: contraseña 
})
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Error al modificar perfil");
    }
    return response.json();
  })
  .then(usuario => {
    if (usuario) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
      localStorage.setItem('autenticado', 'true');
      alert("Perfil editado con Exito");
      window.location.href = 'menu.html';
    }
  })
  .catch(error => {
    console.error("Error al editar usuario:", error);
    alert("Hubo un error al editar el perfil.");
  });
}



// ELIMINAR CUENTA 


document.getElementById('eliminarUsuario').addEventListener('click', function() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const id = usuario.id;

  

  if (confirm("perdera toda su informacion")) {
    eliminarUsuario(id);
  }
});

function eliminarUsuario(id) {
  fetch(`https://demos.booksandbooksdigital.com.co/practicante/backend/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": "Bearer TU_TOKEN_AQUI"
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Error al eliminar el usuario.");
    }
    return response.json();
  })
  .then(data => {
    if(data){
    alert("Cuenta eliminada correctamente.");
    localStorage.clear();
    window.location.href = 'iniciarSesion.html'; 
    }   
  })
  .catch(error => {
    console.error("Error al eliminar el usuario:", error);
    alert("Hubo un error al eliminar la cuenta.");
  });
}
