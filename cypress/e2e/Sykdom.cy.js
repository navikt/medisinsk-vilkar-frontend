describe('Sykdom', () => {
    before(() => {
        cy.visit('/');
    });
    it('skal kunne håndtere dokumentasjon av sykdom', () => {
        cy.contains('Ja, legeerklæring fra sykehus/spesialisthelsetjenesten').should('exist').click();
        cy.findByLabelText(/Hvilken dato er dokumentet datert?/).type('101021');
        cy.contains('Bekreft').should('exist').click();
    });
    it('skal kunne legge inn innleggelsesperioder', () => {
        cy.visit('/');
        cy.contains('Dokumentasjon av sykdom').should('exist').click();
        cy.contains('Rediger liste').should('exist').click();
        cy.contains('Legg til innleggelsesperiode').should('exist').click();
        cy.get('input[id="innleggelsesperioder[3].fom"]').type('010123');
        cy.get('input[id="innleggelsesperioder[3].tom"]').type('300123');
        cy.contains('Bekreft').should('exist').click();
    });
    it('skal kunne håndtere tilsyn og pleie', () => {
        cy.visit('/');
        cy.get('[type="checkbox"]').first().check({ force: true });
        cy.get('[name="vurderingAvKontinuerligTilsynOgPleie"]').type('test');
        cy.get('input[id="harBehovForKontinuerligTilsynOgPleieYES"]').check({ force: true });
        cy.get('input[id="perioder[0].tom"]').clear().type('020322');
        cy.get('input[id="perioder[0].fom"]').click();
        cy.contains('Perioden som vurderes må være innenfor en eller flere sammenhengede søknadsperioder').should(
            'exist'
        );
        cy.get('input[id="perioder[0].tom"]').clear().type('280222');
        cy.get('input[id="perioder[0].fom"]').click();
        cy.contains('Perioden som vurderes må være innenfor en eller flere sammenhengede søknadsperioder').should(
            'not.exist'
        );
        cy.contains(
            'Du har ikke vurdert alle periodene som må vurderes. Resterende perioder vurderer du etter at du har lagret denne.'
        ).should('exist');
        cy.get('input[id="perioder[0].tom"]').clear().type('010322');
        cy.get('input[id="perioder[0].fom"]').click();
        cy.contains(
            'Du har ikke vurdert alle periodene som må vurderes. Resterende perioder vurderer du etter at du har lagret denne.'
        ).should('not.exist');
        cy.contains('Bekreft').should('exist').click();
        cy.get('.ReactModalPortal').find('button').contains('Bekreft').should('exist').click();
        cy.contains('Eventuelle endringer er registrert').should('exist').click();
    });
    it('skal kunne håndtere to omsorgspersoner', () => {
        cy.visit('/');
        cy.get('[type="checkbox"]').first().check({ force: true });
        cy.get('[name="vurderingAvToOmsorgspersoner"]').type('test');
        cy.get('input[id="harBehovForToOmsorgspersonerYES"]').check({ force: true });
        cy.contains('Bekreft').should('exist').click();
        cy.get('.ReactModalPortal').find('button').contains('Bekreft').should('exist').click();
        cy.contains('Sykdom er ferdig vurdert og du kan gå videre i behandlingen.').should('exist');
    });
});
