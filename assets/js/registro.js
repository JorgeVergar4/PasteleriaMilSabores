document.addEventListener('DOMContentLoaded', function() {
    const registroForm = document.getElementById('registro-form');
    // --- Cargar regiones y comunas ---
    const regionSelect = document.getElementById('region');
    const comunaSelect = document.getElementById('comuna');
    if (typeof regionesComunas !== 'undefined' && regionSelect && comunaSelect) {
        regionSelect.innerHTML = '';
        regionesComunas.regiones.forEach(region => {
            regionSelect.innerHTML += `<option value="${region.nombre}">${region.nombre}</option>`;
        });
        const cargarComunas = (regionNombre) => {
            comunaSelect.innerHTML = '';
            const region = regionesComunas.regiones.find(r => r.nombre === regionNombre);
            if (region) {
                region.comunas.forEach(comuna => {
                    comunaSelect.innerHTML += `<option value="${comuna}">${comuna}</option>`;
                });
            }
        };
        regionSelect.addEventListener('change', () => cargarComunas(regionSelect.value));
        cargarComunas(regionSelect.value);
    }

    function validarRun(run) {
        // Sin puntos ni guion, largo entre 7 y 9, último dígito puede ser K o número
        if (!run) return false;
        const cleanRun = run.trim().toUpperCase();
        if (!/^[0-9]{7,8}[0-9K]$/.test(cleanRun)) return false;
        // Validación de dígito verificador
        let cuerpo = cleanRun.slice(0, -1);
        let dv = cleanRun.slice(-1);
        let suma = 0, multiplo = 2;
        for (let i = cuerpo.length - 1; i >= 0; i--) {
            suma += parseInt(cuerpo.charAt(i)) * multiplo;
            multiplo = multiplo < 7 ? multiplo + 1 : 2;
        }
        let dvEsperado = 11 - (suma % 11);
        dvEsperado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
        return dv === dvEsperado;
    }

    if (registroForm) {
        registroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let valido = true;
            // Limpiar errores
            registroForm.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            // Obtener valores
            const run = document.getElementById('run').value.trim().toUpperCase();
            const nombre = document.getElementById('nombre').value.trim();
            const apellido = document.getElementById('apellido').value.trim();
            const email = document.getElementById('email').value.trim();
            const fechaNacimiento = document.getElementById('fecha-nacimiento').value;
            const password = document.getElementById('password').value;
            const region = regionSelect.value;
            const comuna = comunaSelect.value;
            const direccion = document.getElementById('direccion').value.trim();
            const promo = document.getElementById('promo').value.trim();

            // RUN
            if (!run) {
                registroForm.querySelector('#run + .error-message').textContent = 'El RUN es requerido.';
                valido = false;
            } else if (run.length < 7 || run.length > 9) {
                registroForm.querySelector('#run + .error-message').textContent = 'El RUN debe tener entre 7 y 9 caracteres.';
                valido = false;
            } else if (!validarRun(run)) {
                registroForm.querySelector('#run + .error-message').textContent = 'RUN inválido.';
                valido = false;
            }
            // Nombre
            if (!nombre) {
                registroForm.querySelector('#nombre + .error-message').textContent = 'El nombre es requerido.';
                valido = false;
            } else if (nombre.length > 50) {
                registroForm.querySelector('#nombre + .error-message').textContent = 'Máx 50 caracteres.';
                valido = false;
            }
            // Apellidos
            if (!apellido) {
                registroForm.querySelector('#apellido + .error-message').textContent = 'Los apellidos son requeridos.';
                valido = false;
            } else if (apellido.length > 100) {
                registroForm.querySelector('#apellido + .error-message').textContent = 'Máx 100 caracteres.';
                valido = false;
            }
            // Email
            if (!email) {
                registroForm.querySelector('#email + .error-message').textContent = 'El correo es requerido.';
                valido = false;
            } else if (email.length > 100) {
                registroForm.querySelector('#email + .error-message').textContent = 'Máx 100 caracteres.';
                valido = false;
            } else if (!/^([a-zA-Z0-9_.+-]+)@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(email)) {
                registroForm.querySelector('#email + .error-message').textContent = 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com';
                valido = false;
            }
            // Dirección
            if (!direccion) {
                registroForm.querySelector('#direccion + .error-message').textContent = 'La dirección es requerida.';
                valido = false;
            } else if (direccion.length > 300) {
                registroForm.querySelector('#direccion + .error-message').textContent = 'Máx 300 caracteres.';
                valido = false;
            }
            // Región y comuna
            if (!region) {
                registroForm.querySelector('#region + .error-message').textContent = 'Seleccione una región.';
                valido = false;
            }
            if (!comuna) {
                registroForm.querySelector('#comuna + .error-message').textContent = 'Seleccione una comuna.';
                valido = false;
            }
            // Si todo es válido, guardar usuario y redirigir
            if (valido) {
                let users = JSON.parse(localStorage.getItem('users')) || [];
                if (users.some(u => u.run === run)) {
                    registroForm.querySelector('#run + .error-message').textContent = 'Ya existe un usuario con este RUN.';
                    return;
                }
                users.push({
                    run,
                    nombre,
                    apellidos: apellido,
                    email,
                    fechaNacimiento,
                    password,
                    region,
                    comuna,
                    direccion,
                    promoCode: promo,
                    tipoUsuario: 'Cliente'
                });
                localStorage.setItem('users', JSON.stringify(users));
                alert('¡Registro exitoso! Serás redirigido al login.');
                window.location.href = 'login.html';
            }
        });
    }

    // Si hay un botón o enlace de "Iniciar Sesión", redirigir correctamente
    const loginLinks = document.querySelectorAll('a[href="login.html"], .btn-login');
    loginLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    });
});
