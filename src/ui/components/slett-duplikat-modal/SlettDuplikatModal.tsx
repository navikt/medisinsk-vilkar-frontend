import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { Box, Margin, PageError } from '@navikt/ft-plattform-komponenter';
import { post } from '@navikt/k9-http-utils';
import axios from 'axios';
import React, { useMemo, useState } from 'react';
import LinkRel from '../../../constants/LinkRel';
import Dokument from '../../../types/Dokument';
import { findLinkByRel } from '../../../util/linkUtils';
import scrollUp from '../../../util/viewUtils';
import ContainerContext from '../../context/ContainerContext';
import ModalFormWrapper from '../modal-form-wrapper/ModalFormWrapper';
import styles from './slettDuplikatModal.css';

interface SlettDuplikatModalProps {
    handleCloseModal: () => void;
    selectedDocument: Dokument;
    onRemove: () => void;
}

const SlettDuplikatModal = ({ handleCloseModal, selectedDocument, onRemove }: SlettDuplikatModalProps): JSX.Element => {
    const { httpErrorHandler } = React.useContext(ContainerContext);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [removeDuplikatFeilet, setRemoveDuplikatFeilet] = useState(false);

    React.useEffect(
        () => () => {
            httpCanceler.cancel();
        },
        []
    );
    const removeDuplikatreferanse = () => {
        const endreDkumentLink = findLinkByRel(LinkRel.ENDRE_DOKUMENT, selectedDocument.links);
        const { href, requestPayload } = endreDkumentLink;

        const dokumentUtenDuplikat = {
            ...selectedDocument,
            duplikatAvId: null,
        };
        setRemoveDuplikatFeilet(false);
        setIsSubmitting(true);
        post(href, { ...requestPayload, ...dokumentUtenDuplikat }, httpErrorHandler, {
            cancelToken: httpCanceler.token,
        }).then(
            () => {
                setIsSubmitting(false);
                scrollUp();
                onRemove();
            },
            () => {
                setIsSubmitting(false);
                scrollUp();
                setRemoveDuplikatFeilet(true);
            }
        );
    };
    return (
        <Modal open closeButton onClose={handleCloseModal}>
            <Modal.Content>
                <ModalFormWrapper title="Fjern som duplikat">
                    <BodyShort size="small">
                        Når du fjerner et dokument som duplikat vil det bli lagt som et eget dokument i listen.
                    </BodyShort>
                    {removeDuplikatFeilet && (
                        <Box marginTop={Margin.medium}>
                            <PageError message="Noe gikk galt, vennligst prøv igjen senere" />
                        </Box>
                    )}
                    <div className={styles.buttonContainer}>
                        <Button
                            id="submitButton"
                            onClick={(e) => {
                                e.preventDefault();
                                removeDuplikatreferanse();
                            }}
                            loading={isSubmitting}
                            disabled={isSubmitting}
                        >
                            Fjern som duplikat
                        </Button>
                        <div className={styles.cancelButton}>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Avbryt
                            </Button>
                        </div>
                    </div>
                </ModalFormWrapper>
            </Modal.Content>
        </Modal>
    );
};
export default SlettDuplikatModal;
