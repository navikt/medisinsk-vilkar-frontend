import React, { useEffect } from 'react';

const MainComponent = () => {
    useEffect(() => console.log('medisinsk vilkår frontend'));

    return <h3>Medisinsk vilkår</h3>;
};

export default MainComponent;
