import React from 'react';

interface DocumentIconProps {
    className?: string;
}

const DocumentIcon = ({ className }: DocumentIconProps): JSX.Element => (
    <svg
        className={className}
        width="19"
        height="22"
        viewBox="0 0 19 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.10623e-06 20.6439C8.10623e-06 20.8814 0.170109 21.0742 0.379697 21.0742H17.8454C18.055 21.0742 18.2251 20.8814 18.2251 20.6439V0.849431C18.2251 0.611897 18.055 0.419116 17.8454 0.419116H5.69535C5.64523 0.419116 5.59511 0.431165 5.54955 0.452681C5.50247 0.474196 5.46146 0.50604 5.42653 0.545628L0.112397 6.56917C0.0774653 6.60876 0.049367 6.6561 0.0303825 6.7086C0.0106387 6.76023 8.10623e-06 6.81617 8.10623e-06 6.87384V20.6439ZM17.4657 20.2136H0.759385V7.30415H5.69535C5.90494 7.30415 6.07504 7.11137 6.07504 6.87384V1.27975H17.4657V20.2136ZM1.29627 6.44352L5.31566 1.88821V6.44352H1.29627Z"
            fill="#0067C5"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.522 9.53074L15.3137 4.34349L15.5199 7.98956L16.2162 7.98166L15.9329 3.16042L11.1043 3.25956L11.1516 3.95431L14.8025 3.87128L10.0108 9.05853L10.522 9.53074Z"
            fill="#0067C5"
        />
    </svg>
);

export default DocumentIcon;