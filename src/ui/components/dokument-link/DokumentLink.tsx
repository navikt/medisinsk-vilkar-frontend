import React from 'react';
import Lenke from 'nav-frontend-lenker';
import dayjs from 'dayjs';
import Dokument, { Dokumenttype } from '../../../types/Dokument';
import { prettifyDate } from '../../../util/formats';
import IconWithTooltip from '../icon-with-tooltip/IconWithTooltip';
import OnePersonOutline from '../icons/OnePersonOutline';
import styles from './dokumentLink.less';

interface DokumentLinkProps {
    dokument: Dokument;
    etikett?: string;
}

const renderDokumenttypeText = (dokumenttype: Dokumenttype) => {
    if (dokumenttype === Dokumenttype.LEGEERKLÆRING) {
        return 'Legeerklæring';
    }
    if (dokumenttype === Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER) {
        return 'Andre medisinske opplysninger';
    }
};

const DokumentLink = ({ dokument, etikett }: DokumentLinkProps) => {
    const { type, datert, location } = dokument;
    return (
        <Lenke
            href={location}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            {renderDokumenttypeText(type)} ({prettifyDate(dayjs(datert).utc(true).toISOString())})
            <div className={styles.dokumentLink__etikett}>
                {etikett && (
                    <IconWithTooltip
                        renderIcon={() => <OnePersonOutline />}
                        tooltipText={etikett}
                        tooltipDirectionRight
                    />
                )}
            </div>
        </Lenke>
    );
};

export default DokumentLink;
