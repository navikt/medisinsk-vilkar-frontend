import React from 'react';
import { useForm } from 'react-hook-form';
import { Knapp } from 'nav-frontend-knapper';
import YesOrNoQuestion from './form/wrappers/YesOrNoQuestion';
import { required } from './form/validators';

const MainComponent = () => {
    const { handleSubmit, control, errors } = useForm();
    const onSubmit = () => {};

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <YesOrNoQuestion
                question="Finnes det dokumentasjon som er signert av en sykehuslege eller en lege i speisalisthelsetjenesten?"
                name="harDokumentasjon"
                control={control}
                errors={errors}
                validators={{ required }}
            />
            <Knapp>Lagre</Knapp>
        </form>
    );
};

export default MainComponent;
