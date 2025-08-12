
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('loginForm');
  if (!form) {
    console.error("No se encontro el formulario con id='loginForm");
    return;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const correo = document.getElementById('correo').value.trim();
    const contraseña = document.getElementById('contraseña').value.trim();


    
    iniciarSesion(correo, contraseña);
  });
});
function validarLogin(){
  const emailRegex = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if($correo.value === ""){
    alert("campo  del correo vacio");
  }if(contraseña.values === ""){
  alert("campo de la contraseña vacio");
};

// Validar correo
if (!emailRegex.test(correo.value)){
  alert("ingrese el correo");
  $correo.style.border = "1px solid red"

}
}
//Evento
document.addEventListener("click", e =>{
  if(e.target === $submit){
    e.preventDefault();
    validarLogin();
  }
})
// //Validar 
//   if (correo === "" || contraseña === ""){
//     alert("Por Favor Ingrsar Usuario y Contraseña");
//     return;
//   }
// //  Validcion de correo
// const eCorreo = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// if(!eCorreo.test(correo));
// alert("ingresar un correo valido");
// return; 

function iniciarSesion(correo, contraseña) {
   fetch(`https://demos.booksandbooksdigital.com.co/practicante/backend/users?email=${correo}&password=${contraseña}`,{
     method:'GET',
   headers : {
       "content-type": "application/json"
   },

  })
   
   .then( response => {
    console.log(response.ok);
    
      if (!response.ok) {
        throw new Error("Error Al inciar sesion ");
      }
      return response.json();
    })
    .then( (usuario) => {
      
     usuario = usuario[0];
     console.log(usuario);


     if (!correo || !contraseña) {
  alert("Debes ingresar correo y contraseña");
  return;
}



      if (usuario) {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        localStorage.setItem('autenticado', 'true');
        alert("Inicio de sesion exitoso");
        window.location.href = 'menu.html';
      } else {
         alert("correo o contraseña incorrectas");
      }
    })
    .catch(error => {
      console.error('Error al conectar con el servidor:', error);
      alert("Error al iniciar sesión");
    });
  }
  // Validar 
  function validarFormulario() {
  let correo = document.getElementById("correo").value;
  let contraseña = document.getElementById("contraseña").value;
  let valido = true;

  if (correo === "") {
    alert("Por favor, ingrese su correo");
    valido = false;
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    alert("Por favor, ingrese un correo electrónico válido.");
    valido = false;
  }

  if (contraseña === Number || contraseña === "") {
    alert("Por favor, ingrese su contraseña");
    valido = false;
  }

  return valido;
}

// document.getElementById("miFormulario").addEventListener("submit", function(event) {
//   if (!validarFormulario()) {
//     event.preventDefault(); // Evita que se envíe el formulario si no es válido
//   }
// });
 
 