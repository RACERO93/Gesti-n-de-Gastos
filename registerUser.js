document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();
console.log('se envio la peticion ');

const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const contraseña = document.getElementById('contraseña').value.trim();

  registrarUsuario(nombre, correo, contraseña);
});





function registrarUsuario(name, email, password) {
   const usuario = { name, email, password };

  
 console.log('usuario ',usuario);


  fetch('https://demos.booksandbooksdigital.com.co/practicante/backend/users',{
         method: 'POST',
         body: JSON.stringify(usuario),
          headers:{
     'Content-Type': 'application/json'
   }
     })
   .then(response => response.json()) 
   .then(data => {
         console.log(data); 
         alert("Usuario creado ")
         localStorage.clear();
    window.location.href = 'iniciarSesion.html'; 

   })
   .catch(error => {
     console.error('Error al conectar con la API:', error);
   });
}