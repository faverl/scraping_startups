const { test, expect, chromium} = require('@playwright/test');

;(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.setDefaultTimeout(120000);
    await page.goto('https://datastudio.google.com/u/0/reporting/24d0fd5c-e83f-4206-9b36-2c3f4dc39798/page/p_7o4u6m4uoc');

    const cantidadData = await page.locator('#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(44) > canvas-component > div > div > div.component > div > div > lego-table > div > div.pageControl > div.pageLabel').first().textContent();

    const cantidad = cantidadData.split('/').pop();
    const paginas = Math.ceil(cantidad/10);
    const lista = Array();

    // Se calcularon la cantidad de paginas que se deben recorrer
    for (let pag = 1; pag <= 1; pag++) {
      let lineas = (pag == paginas) ? cantidad%10 : 10;
      let valor = (pag == 1) ? 2 : 3;

      // Se recorre cada linea de la tabla
      for (let linea = 0; linea < lineas; linea++) {
        const dato = Array();
        // Se recorre cada celda de la linea
        for (let celda = 1; celda <=5; celda++) {
          let valorCelda = await page.locator(`#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(44) > canvas-component > div > div > div.component > div > div > lego-table > div > div.tableBody > div:nth-child(${linea+valor}) > div:nth-child(${celda})`).textContent();

          dato.push(valorCelda);
        }
        lista.push(dato);
      }

      await page.locator('#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(44) > canvas-component > div > div > div.component > div > div > lego-table > div > div.pageControl > div.pageForward').click();

      // obtenemos el div que contiene la tabla y que controla el estado cuando se esta actualizando.
      const locator = page.locator('#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(44) > canvas-component > div > div > div.component > div');
      // Se espera hasta el elemento div no tenga la clase is-loading, lo que significa que ya termino de cargar las nuevas lineas de la página.
      await expect(locator).not.toHaveClass(/is-loading/);
    }

    const listaEmpresas = Array();
    let contadorEmpresas = 1;
    lista.forEach(element => {
      const empresa =  element[1].trim();
      if(!listaEmpresas.includes(empresa)){
        listaEmpresas.push(empresa);
        console.log(contadorEmpresas,'.', empresa);
        contadorEmpresas++;
      }
    });

    // Se da clic en la lista desplegable y en el campo de busqueda
    await page.locator('text=NOMBRE').first().click();
    await page.locator('[placeholder="Escriba el término de búsqueda"]  >> nth=1').click();

    const informacionEmpresas = Array();
    for (let index = 0; index < listaEmpresas.length; index++) {
      const datos = Array();
      
      await page.fill('[placeholder="Escriba el término de búsqueda"]  >> nth=1',listaEmpresas[index]);

      const locator =  await page.locator('body > canvas-control-editor > div > div > div > list-control > div > md-virtual-repeat-container > div > div.md-virtual-repeat-offsetter > div > span');

      const resultado = await expect(locator).toHaveCount(0);

      console.log(resultado);
      if(resultado) {
        datos['sectores'] = null;        
        datos['empleados'] = null;        
        datos['pubnlico'] = null;        
        datos['fundacion'] = null;        
        datos['ciudad'] = null;        
        datos['departamento'] = null;        
        datos['web'] = null;        
        datos['linkendin'] = null;        
        datos['score'] = null;        
        informacionEmpresas[listaEmpresas[index]] = datos;
        console.log(informacionEmpresas);
        continue;
      }
      await page.locator(`text=${listaEmpresas[index]} solamente`).first().hover();
      await page.locator('body > canvas-control-editor > div > div > div > list-control > div > md-virtual-repeat-container > div > div.md-virtual-repeat-offsetter > div > span').first().click();

      // Datos de la empresa

      // Sectores
      const locatorSector = page.locator('#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(22) > canvas-component > div > div > div.component > div');

      // Se espera hasta el elemento div no tenga la clase is-loading, lo que significa que ya termino de cargar las nuevas lineas de la página.
      await expect(locatorSector).not.toHaveClass(/is-loading/);

      datos['sectores'] = await page.locator('#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(22) > canvas-component > div > div > div.component > div > div > lego-table > div > div.tableBody > div.row.block-0 > div').textContent();

      // Numero de empleados

      const locatorEmpleado = page.locator('#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(40) > canvas-component > div > div > div.component > div ');

      // Se espera hasta el elemento div no tenga la clase is-loading, lo que significa que ya termino de cargar las nuevas lineas de la página.
      await expect(locatorEmpleado).not.toHaveClass(/is-loading/);

      datos['empleados'] = await page.locator('#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(40) > canvas-component > div > div > div.component > div > div > lego-table > div > div.tableBody > div.row.block-0 > div').textContent();

      // publico

      const locatorPublico = page.locator('#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(28) > canvas-component > div > div > div.component > div ');

      // Se espera hasta el elemento div no tenga la clase is-loading, lo que significa que ya termino de cargar las nuevas lineas de la página.
      await expect(locatorPublico).not.toHaveClass(/is-loading/);

      datos['publico'] = await page.locator('#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(28) > canvas-component > div > div > div.component > div > div > lego-table > div > div.tableBody > div.row.block-0 > div').textContent();

      // Año Fundacion

      const locatorFundacion = page.locator('#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(29) > canvas-component > div > div > div.component > div ');

      // Se espera hasta el elemento div no tenga la clase is-loading, lo que significa que ya termino de cargar las nuevas lineas de la página.
      await expect(locatorFundacion).not.toHaveClass(/is-loading/);

      datos['fundacion'] = await page.locator('#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(29) > canvas-component > div > div > div.component > div > div > lego-table > div > div.tableBody > div.row.block-0 > div').textContent();

      // Ciudad

      const locatorCiudad = page.locator('#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(30) > canvas-component > div > div > div.component > div ');

      // Se espera hasta el elemento div no tenga la clase is-loading, lo que significa que ya termino de cargar las nuevas lineas de la página.
      await expect(locatorCiudad).not.toHaveClass(/is-loading/);

      datos['ciudad'] = await page.locator('#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(30) > canvas-component > div > div > div.component > div > div > lego-table > div > div.tableBody > div.row.block-0 > div').textContent();

      // Departamento

      const locatorDepartamento = page.locator('#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(31) > canvas-component > div > div > div.component > div ');

      // Se espera hasta el elemento div no tenga la clase is-loading, lo que significa que ya termino de cargar las nuevas lineas de la página.
      await expect(locatorDepartamento).not.toHaveClass(/is-loading/);

      datos['departamento'] = await page.locator('#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(31) > canvas-component > div > div > div.component > div > div > lego-table > div > div.tableBody > div.row.block-0 > div').textContent();

      // Sitio Web

      const locatorWeb = page.locator('#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(33) > canvas-component > div > div > div.component > div ');

      // Se espera hasta el elemento div no tenga la clase is-loading, lo que significa que ya termino de cargar las nuevas lineas de la página.
      await expect(locatorWeb).not.toHaveClass(/is-loading/);

      datos['web'] = await page.locator('#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(33) > canvas-component > div > div > div.component > div > div > lego-table > div > div.tableBody > div.row.block-0 > div > a').textContent();

      // LinkendIn

      const locatorLinkenin = page.locator('#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(35) > canvas-component > div > div > div.component > div ');

      // Se espera hasta el elemento div no tenga la clase is-loading, lo que significa que ya termino de cargar las nuevas lineas de la página.
      await expect(locatorLinkenin).not.toHaveClass(/is-loading/);

      datos['linkendin'] = await page.locator('#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(35) > canvas-component > div > div > div.component > div > div > lego-table > div > div.tableBody > div.row.block-0 > div > a').textContent();

      // DMS Score

      const locatorScore = page.locator('#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(37) > canvas-component > div > div > div.component > div ');

      // Se espera hasta el elemento div no tenga la clase is-loading, lo que significa que ya termino de cargar las nuevas lineas de la página.
      await expect(locatorScore).not.toHaveClass(/is-loading/);

      datos['score'] = await page.locator('#body > div > div > div.lego-reporting-view.activity-view.no-licensed.new-resizer.left-nav-full > div.page > div > div.mainBlock > div.alignHolder > div.scaleSizeHolder > div > lego-report > lego-canvas-container > div > file-drop-zone > span > content-section > div:nth-child(37) > canvas-component > div > div > div.component > div > div > lego-table > div > div.tableBody > div.row.block-0 > div').textContent();

      // Se preseiona la tecla escape
      // await page.keyboard.press('Escape');

      informacionEmpresas[listaEmpresas[index]] = datos;
      console.log(informacionEmpresas);
      //await page.pause();
    }

    //await page.screenshot({ path: `image.png` });
    await browser.close();
})();