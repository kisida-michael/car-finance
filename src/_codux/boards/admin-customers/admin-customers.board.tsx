import React from 'react';
import { createBoard } from '@wixc3/react-board';
import AdminCustomers from '../../../screens/AdminCustomers.jsx';

export default createBoard({
    name: 'AdminCustomers',
    Board: () => <AdminCustomers />
});
