import './Safe.scss';

import { useMemo, useState } from 'react';

import Door from './components/Door';
import Keypad from './components/Keypad';
import Screen from './components/Screen';
import { BUTTON_VALUES, ERROR_TEXT, SOUNDS } from './safeConsts';
import { safeStateMachineFactory } from './safeStateMachineFactory';

function Safe() {
    const [enteredCode, setEnteredCode] = useState();
    const [doorIsClosed, setDoorIsClosed] = useState(true);
    const [disabled, setDisabled] = useState(false);

    let fsm;

    function checkSafeCodeAndProceed(code) {
        setDisabled(true);
        fetch('http://localhost:3001/correctCode')
            .then(response => response.json())
            .then((data) => {
                const correctCode = data[0];
                setDisabled(false);
                fsm.transition(correctCode);
            }).catch(e => {
                //for github only- always succeed
                if (window.location.href.includes('github')) {
                    setDisabled(false);
                    fsm.transition('1234');
                }
                else {
                    console.error('OMG so sorry! There was a communication problem:', e);
                    // @ts-ignore
                    setEnteredCode(ERROR_TEXT);
                    setTimeout(() => {
                        fsm.transition(ERROR_TEXT);
                        setDisabled(false);
                    }, 2000);
                }
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
        SOUNDS.UNLOCK_SOUND?.play();
        disableTemporarely();
        setTimeout(() => {
            setDoorIsClosed(currentState.value.locked);
            SOUNDS.OPEN_SOUND?.play();
        }, 2000);
    }

    function buttonClickedHandler(value) {
        fsm.transition(value);
    }

    fsm = useMemo(() => {
        return safeStateMachineFactory(
            reset,
            checkSafeCodeAndProceed,
            openTheSafe,
            setSafeStateFromMachineState)
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
                    audio={SOUNDS.BUTTONS_SOUND} />
            </div>
        </main>
    );
}

export default Safe;


