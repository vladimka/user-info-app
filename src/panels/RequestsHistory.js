import React from 'react';
import store from '../store';

import {
    Panel,
    PanelHeader,
    PanelHeaderClose,
    SimpleCell,
    Avatar,
    Group
} from '@vkontakte/vkui';

const RequestsHistory = ({ id, setPanel, setModal }) => {
    const state = store.getState();

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderClose onClick={setPanel} data-to='home'></PanelHeaderClose>}>История запросов</PanelHeader>
            <Group>
                {state.history.map((user, i) => <SimpleCell key={i} before={<Avatar src={user.photo_100}></Avatar>} description={'@' + user.domain}>{user.first_name} {user.last_name}</SimpleCell>)}
            </Group>
        </Panel>
    )
}

export default RequestsHistory;