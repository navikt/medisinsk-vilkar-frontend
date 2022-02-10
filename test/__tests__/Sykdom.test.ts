import puppeteer from 'puppeteer';

it('no Sykdom visual regression', async () => {
    const browser = await puppeteer.launch({ headless: true, args: ['--font-render-hinting=none'] });
    const page = await browser.newPage();
    const response = await page.goto('http://localhost:8081/');
    await page.setViewport({
        width: 1440,
        height: 900,
    });
    expect(response.status()).toBe(200);
    /** ************************************* */
    await page.waitForSelector('#medisinskVilkår', { timeout: 5_000 });
    await expect(page).toMatch('Dokumenter til behandling');
    const dokumentasjonFørInput = await page.screenshot({ fullPage: true });
    expect(dokumentasjonFørInput).toMatchImageSnapshot();
    await expect(page).toClick('label', { text: 'Ja, legeerklæring fra sykehus/spesialisthelsetjenesten' });
    await expect(page).toFill('input[id="datertField"]', '101021');
    await expect(page).toClick('button', { text: 'Bekreft' });
    await page.waitForSelector('div[data-testid="dokumentasjon-ferdig"]', { timeout: 5_000 });
    const dokumentasjonEtterInput = await page.screenshot({ fullPage: true });
    expect(dokumentasjonEtterInput).toMatchImageSnapshot();
    await expect(page).toClick('button', { text: 'Fortsett' });
    /** ************************************* */
    await expect(page).toMatch('Vurdering av tilsyn og pleie');
    const tilsynOgPleieFørInput = await page.screenshot({ fullPage: true });
    expect(tilsynOgPleieFørInput).toMatchImageSnapshot();
    await expect(page).toClick('input[type="checkbox"]');
    await expect(page).toFill('textarea[name="vurderingAvKontinuerligTilsynOgPleie"]', 'test');
    await expect(page).toClick('input[id="harBehovForKontinuerligTilsynOgPleieYES"]');
    await expect(page).toClick('button', { text: 'Bekreft' });
    const tilsynOgPleieModal = await page.screenshot({ fullPage: true });
    expect(tilsynOgPleieModal).toMatchImageSnapshot();
    await expect(page).toClick('button[data-testid="modal-confirm-button"]');
    const tilsynOgPleieEtterInput = await page.screenshot({ fullPage: true });
    expect(tilsynOgPleieEtterInput).toMatchImageSnapshot();
    await expect(page).toClick('button', { text: 'Eventuelle endringer er registrert' });
    /** ************************************* */
    await expect(page).toMatch('Vurdering av to omsorgspersoner');
    const tomOmsorgspersonerFørInput = await page.screenshot({ fullPage: true });
    expect(tomOmsorgspersonerFørInput).toMatchImageSnapshot();
    await browser.close();
});