import { IStaticMethods } from 'preline/preline';
import React, { useEffect } from 'react'
declare global {
    interface Window {
        HSStaticMethods: IStaticMethods ;
    }
}

export default function Preline() {
    useEffect(() => {
        window.HSStaticMethods.autoInit();
    }, [location.pathname]);
    return null;
}

