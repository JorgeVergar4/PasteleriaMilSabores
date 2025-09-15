document.addEventListener('DOMContentLoaded', () => {

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    const duocEmailRegex = /@duoc\.cl$/;

    // --- Funciones de Utilidad para Validaciones ---
    const mostrarError = (input, mensaje) => {
        // Adaptado para funcionar con la estructura de .form-group y .form-group-admin
        const formGroup = input.closest('.form-group, .form-group-admin');
        if (!formGroup) return;
        formGroup.classList.add('error');
        const errorP = formGroup.querySelector('.error-message');
        if (errorP) errorP.innerText = mensaje;
    };

    const limpiarError = (input) => {
        const formGroup = input.closest('.form-group, .form-group-admin');
        if (!formGroup) return;
        formGroup.classList.remove('error');
        const errorP = formGroup.querySelector('.error-message');
        if (errorP) errorP.innerText = '';
    };

    const validarRun = (run) => {
        const Fn = {
            validaRut: function (rutCompleto) {
                if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto)) return false;
                var tmp = rutCompleto.split('-');
                var digv = tmp[1]; var rut = tmp[0];
                if (digv == 'K') digv = 'k';
                return (Fn.dv(rut) == digv);
            },
            dv: function (T) {
                var M = 0, S = 1;
                for (; T; T = Math.floor(T / 10)) S = (S + T % 10 * (9 - M++ % 6)) % 11;
                return S ? S - 1 : 'k';
            }
        };
        let runSinFormato = run.replace(/\./g, '').replace('-', '');
        let cuerpo = runSinFormato.slice(0, -1);
        let dv = runSinFormato.slice(-1).toLowerCase();
        return Fn.validaRut(cuerpo + '-' + dv);
    };
    
    const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) { edad--; }
        return edad;
    };

    // --- Lógica del Login (COMPLETA) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            limpiarError(emailInput);
            limpiarError(passwordInput);

            if (!emailRegex.test(emailInput.value)) {
                mostrarError(emailInput, 'Formato de correo inválido.');
                return;
            }
            if (passwordInput.value.trim().length < 4) {
                mostrarError(passwordInput, 'La contraseña es demasiado corta.');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userFound = users.find(user => user.email === emailInput.value);

            if (userFound) {
                alert('¡Inicio de sesión exitoso!');

                // V V V AÑADE ESTA LÍNEA V V V
                sessionStorage.setItem('currentUser', JSON.stringify(userFound)); 
                // ^ ^ ^ AÑADE ESTA LÍNEA ^ ^ ^

                const successContainer = document.getElementById('login-success-message');
                const formHeader = document.querySelector('.form-header');
                if (loginForm) loginForm.style.display = 'none';
                if (formHeader) formHeader.style.display = 'none';
                if (successContainer) successContainer.style.display = 'block';
                setTimeout(() => { window.location.href = 'index.html'; }, 2000);
            } else {
                mostrarError(emailInput, 'Usuario no registrado o contraseña incorrecta.');
                mostrarError(passwordInput, 'Usuario no registrado o contraseña incorrecta.');
            }
        });
    }

    // --- Lógica de Contacto (COMPLETA) ---
    const contactForm = document.getElementById('contact-form');
    if(contactForm){
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let esValido = true;
            const nombre = document.getElementById('nombre');
            const email = document.getElementById('email');
            const comentario = document.getElementById('comentario');

            if (nombre.value.trim() === '' || nombre.value.length > 100) { esValido = false; mostrarError(nombre, 'El nombre es obligatorio (máx 100 caracteres).'); } else { limpiarError(nombre); }
            if (!emailRegex.test(email.value)) { esValido = false; mostrarError(email, 'El formato del correo no es válido.'); } else { limpiarError(email); }
            if (comentario.value.trim() === '' || comentario.value.length > 500) { esValido = false; mostrarError(comentario, 'El comentario es obligatorio (máx 500 caracteres).'); } else { limpiarError(comentario); }

            if (esValido) {
                alert('¡Mensaje enviado con éxito!');
                contactForm.reset();
            }
        });
    }

    // --- Lógica del Registro de Usuario (COMPLETA) ---
    const registroForm = document.getElementById('registro-form');
    if(registroForm){
        const regionSelect = document.getElementById('region');
        const comunaSelect = document.getElementById('comuna');
        if (typeof regionesComunas !== 'undefined' && regionSelect && comunaSelect) {
            regionesComunas.regiones.forEach(region => { regionSelect.innerHTML += `<option value="${region.nombre}">${region.nombre}</option>`; });
            const cargarComunas = (regionNombre) => {
                comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
                const region = regionesComunas.regiones.find(r => r.nombre === regionNombre);
                if (region) { region.comunas.forEach(comuna => { comunaSelect.innerHTML += `<option value="${comuna}">${comuna}</option>`; }); }
            };
            regionSelect.addEventListener('change', () => cargarComunas(regionSelect.value));
            cargarComunas(regionSelect.value);
        }

        registroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let esValido = true;
            let mensajesExito = [];

            const run = document.getElementById('run');
            const nombre = document.getElementById('nombre');
            const apellido = document.getElementById('apellido');
            const email = document.getElementById('email');
            const fechaNacimiento = document.getElementById('fecha-nacimiento');
            const password = document.getElementById('password');
            const direccion = document.getElementById('direccion');
            const promo = document.getElementById('promo');
            
            // Validaciones completas del formulario de registro
            if (!validarRun(run.value)) { esValido = false; mostrarError(run, 'El RUN no es válido.'); } else { limpiarError(run); }
            if (nombre.value.trim().length === 0 || nombre.value.trim().length > 50) { esValido = false; mostrarError(nombre, 'El nombre es requerido (máx. 50 caracteres).'); } else { limpiarError(nombre); }
            if (apellido.value.trim().length === 0 || apellido.value.trim().length > 100) { esValido = false; mostrarError(apellido, 'El apellido es requerido (máx. 100 caracteres).'); } else { limpiarError(apellido); }
            if (!emailRegex.test(email.value)) { esValido = false; mostrarError(email, 'Correo inválido. Dominios permitidos: @duoc.cl, @profesor.duoc.cl, @gmail.com.'); } else { limpiarError(email); if (duocEmailRegex.test(email.value)) { mensajesExito.push("¡Por ser de Duoc, recibirás una torta gratis en tu cumpleaños!"); } }
            if (fechaNacimiento.value) { const edad = calcularEdad(fechaNacimiento.value); if (edad >= 50) { mensajesExito.push("¡Tienes un 50% de descuento por ser mayor de 50 años!"); } limpiarError(fechaNacimiento); }
            if (password.value.length < 4 || password.value.length > 10) { esValido = false; mostrarError(password, 'La contraseña debe tener entre 4 y 10 caracteres.'); } else { limpiarError(password); }
            if (direccion.value.trim().length === 0 || direccion.value.trim().length > 300) { esValido = false; mostrarError(direccion, 'La dirección es requerida (máx. 300 caracteres).'); } else { limpiarError(direccion); }
            if (promo.value.trim().toUpperCase() === 'FELICES50') { mensajesExito.push("¡Código 'FELICES50' aplicado! Tienes 10% de descuento de por vida."); limpiarError(promo); } else if (promo.value.trim() !== '') { esValido = false; mostrarError(promo, 'El código promocional no es válido.'); } else { limpiarError(promo); }
            
            if (esValido) {
                const newUser = {
                    run: run.value,
                    nombre: nombre.value,
                    apellidos: apellido.value,
                    email: email.value,
                    fechaNacimiento: fechaNacimiento.value,
                    password: password.value,
                    region: regionSelect.value,
                    comuna: comunaSelect.value,
                    direccion: direccion.value,
                    tipoUsuario: 'Cliente'
                };
                
                let users = JSON.parse(localStorage.getItem('users')) || [];
                if (users.some(user => user.run === newUser.run)) {
                    mostrarError(run, 'Ya existe un usuario con este RUN.'); return;
                }
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                const successContainer = document.getElementById('success-message');
                const benefitsList = document.getElementById('benefits-list');
                benefitsList.innerHTML = mensajesExito.length > 0 ? mensajesExito.map(msg => `<li>${msg}</li>`).join('') : '<li>¡Tu cuenta ha sido creada exitosamente!</li>';
                
                registroForm.style.display = 'none';
                if(successContainer) successContainer.style.display = 'block';
                
                setTimeout(() => { window.location.href = 'login.html'; }, 4000);
            }
        });
    }
});