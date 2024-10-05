import Aos from "aos";
import { useEffect } from "react";
import "aos/dist/aos.css";

export default function AosInit() {
    useEffect(() => {
        Aos.init({
            offset: 100,
            duration: 500,
            easing: 'ease-in-sine',
            delay: 100,
        });
    }, []);
    return null;
}
