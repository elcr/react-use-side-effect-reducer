import { useEffect, useReducer } from 'react';
export function useSideEffectReducer(createInitialState, reducer) {
    function innerReducer([state, sideEffects], action) {
        const result = reducer(state, action);
        switch (result.tag) {
            case 'NoUpdate':
                return [state, sideEffects];
            case 'Update':
                return [result.state, sideEffects];
            case 'SideEffect':
                return [state, [...sideEffects, result.sideEffect]];
            case 'UpdateWithSideEffect':
                return [result.state, [...sideEffects, result.sideEffect]];
        }
    }
    const [[state, sideEffects], dispatch] = useReducer(innerReducer, undefined, () => [createInitialState(), []]);
    useEffect(() => {
        for (let index = 0; index < sideEffects.length; index++) {
            sideEffects[index](dispatch, state);
        }
        sideEffects.length = 0;
    }, [sideEffects]);
    return [state, dispatch];
}
export const noUpdate = { tag: 'NoUpdate' };
export function update(state) {
    return {
        tag: 'Update',
        state
    };
}
export function sideEffect(sideEffect) {
    return {
        tag: 'SideEffect',
        sideEffect
    };
}
export function updateWithSideEffect(state, sideEffect) {
    return {
        tag: 'UpdateWithSideEffect',
        state,
        sideEffect
    };
}
//# sourceMappingURL=index.js.map