import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ContainerContext from '../../../context/ContainerContext';
import WriteAccessBoundContent from '../WriteAccessBoundContent';

const testContent = 'Dette er en test';

const writeAccessBoundContentRenderer = (readOnly: boolean, otherRequirementsAreMet: boolean = true) =>
    render(
        <ContainerContext.Provider value={{ readOnly } as any}>
            <WriteAccessBoundContent
                contentRenderer={() => <span>{testContent}</span>}
                otherRequirementsAreMet={true}
            />
        </ContainerContext.Provider>
    );

describe('WriteAccessBoundContent', () => {
    it('should show content if readOnly is false', () => {
        writeAccessBoundContentRenderer(false);
        expect(screen.getByText(testContent)).toBeInTheDocument();
    });

    it('should show content if readOnly is false and otherRequirementsAreMet is true', () => {
        writeAccessBoundContentRenderer(false, true);
        expect(screen.getByText(testContent)).toBeInTheDocument();
    });

    it('should hide content if readOnly is true', () => {
        writeAccessBoundContentRenderer(true);
        expect(screen.queryByText(testContent)).toBeNull();
    });

    it('should hide content if readOnly is false while otherRequirementsAreMet are false', () => {
        writeAccessBoundContentRenderer(true, false);
        expect(screen.queryByText(testContent)).toBeNull();
    });
});
