import { State } from './state';

export * from "./state";

/**
 *
 *
 * @export
 * @class Fsm
 */
export class Fsm {
    #states;
    #currentState;

    /**
     * Creates an instance of Fsm.
     * @param {string} initialStateKey the name of the state to use as the initial state
     * @param {Object.<string, State>} states all the states to use
     */
    constructor(initialStateKey, states) {
        this.#states = states;
        this.#currentState = states[initialStateKey];
        if (this.#currentState === null || typeof (this.#currentState) === 'undefined') {
            throw new Error("Wow there! Seems there was a problem initiating the Fsm. Couldn't get the initial state going :-(");
        }
        this.#currentState.enter(this.#currentState);
    }

    /**
     * @param value {*} 
     * @memberof Fsm
     */
    transition = (value) => {
        try {
            const { targetStateKey, data } = this.#currentState.transition(this.#currentState, value);
            const targetState = this.#states[targetStateKey];

            // if (this._currentState !== targetState) {
            this.#currentState.leave(this.#currentState, data)
            this.#currentState = targetState;
            this.#currentState.enter(this.#currentState, data)
            // }
        }
        catch (err) {
            console.error("oops! something went wrong while trying to transition");
            throw err;
        }
    }
}
