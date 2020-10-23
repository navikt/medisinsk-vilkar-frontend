import * as React from 'react';
import { required } from '../form/validators';
import YesOrNoQuestion from '../form/wrappers/YesOrNoQuestion';

const Vilkårsvurdering = (): JSX.Element => {
    return (
        <YesOrNoQuestion
            question="Er dette vilkårsvurdering?"
            name="vilkårsvurdering"
            validators={{ required }}
        />
    );
};

export default Vilkårsvurdering;
