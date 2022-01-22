import { State } from './state';

export * from "./state";

/**
 *
 *
 * @export
 * @class Fsm
 */
export class Fsm {
    _states;
    _currentState;

    /**
     * Creates an instance of Fsm.
     * @param {string} initialStateKey the name of the state to use as the initial state
     * @param {Object.<string, State>} states all the states to use
     */
    constructor(initialStateKey, states) {
        this._states = states;
        this._currentState = states[initialStateKey];
        this._currentState.enter(this._currentState);
    }

    /**
     *
     *
     * @param value {*} 
     * @memberof Fsm
     */
    transition = (value) => {
        const targetState = this._currentState.transition(this._currentState, value);

        if (this._currentState !== targetState) {
            this._currentState.leave(this._currentState)
            this._currentState = targetState;
            this._currentState.enter(this._currentState)
        }
    }
}
