import React from 'react';
import { createBoard } from '@wixc3/react-board';
import Login from '../../../screens/UserLogin.jsx';

export default createBoard({
    name: 'Login',
    Board: () => <Login />
});
