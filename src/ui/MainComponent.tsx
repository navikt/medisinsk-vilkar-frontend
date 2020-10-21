import { Knapp } from 'nav-frontend-knapper';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Sykdom from '../types/medisinsk-vilkår/sykdom';
import { required } from './form/validators';
import Datepicker from './form/wrappers/DatePicker';
import YesOrNoQuestion from './form/wrappers/YesOrNoQuestion';

const tabs = ['Legeerklæring', 'Vilkårsvurdering'];

interface MainComponentProps {
    sykdom: Sykdom;
}

const MainComponent = ({ sykdom }: MainComponentProps): JSX.Element => {
    const [activeTab, setActiveTab] = useState(0);
    const { handleSubmit, control, errors } = useForm();
    const onSubmit = (v) => {
        console.log(v);
    };

    return (
        <div style={{ margin: '2rem' }}>
            {/* <div className={styles.headingContainer}>
                <Systemtittel>Fakta</Systemtittel>
            </div>
            <div className={styles.fieldContainerLarge}>
                <TabsPure
                    tabs={tabs.map((tab, index) => ({
                        aktiv: activeTab === index,
                        label: tab,
                    }))}
                    onChange={(e, clickedIndex) => setActiveTab(clickedIndex)}
                />
                <div className={styles.fieldContainerLarge}>
                    <div className={activeTab === 0 ? '' : styles.hide}>
                        <Legeerklæring thisTab={0} changeTab={setActiveTab} sykdom={sykdom} />
                    </div>
                </div>
            </div> */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <YesOrNoQuestion
                    question="Finnes det dokumentasjon som er signert av en sykehuslege eller en lege i speisalisthelsetjenesten?"
                    name="harDokumentasjon"
                    control={control}
                    errors={errors}
                    validators={{ required }}
                />
                <Datepicker
                    label="Når ble legeerklæringen signert?"
                    control={control}
                    name="legeerklæringSignert"
                    validators={{ required }}
                    errors={errors}
                    limitations={{
                        minDate: '2020-10-05',
                        maxDate: '2020-10-30',
                    }}
                />
                <Knapp>Lagre</Knapp>
            </form>
        </div>
    );
};

export default MainComponent;
