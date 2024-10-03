let personas = [];
let plata = [];
$("#lista-participantes").empty();

//agrega persona a la lista y al array
$(".agregar").click(function () {
  let nuevoNombre = $("#nombre").text();
  console.log(personas.toString().includes(nuevoNombre)); //revisa porque no adna esto
  if (personas.toString().includes(nuevoNombre)) {
    window.alert("esta persona ya aporto su parte");
  } else if (nuevoNombre == null) {
    window.alert("no es una persona real");
  } else {
    $("#lista-participantes").append(
      `<li class="list-group-item">${$("#nueva-persona").val()}</li>`
    );
    personas.push([$("#nueva-persona").val()]);
    plata.push(Number($("#plata-nueva-persona").val()));
  }
});

//repartir gastos
$(".calcular").click(function () {
  //inhabilita el boton de agregar persona
  $(".agregar").prop("disabled", true);

  // Calcular el gasto total
  const gastoTotal = plata.reduce((acc, curr) => acc + curr, 0);

  // Calcular el gasto promedio por persona
  const gastoPromedio = gastoTotal / plata.length;

  // Calcular cuánto debe pagar o recibir cada persona
  const ajustes = plata.map((gasto) => gasto - gastoPromedio);

  // Separar deudores y acreedores
  let deudores = [];
  let acreedores = [];

  ajustes.forEach((ajuste, i) => {
    if (ajuste < 0) {
      deudores.push({ persona: i, cantidad: -ajuste });
    } else if (ajuste > 0) {
      acreedores.push({ persona: i, cantidad: ajuste });
    }
  });

  // Minimizar las transacciones
  let transacciones = [];

  while (deudores.length > 0 && acreedores.length > 0) {
    let deudor = deudores[0];
    let acreedor = acreedores[0];

    // La cantidad mínima que puede ser transferida
    let cantidad = Math.min(deudor.cantidad, acreedor.cantidad);

    // Registrar la transacción
    transacciones.push({
      deudor: deudor.persona,
      acreedor: acreedor.persona,
      cantidad: cantidad,
    });

    // Actualizar las cantidades después de la transacción
    deudor.cantidad -= cantidad;
    acreedor.cantidad -= cantidad;

    // Eliminar a aquellos que han saldado su deuda o cobrado lo que les correspondía
    if (deudor.cantidad === 0) deudores.shift();
    if (acreedor.cantidad === 0) acreedores.shift();
  }

  // Mostrar las transacciones entre personas
  transacciones.forEach((transaccion) => {
    $("#transacciones").append(`<li class="list-group-item">
      ${
        personas[transaccion.deudor]
      } debe pagar $${transaccion.cantidad.toFixed(2)} a ${
      personas[transaccion.acreedor]
    }</li>`);
  });
});
