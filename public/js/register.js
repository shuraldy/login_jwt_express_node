document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    if (params.has('error')) {
      const errorElement = document.getElementById('error-message');
      if (params.get('error') === 'error_registro') {
        errorElement.innerHTML = 'Error al registrarse. Por favor, intente con un nombre de usuario diferente.';
      } else if (params.get('error') === 'error_servidor') {
        errorElement.innerHTML = 'Ocurrió un error en el servidor. Intente de nuevo más tarde.';
      }
      errorElement.style.display = 'block';
    }
  });