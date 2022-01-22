/**
 * @callback StateEvent
 * @param {State} currentState
 * @param {*} value
 */
/**
 * @callback StateTransition
 * @param {State} currentState
 * @param {*} value
 * @returns {{targetStateKey:string, data:*}}
 */

/**
 * @export
 * @class State
 */
export class State {
    #transition;
    #value;
    #enter;
    #leave;

    /**
     * Creates an instance of State.
     * @constructor
     * @param {Object} state
     * @param {StateTransition} state.transition - params are currentState and the value.
     * returns the target state key and data
     * @param {*} state.value
     * @param {StateEvent} [state.enter]
     * @param {StateEvent} [state.leave]
     * @memberof State
     */
    constructor({ transition, value = {}, enter = () => { }, leave = () => { } }) {
        this.#transition = transition;
        this.#value = value;
        this.#enter = enter;
        this.#leave = leave;
    }

    get transition() {
        return this.#transition;
    }

    get value() {
        return this.#value;
    }
    set value(val) {
        this.#value = val;
    }

    get enter() {
        return this.#enter;
    }

    get leave() {
        return this.#leave;
    }
}
