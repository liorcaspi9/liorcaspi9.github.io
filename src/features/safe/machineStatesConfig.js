import { State } from '../../lib';
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
    const initialMachineValue = { locked: true, code: '' };

    const states = {
        [stateNames.initial]: new State({
            name: stateNames.initial,
            value: initialMachineValue,
            enter: (currentState) => {
                currentState.value = initialMachineValue;
                setSafeStateFromMachineState(currentState.value);
            },
            transition: (currentState, value) => {
                return decideDirectionToGo(value, currentState, states[stateNames.initial], states[stateNames.oneDigit]);
            }
        }),
        [stateNames.oneDigit]: new State({
            name: stateNames.oneDigit,
            value: null,
            enter: (currentState) => setSafeStateFromMachineState(currentState.value),
            transition: (currentState, value) => {
                return decideDirectionToGo(value, currentState, states[stateNames.initial], states[stateNames.twoDigits]);
            }
        }),
        [stateNames.twoDigits]: new State({
            name: stateNames.twoDigits,
            value: null,
            enter: (currentState) => setSafeStateFromMachineState(currentState.value),
            transition: (currentState, value) => {
                return decideDirectionToGo(value, currentState, states[stateNames.oneDigit], states[stateNames.threeDigits]);
            }
        }),
        [stateNames.threeDigits]: new State({
            name: stateNames.threeDigits,
            value: null,
            enter: (currentState) => { setSafeStateFromMachineState(currentState.value); },
            transition: (currentState, value) => {
                const currentCode = currentState.value.code + value;

                const correctCode = '1234'; //TODO: Getcode from 'server';

                const targetState = currentCode !== correctCode ? states[stateNames.error] : states[stateNames.unlocked];
                return decideDirectionToGo(value, currentState, states[stateNames.twoDigits], targetState);
            }
        }),
        [stateNames.error]: new State({
            name: stateNames.error,
            value: null,
            enter: (currentState) => {
                currentState.value.code = '****';
                sounds.errorSound?.play();
                setSafeStateFromMachineState(currentState.value);
                reset();
            },
            transition: (currentState, value) => {
                return states[stateNames.initial];
            }
        }),
        [stateNames.unlocked]: new State({
            name: stateNames.open,
            value: { locked: false, code: 'open' },
            enter: (currentState) => {
                currentState.value = { locked: true, code: 'open' };
                sounds.unlockSound?.play();
                disableTemporarely();
                setSafeStateFromMachineState(currentState.value);
            },
            transition: (currentState, value) => {
                let targetState = states[stateNames.initial];
                if (value === OPEN_CHARACTER) {
                    targetState = states[stateNames.open];
                }
                return targetState;
            }
        }),
        [stateNames.open]: new State({
            name: stateNames.open,
            value: { locked: false, code: 'open' },
            enter: (currentState) => {
                disableTemporarely();
                sounds.openSound?.play();
                currentState.value = { locked: false, code: 'open' };
                setSafeStateFromMachineState(currentState.value);
            },
            transition: (currentState, value) => {
                return states[stateNames.initial];
            }
        }),
    };
    return states;

    function setSafeStateFromMachineState(machineStateValue) {
        setDoorIsClosed(machineStateValue.locked);
        setEnteredCode(machineStateValue.code);
    }

    function decideDirectionToGo(value, currentState, backState, forwardState) {
        let targetState;
        if (value === BACKSPACE_CHARACTER) {
            targetState = backState;
        } else {
            targetState = forwardState;
            targetState.value = { locked: true, code: currentState.value.code + value };
        }
        return targetState;
    }
}