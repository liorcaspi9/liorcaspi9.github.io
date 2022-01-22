import './Safe.scss';

import { useMemo, useState } from 'react';

import Door from './components/Door';
import Keypad from './components/Keypad';
import Screen from './components/Screen';
import { BUTTON_VALUES, BUTTONS_SOUND_PATH, ERROR_SOUND_PATH, OPEN_SOUND_PATH, UNLOCK_SOUND_PATH } from './safeConsts';
import { safeStateMachineFactory } from './safeStateMachineFactory';

function Safe() {
    const [enteredCode, setEnteredCode] = useState();
    const [doorIsClosed, setDoorIsClosed] = useState(true);
    const [disabled, setDisabled] = useState(false);

    let fsm;

    const sounds = {
        errorSound: new Audio(ERROR_SOUND_PATH),
        unlockSound: new Audio(UNLOCK_SOUND_PATH),
        openSound: new Audio(OPEN_SOUND_PATH),
        buttonsSound: new Audio(BUTTONS_SOUND_PATH)
    }
    const errCode = 'err1';

    function checkSafeCodeAndProceed(code) {
        setDisabled(true);
        fetch('http://localhost:3001/correctCode')
            .then(response => response.json())
            .then((data) => {
                const correctCode = data[0];
                setDisabled(false);
                fsm.transition(correctCode);
            }).catch(e => {
                //for github only
                if (window.location.href.includes('github')) {
                    setDisabled(false);
                    fsm.transition('1234');
                }
                console.error('OMG so sorry! There was a communication problem:', e);
                // @ts-ignore
                setEnteredCode(errCode);
                setTimeout(() => {
                    fsm.transition(errCode);
                    setDisabled(false);
                }, 2000);
            })
    }

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

    function setSafeStateFromMachineState(machineStateValue) {
        setDoorIsClosed(machineStateValue.locked);
        setEnteredCode(machineStateValue.code);
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

    function buttonClickedHandler(value) {
        fsm.transition(value);
    }

    fsm = useMemo(() => {
        return safeStateMachineFactory(
            sounds,
            reset,
            checkSafeCodeAndProceed,
            openTheSafe,
            setSafeStateFromMachineState,
            errCode)
    }, []);

    return (
        <main className="safe-wrapper">
            <div className='content'></div>
            <Door closed={doorIsClosed} />
            <div className="user-interface-wrapper">
                <Screen digits={enteredCode} />
                <Keypad
                    buttonValues={BUTTON_VALUES}
                    disabled={disabled}
                    onButtonClick={(value) => buttonClickedHandler(value)}
                    audio={sounds.buttonsSound} />
            </div>
        </main>
    );
}

export default Safe;


