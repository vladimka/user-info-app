import React, { useState } from 'react';

import {
    Panel,
	PanelHeader,
    Group,
    FormItem,
    Input,
    Button,
    Div,
    SimpleCell,
    Avatar,
    Header
} from "@vkontakte/vkui";
import '@vkontakte/vkui/dist/vkui.css';

import bridge from '@vkontakte/vk-bridge';

import {
    Icon24HomeOutline,
    Icon24CalendarOutline,
    Icon24Article,
    Icon24HistoryBackwardOutline,
    Icon24Followers
} from '@vkontakte/icons';

import store from '../store';

const Home = ({ id, setPanel, setModal, user }) => {
    let state = store.getState();
    const [userId, setUserId] = useState(state.fetchedUser.id);
    const [_user, setUser] = useState(user);

    store.subscribe(() => state = store.getState());

    const fetchUser = async () => {
        try{
            let user = await bridge.send('VKWebAppCallAPIMethod', {
                method : 'users.get',
                params : {
                    user_ids : userId,
                    fields : 'photo_100,domain,city,country,bdate,status',
                    v : '5.131',
                    access_token : state.token
                }
            });

            if(user.response.length == 0){
                return setModal('userFetchError');
            }

            store.dispatch({ type : 'UPDATE_FETCHED_USER', fetchedUser : user.response[0] });
            setUser(user.response[0]);

            state.history.push({
                photo_100 : state.fetchedUser.photo_100,
                first_name : state.fetchedUser.first_name,
                last_name : state.fetchedUser.last_name,
                domain : state.fetchedUser.domain,
                id : state.fetchedUser.id
            });
            store.dispatch({ type : 'UPDATE_HISTORY', history : state.history });
        }catch(e){
            console.log('Error: ', e);
            setModal('userFetchError');
        }
    }

    const onChange = e => {
        setUserId(e.currentTarget.value);
    }

    const formatDate = dateStr => {
        console.log(dateStr);
        return new Date(dateStr).toLocaleDateString('ru');
    }

    return (
        <Panel id={id} bottom>
            <PanelHeader>UserInfoApp</PanelHeader>
            <Group>
                <FormItem top="ID или короткое имя пользователя ВК" onSubmit={fetchUser}>
                    <Input type="text" defaultValue={userId} onChange={onChange}></Input>
                </FormItem>
                <Div><Button stretched size="l" mode="secondary" onClick={fetchUser}>Запрос</Button></Div>
                {state.fetchedUser &&
                    <Group>
                        <Header mode="secondary">Информация</Header>
                        <SimpleCell before={<Avatar src={state.fetchedUser.photo_100}></Avatar>} description={`@${state.fetchedUser.domain}`}
                            onClick={() => location.href=`https://vk.com/${state.fetchedUser.domain}`} >
                            {state.fetchedUser.first_name} {state.fetchedUser.last_name}
                        </SimpleCell>
                        {state.fetchedUser.status && state.fetchedUser.status != '' &&
                            <SimpleCell  before={<Icon24Article></Icon24Article>} description={state.fetchedUser.status}>Статус</SimpleCell>
                        }
                        {state.fetchedUser.country &&
                            <SimpleCell before={<Icon24HomeOutline></Icon24HomeOutline>} description={state.fetchedUser.country.title}>Страна</SimpleCell>
                        }
                        {state.fetchedUser.city &&
                            <SimpleCell before={<Icon24HomeOutline></Icon24HomeOutline>} description={state.fetchedUser.city.title}>Город</SimpleCell>
                        }
                        {state.fetchedUser.bdate &&
                            <SimpleCell before={<Icon24CalendarOutline></Icon24CalendarOutline>} description={formatDate(state.fetchedUser.bdate)}>Дата Рождения</SimpleCell>
                        }
                        <SimpleCell before={<Icon24Followers />} description="которыми владеет пользователь" onClick={setPanel} data-to='userGroups'>Группы</SimpleCell>
                        <SimpleCell before={<Icon24HistoryBackwardOutline></Icon24HistoryBackwardOutline>} onClick={setPanel} data-to='requestsHistory'>История запросов</SimpleCell>
                    </Group>
                }
            </Group>
        </Panel>
    )
};

export default Home;