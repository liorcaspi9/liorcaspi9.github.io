import { useEffect, useState } from "react";
import { Fsm, State, StateEvents, Transition } from './../../lib';

const stateNames = {
    initial: 'initial',
    oneDigit: 'oneDigit',
    twoDigits: 'twoDigits',
    threeDigits: 'threeDigits',
    error: 'error',
    open: 'open',
}
/**
 *
 *
 * @export
 * @return {function(*):State} 
 */
export default function useSfm() {
    const [fsm, setFsm] = useState(null);
    const [enteredCode, setEnteredCode] = useState('');

    // setEnteredCode((old) => {
    //     let currentCode = old.concat(value);
    //     if (currentCode.length === 4) {
    //         currentCode = handleAllCodeEnetered(currentCode);
    //     }
    //     return currentCode;
    // });

    // const handleAllCodeEnetered = (currentCode) => {
    //     currentCode = '****';
    //     const snd = new Audio("sounds/beep-03.mp3");
    //     snd.play();
    //     return currentCode;
    // }

    useEffect(() => {
        const states = {
            [stateNames.initial]: new State(stateNames.initial, new StateEvents(), new Transition((someState, value) => states[stateNames.oneDigit])),
            [stateNames.oneDigit]: new State(stateNames.oneDigit, new StateEvents(), new Transition((someState, value) => states[stateNames.twoDigits])),
            [stateNames.twoDigits]: new State(stateNames.twoDigits, new StateEvents(), new Transition((someState, value) => states[stateNames.threeDigits])),
            [stateNames.threeDigits]: new State(stateNames.threeDigits, new StateEvents(), new Transition((someState, value) => states[stateNames.open])),
            [stateNames.error]: new State(stateNames.error, new StateEvents(), new Transition((someState, value) => states[stateNames.initial])),
            [stateNames.open]: new State(stateNames.open, new StateEvents(), new Transition((someState, value) => states[stateNames.open])),
        }
        setFsm(new Fsm(states[stateNames.initial], states));
    }, []);

    return fsm?.transition;
}
