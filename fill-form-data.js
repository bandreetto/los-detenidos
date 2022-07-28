const {
  nacionalidadIds,
  estadoCivilIds,
  paisNacimientoIds,
  paisExpedicionPasaporteIds,
  motivoIds,
  residenciaIds,
  visitoMexicoIds,
  religionIds,
  actividadIds,
  expulsadoIds,
  antecedentesIds,
  sexoIds,
} = require("./select-ids");

async function fillFormData(page, formData) {
  console.log("Filling data...");

  console.log(`Inputting "nombre": ${formData.nome}`);
  await page.type("#nombre", formData.nome);

  console.log(`Inputting "apellidos": ${formData.sobrenome}`);
  await page.type("#apellidos", formData.sobrenome);

  console.log(`Selecting "sexo": ${formData.sexo}`);
  const sexoId = sexoIds[formData.sexo];
  if (!sexoId) throw new Error(`Could not find id for sexo: ${formData.sexo}`);
  await page.select("#sexo", sexoId);

  console.log(`Inputting "fechaNascimiento": ${formData.dataNascimento}`);
  await page.type("#fechaNacimiento", formData.dataNascimento);

  console.log(`Selecting "nacionalidad": ${formData.nacionalidade}`);
  const nacionalidadId = nacionalidadIds[formData.nacionalidade];
  if (!nacionalidadId)
    throw new Error(
      `Could not find id for nacionalidade: ${formData.nacionalidade}`
    );
  await page.select("#nacionalidad", nacionalidadId);

  console.log(`Selecting "estadoCivil": ${formData.estadoCivil}`);
  const estadoCivilId = estadoCivilIds[formData.estadoCivil];
  if (!estadoCivilId)
    throw new Error(
      `Could not find id for estadoCivil: ${formData.estadoCivil}`
    );
  await page.select("#estadoCivil", estadoCivilId);

  console.log(`Selecting "paisNacimiento": ${formData.paisNascimento}`);
  const paisNacimientoId = paisNacimientoIds[formData.paisNascimento];
  if (!paisNacimientoId)
    throw new Error(
      `Could not find id for paisNascimento: ${formData.paisNascimento}`
    );
  await page.select("#paisNacimiento", paisNacimientoId);

  console.log('Selecting "tipoDocumentoPasaporte": Passaporte');
  await page.select("#tipoDocumentoPasaporte", "1");

  console.log(`Inputting "numeroPasaporte": ${formData.numeroPassaporte}`);
  await page.type("#numeroPasaporte", formData.numeroPassaporte);

  console.log(
    `Selecting "paisExpedicionPasaporte": ${formData.paisExpedicaoPassaporte}`
  );
  const paisExpedicionPasaporteId =
    paisExpedicionPasaporteIds[formData.paisExpedicaoPassaporte];
  if (!paisExpedicionPasaporteId)
    throw new Error(
      `Could not find id for paisExpedicaoPassaporte: ${formData.paisExpedicaoPassaporte}`
    );
  await page.select("#paisExpedicionPasaporte", paisExpedicionPasaporteId);

  console.log(
    `Inputting "fechaExpedicionPasaporte": ${formData.dataExpedicaoPassaporte}`
  );
  await page.type(
    "#fechaExpedicionPasaporte",
    formData.dataExpedicaoPassaporte
  );

  console.log(
    `Inputting "fechaVencimientoPasaporte": ${formData.dataVencimentoPassaporte}`
  );
  await page.type(
    "#fechaVencimientoPasaporte",
    formData.dataVencimentoPassaporte
  );

  console.log(`Selecting "motivo": ${formData.motivo}`);
  const motivoId = motivoIds[formData.motivo];
  if (!motivoId)
    throw new Error(`Could not find id for motivo: ${formData.motivo}`);
  await page.select("#motivo", motivoId);

  console.log(`Selecting "residencia": ${formData.paisResidencia}`);
  const residenciaId = residenciaIds[formData.paisResidencia];
  if (!residenciaId)
    throw new Error(
      `Could not find id for paisResidencia: ${formData.paisResidencia}`
    );
  await page.select("#residencia", residenciaId);

  console.log(`Inputting "fechaViaje": ${formData.dataViagem}`);
  await page.type("#fechaViaje", formData.dataViagem);

  console.log(`Inputting "tiempoViaje": ${formData.tempoViagem}`);
  await page.type("#tiempoViaje", formData.tempoViagem);

  console.log(`Selecting "visitoMexico": ${formData.visitouMexico}`);
  const visitoMexicoId = visitoMexicoIds[formData.visitouMexico];
  if (!visitoMexicoId)
    throw new Error(
      `Could not find id for visitouMexico: ${formData.visitouMexico}`
    );
  await page.select("#visitoMexico", visitoMexicoId);

  if (visitoMexicoId === "true") {
    console.log(`Inputting "lugaresMexico": ${formData.lugaresMexico}`);
    await page.type("#lugaresMexico", formData.lugaresMexico);
  }

  console.log(`Selecting "religion": ${formData.religiao}`);
  const religionId = religionIds[formData.religiao];
  if (!religionId)
    throw new Error(`Could not find id for religiao: ${formData.religiao}`);
  await page.select("#religion", religionId);

  console.log(`Selecting "actividad": ${formData.profissao}`);
  const actividadId = actividadIds[formData.profissao];
  if (!actividadId)
    throw new Error(`Could not find id for profissao: ${formData.profissao}`);
  await page.select("#actividad", actividadId);

  console.log(`Selecting "expulsado": ${formData.expulsado}`);
  const expulsadoId = expulsadoIds[formData.expulsado];
  if (!expulsadoId)
    throw new Error(`Could not find id for expulsado: ${formData.expulsado}`);
  await page.select("#expulsado", expulsadoId);

  console.log(`Selecting "antecedentes": ${formData.antecedentes}`);
  const antecedentesId = antecedentesIds[formData.antecedentes];
  if (!antecedentesIds)
    throw new Error(
      `Could not find id for antecedentes: ${formData.antecedentes}`
    );
  await page.select("#antecedentes", antecedentesId);
}

module.exports = {
  fillFormData,
};
