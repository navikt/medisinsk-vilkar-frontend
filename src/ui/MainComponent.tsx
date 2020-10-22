import React from 'react';
import { useForm } from 'react-hook-form';
import { Knapp } from 'nav-frontend-knapper';
import YesOrNoQuestion from './form/wrappers/YesOrNoQuestion';
import { required } from './form/validators';
import RadioGroupPanel from './form/wrappers/RadioGroupPanel';

const harDokumentasjonFieldName = 'harDokumentasjon';

const MainComponent = () => {
    const { handleSubmit, control, errors, watch } = useForm();
    const onSubmit = () => {};

    const harDokumentasjon = watch(harDokumentasjonFieldName);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <YesOrNoQuestion
                question="Finnes det dokumentasjon som er signert av en sykehuslege eller en lege i speisalisthelsetjenesten?"
                name={harDokumentasjonFieldName}
                control={control}
                errors={errors}
                validators={{ required }}
            />

            {harDokumentasjon === false && (
                <RadioGroupPanel
                    question="Hvem har signert legeerklæringen?"
                    name="signertAv"
                    radios={[
                        { label: 'Fastlege', value: 'fastlege' },
                        { label: 'Annen yrkesgruppe', value: 'annenYrkesgruppe' },
                    ]}
                    control={control}
                    errors={errors}
                    validators={{ required }}
                />
            )}
            <Knapp>Lagre</Knapp>
        </form>
    );
};

export default MainComponent;
