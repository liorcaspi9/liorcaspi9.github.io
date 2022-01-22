import { Fsm, State } from './index';

const mockStates = () => {
    return {
        'test': new State({
            value: '',
            enter: () => { },
            leave: () => { },
            transition: (currentState, value) => { return { targetStateKey: 'test2', data: '' } }
        }),
        'test2': new State({
            value: '',
            enter: () => { },
            leave: () => { },
            transition: (currentState, value) => { return { targetStateKey: 'test', data: '' } }
        })
    }
};

describe('Fsm index file', () => {
    let mockOfStates;

    beforeEach(() => {
        mockOfStates = mockStates();
    });

    it('should throw error if the given initial state name does match a state', () => {
        expect(() => {
            new Fsm('testFail', mockOfStates);
        }).toThrowError();
    });

    describe('Transition tests', () => {
        it('Should throw error if transition fails', () => {
            expect(() => {
                mockOfStates['test'].transition = () => { throw new Error('bla') };
                const fsm = new Fsm('test', mockOfStates);
                fsm.transition();
            }).toThrowError();
        });
        it("Should call current state's transition once", () => {
            const fsm = new Fsm('test', mockOfStates);

            const trans = jest.spyOn(mockOfStates['test'], 'transition');
            fsm.transition();
            expect(trans).toHaveBeenCalledTimes(1);
        });
        it("Should call test's leave once", () => {
            const fsm = new Fsm('test', mockOfStates);
            const leave = jest.spyOn(mockOfStates['test'], 'leave');
            fsm.transition();
            expect(leave).toHaveBeenCalledTimes(1);
        });
        it("Should call test2's enter once", () => {
            const fsm = new Fsm('test', mockOfStates);
            const enter = jest.spyOn(mockOfStates['test2'], 'enter');
            fsm.transition();
            expect(enter).toHaveBeenCalledTimes(1);
        });
    });

});


