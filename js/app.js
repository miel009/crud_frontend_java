// URL base de la API
const API_URL = "http://localhost:8080/api/articulos";

// Cuando se carga la página, mostramos el listado
document.addEventListener("DOMContentLoaded", listarArticulos);

// Manejador del formulario
document.getElementById("form-articulo").addEventListener("submit", guardarArticulo);

// Botón para cancelar edición
document.getElementById("cancelar").addEventListener("click", () => {
    // Limpiar todos los campos del formulario
    document.getElementById("form-articulo").reset();
    // Borrar el ID oculto del formulario
    document.getElementById("idArticulo").value = "";
});

// === Listar todos los artículos ===
function listarArticulos() {
    // Llamada GET a la API para obtener todos los artículos
    fetch(API_URL)
        .then(response => response.json()) // Convertimos la respuesta a JSON
        .then(data => {
            const tbody = document.getElementById("tabla-articulos"); // Obtenemos el cuerpo de la tabla
            tbody.innerHTML = ""; // Limpiar tabla antes de insertar nuevos datos
            data.forEach(articulo => {
                const fila = document.createElement("tr"); // Creamos una fila de tabla
                // Insertamos columnas con los datos del artículo y botones de acción
                 fila.classList.add("bg-white", "hover:bg-pink-50", "rounded-lg", "shadow-sm");
                 fila.innerHTML = `
                
                   <td class="px-6 py-4">${articulo.id}</td>
                    <td class="px-6 py-4">${articulo.nombre}</td>
                    <td class="px-6 py-4">\$${articulo.precio.toFixed(2)}</td>
                    <td class="px-6 py-4">
                        <div class="flex gap-3">
                            <button
                                class="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg transition"
                                onclick="editarArticulo(${articulo.id})">
                                ✏️ Editar
                            </button>
                            <button
                                class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                                onclick="eliminarArticulo(${articulo.id})">
                                🗑️ Eliminar
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(fila); // Agregamos la fila al cuerpo de la tabla
            });
        })
        .catch(error => console.error("Error al listar artículos:", error)); // Manejo de errores
}

// === Guardar o actualizar un artículo ===
function guardarArticulo(event) {
    event.preventDefault(); // Evitamos el comportamiento por defecto del formulario

    // Obtenemos los valores de los campos del formulario
    const id = document.getElementById("idArticulo").value;
    const nombre = document.getElementById("nombre").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);

    // Validación de campos
    if (!nombre || isNaN(precio) || precio < 0) {
        alert("Por favor complete correctamente los campos.");
        return;
    }

    // Creamos un objeto artículo con los datos del formulario
    const articulo = { nombre, precio };
    // Determinamos si es una edición (PUT) o creación (POST)
    const url = id ? `${API_URL}/${id}` : API_URL;
    const metodo = id ? "PUT" : "POST";

    // Enviamos el artículo al backend usando fetch
    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" }, // Indicamos que el cuerpo es JSON
        body: JSON.stringify(articulo) // Convertimos el objeto a JSON
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al guardar"); // Verificamos respuesta exitosa
            return response.json();
        })
        .then(() => {
            // Limpiamos el formulario y recargamos la tabla
            document.getElementById("form-articulo").reset();
            document.getElementById("idArticulo").value = "";
            listarArticulos();
        })
        .catch(error => console.error("Error al guardar artículo:", error)); // Manejo de errores
}

// === Cargar artículo en el formulario para edición ===
function editarArticulo(id) {
    // Llamada GET para obtener los datos del artículo por su ID
    fetch(`${API_URL}/${id}`)
        .then(response => response.json()) // Convertimos la respuesta a JSON
        .then(articulo => {
            // Cargamos los datos del artículo en el formulario
            document.getElementById("idArticulo").value = articulo.id;
            document.getElementById("nombre").value = articulo.nombre;
            document.getElementById("precio").value = articulo.precio;
        })
        .catch(error => console.error("Error al obtener artículo:", error)); // Manejo de errores
}

// === Eliminar un artículo ===
function eliminarArticulo(id) {
    // Confirmación antes de eliminar
    if (confirm("¿Deseás eliminar este artículo?")) {
        // Llamada DELETE al backend
        fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) throw new Error("Error al eliminar"); // Verificamos que la respuesta sea exitosa
                listarArticulos(); // Actualizamos la lista de artículos
            })
            .catch(error => console.error("Error al eliminar artículo:", error)); // Manejo de errores
    }
}
