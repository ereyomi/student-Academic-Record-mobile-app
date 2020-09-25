export interface DataState {
    user: string[];
    students: string[];
}

export const initialState: DataState = {
    user: [],
    students: [],
};


export function reducer( state = initialState, action ) {
    switch ( action.type ) {
        case 'UPDATE_SCORE':
            console.log( 'exisiting state: ', JSON.stringify( state ) );
            console.log( 'payload: ', action.payload );
            return {
                ...state,
                data: action.payload
            };

        default:
            return state;
    }
}
