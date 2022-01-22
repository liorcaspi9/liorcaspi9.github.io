import { State } from '../../lib/fsm';
import { BACKSPACE_CHARACTER, OPEN_CHARACTER } from './safeConsts';

export const stateNames = {
    initial: 'initial',
    oneDigit: 'oneDigit',
    twoDigits: 'twoDigits',
    threeDigits: 'threeDigits',
    fourDigits: 'fourDigits',
    error: 'error',
    unlocked: 'unlocked',
    open: 'open',
}


export function initStatesForFsm(sounds, reset, checkSafeCodeAndProceed, openTheSafe, setSafeStateFromMachineState, errCode) {
    // always return a new copy so it cant be changed!
    const initialMachineValue = () => { return { locked: true, code: '' } };

    const digitStateFactory = (backStateKey, forwardStateKey) => {
        return new State({
            value: initialMachineValue(),
            enter: (currentState, value) => {
                if (value) {
                    currentState.value = { locked: true, code: value };
                }
                setSafeStateFromMachineState(currentState.value);
            },
            transition: (currentState, value) => {
                return decideDirectionToGo(value, currentState, backStateKey, forwardStateKey);
            }
        })
    }

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
        [stateNames.oneDigit]: digitStateFactory(stateNames.initial, stateNames.twoDigits),
        [stateNames.twoDigits]: digitStateFactory(stateNames.oneDigit, stateNames.threeDigits),
        [stateNames.threeDigits]: digitStateFactory(stateNames.twoDigits, stateNames.fourDigits),
        [stateNames.fourDigits]: new State({
            value: initialMachineValue(),
            enter: (currentState, value) => {
                currentState.value = { locked: true, code: value };
                setSafeStateFromMachineState(currentState.value);
                checkSafeCodeAndProceed(currentState.value.code);
            },
            transition: (currentState, code) => {
                let targetStateKey = '';
                if (code === errCode) {
                    targetStateKey = stateNames.initial;
                }
                else {
                    targetStateKey = code === currentState.value.code ? stateNames.open : stateNames.error;
                }
                return decideDirectionToGo(code, currentState, stateNames.threeDigits, targetStateKey);
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
        [stateNames.open]: new State({
            value: { locked: false, code: 'open' },
            enter: (currentState, value) => {
                currentState.value = { locked: false, code: 'open' };
                openTheSafe(currentState)
            },
            transition: (currentState, value) => {
                sounds.openSound?.play();
                return { targetStateKey: stateNames.initial, data: value };
            }
        }),
    };
    return states;

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