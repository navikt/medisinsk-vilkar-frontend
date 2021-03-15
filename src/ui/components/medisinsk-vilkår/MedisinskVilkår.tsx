import React, { useMemo } from 'react';
import { TabsPure } from 'nav-frontend-tabs';
import classnames from 'classnames';
import axios from 'axios';
import Infostripe from '../infostripe/Infostripe';
import StruktureringAvDokumentasjon from '../strukturering-av-dokumentasjon/StruktureringAvDokumentasjon';
import VilkårsvurderingAvTilsynOgPleie from '../vilkårsvurdering-av-tilsyn-og-pleie/VilkårsvurderingAvTilsynOgPleie';
import VilkårsvurderingAvToOmsorgspersoner from '../vilkårsvurdering-av-to-omsorgspersoner/VilkårsvurderingAvToOmsorgspersoner';
import styles from './medisinskVilkår.less';
import Steg, { dokumentSteg, StegId, tilsynOgPleieSteg, toOmsorgspersonerSteg } from '../../../types/Steg';
import { get } from '../../../util/httpUtils';
import SykdomsstegStatusResponse from '../../../types/SykdomsstegStatusResponse';
import ContainerContext from '../../context/ContainerContext';
import { finnNesteSteg } from '../../../util/statusUtils';
import PageContainer from '../page-container/PageContainer';
import WarningIcon from '../icons/WarningIcon';

const alleSteg: Steg[] = [dokumentSteg, tilsynOgPleieSteg, toOmsorgspersonerSteg];

interface TabItemProps {
    label: string;
    showWarningIcon: boolean;
}

const TabItem = ({ label, showWarningIcon }: TabItemProps) => {
    const cls = classnames(styles.medisinskVilkårTabItem, {
        [styles.medisinskVilkårTabItemExtended]: showWarningIcon,
    });
    return (
        <div className={cls}>
            {label}
            {showWarningIcon && (
                <div className={styles.medisinskVilkårTabItem__warningIcon}>
                    <WarningIcon />
                </div>
            )}
        </div>
    );
};

const MedisinskVilkår = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [aktivtSteg, setAktivtSteg] = React.useState<Steg>(null);
    const [markertSteg, setMarkertSteg] = React.useState(null);
    const [harGyldigSignatur, setHarGyldigSignatur] = React.useState(undefined);
    const { endpoints, httpErrorHandler } = React.useContext(ContainerContext);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    const hentSykdomsstegStatus = () => {
        return get<SykdomsstegStatusResponse>(endpoints.status, httpErrorHandler, { cancelToken: httpCanceler.token });
    };

    React.useEffect(() => {
        hentSykdomsstegStatus().then((status) => {
            const steg = finnNesteSteg(status);
            setAktivtSteg(steg || dokumentSteg);
            setMarkertSteg(steg);
            setHarGyldigSignatur(!status.manglerGodkjentLegeerklæring);
            setIsLoading(false);
        });
    }, []);

    const navigerTilSteg = (steg: Steg) => {
        setAktivtSteg(steg);
        setMarkertSteg(steg);
    };

    return (
        <PageContainer isLoading={isLoading}>
            <Infostripe />
            <div className={styles.medisinskVilkår}>
                <h1 style={{ fontSize: 22 }}>Sykdom</h1>
                <TabsPure
                    kompakt
                    tabs={alleSteg.map((steg) => {
                        return {
                            label: <TabItem label={steg.tittel} showWarningIcon={steg === markertSteg} />,
                            aktiv: steg === aktivtSteg,
                        };
                    })}
                    onChange={(event, clickedIndex) => setAktivtSteg(alleSteg[clickedIndex])}
                />
                <div style={{ marginTop: '1rem', maxWidth: '1204px' }}>
                    <div className={styles.medisinskVilkår__vilkårContentContainer}>
                        {aktivtSteg === dokumentSteg && (
                            <StruktureringAvDokumentasjon
                                navigerTilNesteSteg={navigerTilSteg}
                                hentSykdomsstegStatus={hentSykdomsstegStatus}
                            />
                        )}
                        {aktivtSteg === tilsynOgPleieSteg && (
                            <VilkårsvurderingAvTilsynOgPleie
                                navigerTilNesteSteg={navigerTilSteg}
                                hentSykdomsstegStatus={hentSykdomsstegStatus}
                                harGyldigSignatur={harGyldigSignatur}
                            />
                        )}
                        {aktivtSteg === toOmsorgspersonerSteg && (
                            <VilkårsvurderingAvToOmsorgspersoner
                                navigerTilNesteSteg={navigerTilSteg}
                                hentSykdomsstegStatus={hentSykdomsstegStatus}
                                harGyldigSignatur={harGyldigSignatur}
                            />
                        )}
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};

export default MedisinskVilkår;
