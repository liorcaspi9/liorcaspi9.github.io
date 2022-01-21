/**
 *
 *
 * @export
 * @class State
 */
export class State {
    _name = '';
    _transition;
    _value = {};
    _enter;
    _leave;

    /**
     * Creates an instance of State.
     * @param {Object} state
     * @param {string} state.name
     * @param {function(State,*):State} state.transition - params are currentState and the value
     * @param {*} state.value
     * @param {function} [state.enter=() => { }]
     * @param {function} [state.leave=() => { }]
     * @memberof State
     */
    constructor({ name, transition, value, enter = () => { }, leave = () => { } }) {
        this._name = name;
        this._transition = transition;
        if (value !== null && typeof (value) !== 'undefined') {
            this._value = value;
        }
        this._enter = enter;
        this._leave = leave;
    }

    get name() {
        return this._name;
    }

    get transition() {
        return this._transition;
    }

    get value() {
        return this._value;
    }
    set value(val) {
        this._value = val;
    }

    get enter() {
        return this._enter;
    }

    get leave() {
        return this._leave;
    }
}
