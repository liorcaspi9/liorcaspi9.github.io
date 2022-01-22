import { State } from '../../lib/fsm';
import { BACKSPACE_CHARACTER, OPEN_CHARACTER } from './safeConsts';

export const stateNames = {
    initial: 'initial',
    oneDigit: 'oneDigit',
    twoDigits: 'twoDigits',
    threeDigits: 'threeDigits',
    error: 'error',
    unlocked: 'unlocked',
    open: 'open',
}

export function initStatesForFsm(setDoorIsClosed, setEnteredCode, sounds, reset, disableTemporarely) {
    // always return a new copy so it cant be changed!
    const initialMachineValue = () => { return { locked: true, code: '' } };

    const states = {
        [stateNames.initial]: new State({
            value: initialMachineValue(),
            enter: (currentState, value) => {
                currentState.value = initialMachineValue();
                setSafeStateFromMachineState(currentState.value);
            },
            transition: (currentState, value) => {
                return decideDirectionToGo(value, currentState, stateNames.initial, stateNames.oneDigit);
            }
        }),
        [stateNames.oneDigit]: new State({
            value: initialMachineValue(),
            enter: (currentState, value) => {
                if (value) {
                    currentState.value = { locked: true, code: value };
                }
                setSafeStateFromMachineState(currentState.value)
            },
            transition: (currentState, value) => {
                return decideDirectionToGo(value, currentState, stateNames.initial, stateNames.twoDigits);
            }
        }),
        [stateNames.twoDigits]: new State({
            value: initialMachineValue(),
            enter: (currentState, value) => {
                if (value) {
                    currentState.value = { locked: true, code: value };
                }
                setSafeStateFromMachineState(currentState.value)
            },
            transition: (currentState, value) => {
                return decideDirectionToGo(value, currentState, stateNames.oneDigit, stateNames.threeDigits);
            }
        }),
        [stateNames.threeDigits]: new State({
            value: initialMachineValue(),
            enter: (currentState, value) => {
                currentState.value = { locked: true, code: value };
                setSafeStateFromMachineState(currentState.value);
            },
            transition: (currentState, value) => {
                const currentCode = currentState.value.code + value;

                const correctCode = '1234'; //TODO: Getcode from 'server';

                const targetStateKey = currentCode !== correctCode ? stateNames.error : stateNames.unlocked;
                return decideDirectionToGo(value, currentState, stateNames.twoDigits, targetStateKey);
            }
        }),
        [stateNames.error]: new State({
            value: initialMachineValue(),
            enter: (currentState, value) => {
                currentState.value.code = '****';
                sounds.errorSound?.play();
                setSafeStateFromMachineState(currentState.value);
                reset();
            },
            transition: (currentState, value) => {
                return { targetStateKey: stateNames.initial, data: value };
            }
        }),
        [stateNames.unlocked]: new State({
            value: { locked: false, code: 'open' },
            enter: (currentState, value) => {
                currentState.value = { locked: true, code: 'open' };
                sounds.unlockSound?.play();
                disableTemporarely();
                setSafeStateFromMachineState(currentState.value);
            },
            transition: (currentState, value) => {
                let targetState = stateNames.initial;
                if (value === OPEN_CHARACTER) {
                    targetState = stateNames.open;
                }
                return { targetStateKey: targetState, data: value };
            }
        }),
        [stateNames.open]: new State({
            value: { locked: false, code: 'open' },
            enter: (currentState, value) => {
                disableTemporarely();
                sounds.openSound?.play();
                currentState.value = { locked: false, code: 'open' };
                setSafeStateFromMachineState(currentState.value);
            },
            transition: (currentState, value) => {
                return { targetStateKey: stateNames.initial, data: value };
            }
        }),
    };
    return states;

    function setSafeStateFromMachineState(machineStateValue) {
        setDoorIsClosed(machineStateValue.locked);
        setEnteredCode(machineStateValue.code);
    }

    function decideDirectionToGo(value, currentState, backStateKey, forwardStateKey) {
        let targetStateKey;
        let data;
        if (value === BACKSPACE_CHARACTER) {
            targetStateKey = backStateKey;
            data = null;
        } else {
            targetStateKey = forwardStateKey;
            data = currentState.value.code + value
        }
        return { targetStateKey, data };
    }
}