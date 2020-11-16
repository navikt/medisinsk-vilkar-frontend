import React from 'react';
import { Period } from '../../types/Period';

const SøknadsperiodeContext = React.createContext<Period | null>(null);
export default SøknadsperiodeContext;
