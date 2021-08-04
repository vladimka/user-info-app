import React, { useEffect, useState } from 'react';
import store from '../store';
import bridge from '@vkontakte/vk-bridge';

import {
    Panel,
    PanelHeader,
    PanelHeaderClose,
    SimpleCell,
    Avatar,
    Group
} from '@vkontakte/vkui';

import { Icon24ErrorCircleOutline } from '@vkontakte/icons';

const UserGroups = ({ id, setPanel, setModal }) => {
    const state = store.getState();
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData(){
            await getGroups();
        }
        fetchData();
    }, []);

    function filterGroups(groups, filter){
        switch(filter){
            case 'admin':
                return groups.items.filter(group => group.is_admin == 1);
            case 'member':
                return groups.items.filter(group => group.is_member == 1);
        }
    }

    async function getGroups(){
        try{
            let groups = await bridge.send('VKWebAppCallAPIMethod', {
                method : 'groups.get',
                params : {
                    user_id : state.fetchedUser.id,
                    extended : 1,
                    fields : 'photo_100',
                    v : '5.131',
                    access_token : state.token
                }
            });
            setGroups(filterGroups(groups.response));
        }catch(e){
            setError(e);
        }
    }

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderClose onClick={setPanel} data-to='home' />}>
                Группы
            </PanelHeader>
            {error
                ? <Group><SimpleCell before={<Icon24ErrorCircleOutline />}>Error: {error.error_data.error_reason.error_msg}</SimpleCell></Group>
                : <Group>{groups.map(group => <SimpleCell key={group.id} before={<Avatar src={group.photo_100}></Avatar>} description={"@" + group.screen_name} onClick={() => location.href = `https://vk.com/${group.screen_name}`}>{group.name}</SimpleCell>)}</Group>
            }
        </Panel>
    )
}

export default UserGroups;