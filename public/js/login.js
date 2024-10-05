document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    if (params.has('error')) {
      const errorElement = document.getElementById('error-message');
      if (params.get('error') === 'credenciales_incorrectas') {
        errorElement.innerHTML = 'Credenciales incorrectas. Por favor, inténtelo de nuevo.';
      } else if (params.get('error') === 'error_servidor') {
        errorElement.innerHTML = 'Ocurrió un error en el servidor. Intente de nuevo más tarde.';
      }
      errorElement.style.display = 'block';
    }
  });
  