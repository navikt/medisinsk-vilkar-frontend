import React from 'react';
import Diagnosekode from '../../types/Diagnosekode'

const DiagnosekodeContext = React.createContext<(diagnosekoder: {koder: Array<Diagnosekode>, hasLoaded: boolean}) => void | null>(null);
export default DiagnosekodeContext;
