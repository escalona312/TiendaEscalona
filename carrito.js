//con esto nos aseguramos que el codigo se ejecute cuando la pagina este lista


document.addEventListener('DOMContentLoaded', function(){


    //creamos un contador con let  donde empieza desde 0 
    let contador = 0;

    //const buscamos todos los botones que esten dentro de la clase card

    const botones = document.querySelectorAll('.card button');

// Seleccionamos el elemento donde se muestra el número del carrito (el contador)
    const contadorCarrito = document.getElementById('carrito-contador');



//si existe un contador lo guardamos en local storage por ejemplo si el user agrega 1 producto lo guardamos en local storage
//lo recuperamos y lo mostramos en pantalla 
    if(localStorage.getItem('contador')){
        contador  = parseInt(localStorage.getItem('contador')); //recuperamos el valor y lo convertimos a un numero

        if (contadorCarrito) contadorCarrito.textContent = contador; // mostramos el numero en el carrito 
    }

//agregamos un evento para cada boton que se encuentre dentro de la clase card
// //con el boton.addEventListener('click', () =>{} recoreeemos todos los botones encontrados
    botones.forEach(boton =>{
        //a cada boton le agregamos un evento click para ejectuar la funcion
        boton.addEventListener('click', () =>{
            //agregamos un contador para sumar la variable 
            contador++;

            //actualizamos el numero que se muestra en el carrito
            if(contadorCarrito) contadorCarrito.textContent = contador;

            //guardamos el nuevo valor del contador en local storage
            localStorage.setItem('contador', contador);

            //buscamos la tarjeta card donde esta el boton que se clickeo

            const card = boton.closest('.card');

            // obtenmos el nombre del producto de las tarjetas card
            const nombre = card.querySelector('h2').textContent;

            //obtenemos el precio del producto de es atarjeta 
            const precio = card.querySelector('.precio').textContent;

            //agregamos la imagen del producto a la lista
            const imagen = card.querySelector('img').getAttribute('src'); 
            //recuperamos el array de productodelc carrito desde local storage
        //si no existe un array de productos en local storage, creamos uno vacio
            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

            //agregamos el nuevo producto y con el nombre y precio al array
            carrito.push({nombre, precio, imagen});

            //guardamos  el array de productos en local storage y lo convertimos a un string osea en texto xd
            localStorage.setItem('carrito',JSON.stringify(carrito));





        });
    } );


    function actualizadacontador(){
        const contadorCarrito = document.getElementById('carrito-contador');
        const cantidad  = carrito.length;
        
        localStorage.setItem('contador', cantidad);
        if(contadorCarrito) contadorCarrito.textContent = cantidad;
    }



// seleccionamos ka kusta donde mostraremos los productos agregados al carrito provienen desde el html id carrito-lista

    const lista = document.getElementById('carrito-lista');
    const btnVaciar = document.getElementById('vaciar-carrito');
    const subtotalSpan = document.getElementById('subtotal');
    const totalSpan = document.getElementById('total');

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.forEach(p => { if (!p.cantidad) p.cantidad = 1; });

    function actualizarResumen() {
        let subtotal = carrito.reduce((acc, p) => acc + (parseInt(p.precio.replace(/[^0-9]/g, '')) * p.cantidad), 0);
        if (subtotalSpan) subtotalSpan.textContent = '$' + subtotal.toLocaleString('es-CL');
    }

    function mostrarCarrito() {
        if (!lista) return;
        lista.innerHTML = '';
        carrito.forEach((producto, index) => {
            const li = document.createElement('li');
            li.className = 'carrito-item';

            // Imagen
            const img = document.createElement('img');
            img.src = producto.imagen;
            img.alt = producto.nombre;
            img.className = '';
            img.style.width = '110px';
            img.style.height = '110px';
            img.style.objectFit = 'cover';

            // Info producto
            const infoDiv = document.createElement('div');
            infoDiv.className = 'info-producto';
            const precioNumerico = parseInt(producto.precio.replace(/[^0-9]/g, ''));
            const precioCLP = '$' + precioNumerico.toLocaleString('es-CL');
            infoDiv.innerHTML = `
                <div class="nombre-producto">${producto.nombre}</div>
                <div class="precio-unitario">${precioCLP} c/u</div>
            `;

            // Controles de cantidad
            const cantidadDiv = document.createElement('div');
            cantidadDiv.className = 'controles-cantidad';
            cantidadDiv.innerHTML = `
                <button>-</button>
                <span>${producto.cantidad}</span>
                <button>+</button>
            `;
            const [btnRestar, spanCantidad, btnSumar] = cantidadDiv.children;
            btnRestar.onclick = () => {
                if (producto.cantidad > 1) {
                    producto.cantidad--;
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    mostrarCarrito();
                }
            };
            btnSumar.onclick = () => {
                producto.cantidad++;
                localStorage.setItem('carrito', JSON.stringify(carrito));
                mostrarCarrito();
            };

            // Botón eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.className = 'btn-eliminar';
            btnEliminar.innerHTML = '<i class="bi bi-trash"></i>';
            btnEliminar.onclick = function() {
                carrito.splice(index, 1);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                mostrarCarrito();
            };

            li.appendChild(img);
            li.appendChild(infoDiv);
            li.appendChild(cantidadDiv);
            li.appendChild(btnEliminar);
            lista.appendChild(li);
        });
        actualizarResumen();
    }

    //mostramos los productos del carrito al cargar la pagina
    mostrarCarrito();

    //si existe el boton de vaciar carrito lo agregamos un evento click para vaciar el carrito

    if (btnVaciar){
        //cuando se hace clck en vaciar carrito vaciamos el carrito
        btnVaciar.addEventListener('click',()=>{
            //vaciamos el array del carrito
            carrito = [];
            //guardamos el array vacio en local storage
            localStorage.setItem('carrito', JSON.stringify(carrito));
            //mostramos el carrito actualizado
            mostrarCarrito();
            actualizadacontador();
        });
    }

    document.getElementById('finalizarCompra').addEventListener('click', function(event) {
      event.preventDefault(); // ← Esto evita el submit del formulario

      // Obtén los productos del carrito (ajusta según tu estructura)
      const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      if (carrito.length === 0) {
        alert('El carrito está vacío.');
        return;
      }

      // Genera el mensaje
      let mensaje = '¡Hola! Quiero comprar:\n';
      let total = 0;
      carrito.forEach(item => {
        const cantidad = item.cantidad || 1;
        const precio = limpiarPrecio(item.precio);
        mensaje += `* ${item.nombre} x${cantidad} = $${precio.toLocaleString('es-CL')} CLP\n`;
        total += precio * cantidad;
      });
      mensaje += `\nTotal: $${total.toLocaleString('es-CL')} CLP`;

      // Codifica el mensaje para URL
      const mensajeCodificado = encodeURIComponent(mensaje);

      // Número de WhatsApp (cambia el número por el tuyo, formato internacional sin + ni espacios)
      const numero = '56959279107';

      // Redirige a WhatsApp
      window.open(`https://wa.me/${numero}?text=${mensajeCodificado}`, '_blank');
    });

});

function limpiarPrecio(precio) {
  // Elimina todo lo que no sea número
  return Number(String(precio).replace(/[^0-9]/g, ''));
}