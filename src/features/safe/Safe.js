import './Safe.scss';

import { useEffect, useState } from 'react';

import { Fsm } from '../../lib/fsm';
import Door from './components/Door';
import Keypad from './components/Keypad';
import Screen from './components/Screen';
import { initStatesForFsm, stateNames } from './machineStatesConfig';
import { BUTTON_VALUES, BUTTONS_SOUND_PATH, ERROR_SOUND_PATH, UNLOCK_SOUND_PATH, OPEN_SOUND_PATH } from './safeConsts';


function Safe() {
    const [fsm, setFsm] = useState(null);
    const [enteredCode, setEnteredCode] = useState();
    const [doorIsClosed, setDoorIsClosed] = useState(true);
    const [disabled, setDisabled] = useState(false);

    const buttonsSound = new Audio(BUTTONS_SOUND_PATH);

    function reset() {
        disableTemporarely(fsm.transition, '');
    }

    function disableTemporarely(callbackFunc, paramForFunc) {
        setDisabled(true);
        setTimeout(() => {
            if (callbackFunc) {
                callbackFunc(paramForFunc);
            }
            setDisabled(false);
        }, 2000);
    }

    useEffect(() => {
        let currentFsm;
        const sounds = {
            errorSound: new Audio(ERROR_SOUND_PATH),
            unlockSound: new Audio(UNLOCK_SOUND_PATH),
            openSound: new Audio(OPEN_SOUND_PATH)
        }
        const errCode = 'err1';

        function setSafeStateFromMachineState(machineStateValue) {
            setDoorIsClosed(machineStateValue.locked);
            setEnteredCode(machineStateValue.code);
        }

        // function reset() {
        //     disableTemporarely(currentFsm.transition, '');
        // }

        // function disableTemporarely(callbackFunc, paramForFunc) {
        //     setDisabled(true);
        //     setTimeout(() => {
        //         if (callbackFunc) {
        //             callbackFunc(paramForFunc);
        //         }
        //         setDisabled(false);
        //     }, 2000);
        // }

        function checkSafeCodeAndProceed(code) {
            setDisabled(true);
            fetch('http://localhost:3001/correctCode')
                .then(response => response.json())
                .then((data) => {
                    const correctCode = data[0];
                    setDisabled(false);
                    currentFsm.transition(correctCode);
                }).catch(e => {
                    console.error('OMG so sorry! There was a communication problem:', e);
                    // @ts-ignore
                    setEnteredCode(errCode);
                    setTimeout(() => {
                        currentFsm.transition(errCode);
                        setDisabled(false);
                    }, 2000);
                })
        }

        function openTheSafe(currentState) {
            setEnteredCode(currentState.value.code);
            sounds.unlockSound?.play();
            disableTemporarely();
            setTimeout(() => {
                setDoorIsClosed(currentState.value.locked);
                sounds.openSound?.play();
            }, 2000);
        }
        const states = initStatesForFsm(
            sounds,
            reset,
            checkSafeCodeAndProceed,
            openTheSafe,
            setSafeStateFromMachineState,
            errCode)
        currentFsm = new Fsm(stateNames.initial, states);
        setFsm(currentFsm);
    }, []);

    const buttonClickedHandler = (value) => {
        fsm.transition(value);
    }

    return (
        <main className="safe-wrapper">
            <div className='content'></div>
            <Door closed={doorIsClosed} />
            <div className="user-interface-wrapper">
                <Screen digits={enteredCode} />
                <Keypad buttonValues={BUTTON_VALUES} disabled={disabled} onButtonClick={(value) => buttonClickedHandler(value)} audio={buttonsSound} />
            </div>
        </main>
    );
}

export default Safe;


