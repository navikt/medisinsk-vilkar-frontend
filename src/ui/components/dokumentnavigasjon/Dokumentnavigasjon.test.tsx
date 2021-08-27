import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dokumentnavigasjon from './Dokumentnavigasjon';
import mockedDokumentoversikt from '../../../../mock/mocked-data/mockedDokumentoversikt';

describe('Dokumenter', () => {
    const { dokumenter } = mockedDokumentoversikt;
    test('rendrer dokumenter', async () => {
        render(
            <Dokumentnavigasjon
                dokumenter={[dokumenter[0], dokumenter[1]]}
                dokumenterSomMåGjennomgås={[dokumenter[2]]}
                onDokumentValgt={() => null}
            />
        );

        expect(screen.getByText(/ikke klassifisert/i)).toBeTruthy();
        expect(screen.getByText(/andre med. oppl./i)).toBeTruthy();
        expect(screen.getByText(/ikke med. oppl./i)).toBeTruthy();
    });

    test('alle dokumenter vises initielt', () => {
        render(
            <Dokumentnavigasjon
                dokumenter={[dokumenter[0], dokumenter[1]]}
                dokumenterSomMåGjennomgås={[dokumenter[2]]}
                onDokumentValgt={() => null}
            />
        );

        userEvent.click(screen.getAllByText(/type/i)[0]);
        const ikkeKlassifisertCheckbox = screen.getByLabelText(/ikke klassifisert/i);
        const andreMedisinskeOpplysningerCheckbox = screen.getByLabelText(/andre med. oppl./i);
        const ikkeMedisinskeOpplysninger = screen.getByLabelText(/ikke med. oppl./i);
        const legeerklæring = screen.getByLabelText('Sykehus/spesialist.');

        expect(ikkeKlassifisertCheckbox).toBeChecked();
        expect(andreMedisinskeOpplysningerCheckbox).toBeChecked();
        expect(ikkeMedisinskeOpplysninger).toBeChecked();
        expect(legeerklæring).toBeChecked();

        userEvent.click(screen.getAllByText(/type/i)[1]);

        expect(screen.getByText(/ikke klassifisert/i)).toBeTruthy();
        expect(screen.getByText(/andre med. oppl./i)).toBeTruthy();
        expect(screen.getByText(/ikke med. oppl./i)).toBeTruthy();
    });

    test('dokumenttyper som ikke er avhuket vises ikke', () => {
        render(
            <Dokumentnavigasjon
                dokumenter={[dokumenter[0], dokumenter[1]]}
                dokumenterSomMåGjennomgås={[dokumenter[2]]}
                onDokumentValgt={() => null}
            />
        );
        expect(screen.getByText(/ikke klassifisert/i)).toBeTruthy();

        userEvent.click(screen.getAllByText(/type/i)[0]);

        const ikkeKlassifisertCheckbox = screen.getByLabelText(/ikke klassifisert/i);
        userEvent.click(ikkeKlassifisertCheckbox);
        userEvent.click(screen.getAllByText(/type/i)[1]);

        expect(screen.queryByText(/ikke klassifisert/i)).toBeFalsy();
    });

    test('dropdown lukker seg ved klikk utenfor container', () => {
        render(
            <Dokumentnavigasjon
                dokumenter={[dokumenter[0], dokumenter[1]]}
                dokumenterSomMåGjennomgås={[dokumenter[2]]}
                onDokumentValgt={() => null}
            />
        );

        userEvent.click(screen.getAllByText(/type/i)[0]);
        let ikkeKlassifisertCheckbox = screen.queryByLabelText(/ikke klassifisert/i);
        expect(ikkeKlassifisertCheckbox).toBeTruthy()

        userEvent.click(document.body)
        ikkeKlassifisertCheckbox = screen.queryByLabelText(/ikke klassifisert/i);
        expect(ikkeKlassifisertCheckbox).toBeFalsy()
    })
});