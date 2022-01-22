import './Safe.scss';

import { useEffect, useState } from 'react';

import { Fsm } from '../../lib';
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

    useEffect(() => {
        const sounds = {
            errorSound: new Audio(ERROR_SOUND_PATH),
            unlockSound: new Audio(UNLOCK_SOUND_PATH),
            openSound: new Audio(OPEN_SOUND_PATH)
        }

        function reset() {
            disableTemporarely(currentFsm.transition, '');
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

        let currentFsm;
        const states = initStatesForFsm(setDoorIsClosed, setEnteredCode, sounds, reset, disableTemporarely)
        currentFsm = new Fsm(stateNames.initial, states);
        setFsm(currentFsm);
    }, []);

    const buttonClickedHandler = (value) => {
        fsm.transition(value);
    }

    return (
        <div className="safe-wrapper">
            <div className='content'></div>
            <Door closed={doorIsClosed} />
            <div className="user-interface-wrapper">
                <Screen digits={enteredCode} />
                <Keypad buttonValues={BUTTON_VALUES} disabled={disabled} onButtonClick={(value) => buttonClickedHandler(value)} audio={buttonsSound} />
            </div>
        </div>
    );
}

export default Safe;


