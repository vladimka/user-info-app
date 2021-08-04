import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
	View,
	ScreenSpinner,
	AdaptivityProvider,
	AppRoot,
	ModalRoot,
	ModalCard,
	Button
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import { Icon56ErrorTriangleOutline } from '@vkontakte/icons';

import Home from './panels/Home';
import RequestsHistory from './panels/RequestsHistory';
import UserGroups from './panels/UserGroups';

import store from './store';

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [activeModal, setActiveModal] = useState(null);
	const [user, setUser] = useState(null);

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			let user = await bridge.send('VKWebAppGetUserInfo');
			let token = await bridge.send('VKWebAppGetAuthToken', { scope : 'friends,groups', app_id : 7338820 });
			user = await bridge.send('VKWebAppCallAPIMethod', {
                method : 'users.get',
                params : {
                    user_ids : user.id,
                    fields : 'photo_100,domain,city,country,bdate,status',
                    v : '5.131',
                    access_token : token.access_token
                }
            });
			store.dispatch({ type : 'UPDATE_FETCHED_USER', fetchedUser : user.response[0] });
			store.dispatch({ type : 'UPDATE_TOKEN', token : token.access_token });
			setUser(user.response[0]);
			setPopout(null);
		}
		fetchData();
	}, []);

	const setPanel = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	const setModal = e => {
		if(typeof e == 'string')
			return setActiveModal(e);

		setActiveModal(e.currentTarget.dataset.to);
	};

	const closeModal = () => {
		setActiveModal(null);
	}

	const modal = (
		<ModalRoot activeModal={activeModal} onClose={closeModal}>
			<ModalCard
				id='userFetchError'
				onClose={closeModal}
				header="Error"
				subheader="Error while fetching the user"
				actions={<Button stretched size="l" mode="secondary" onClick={closeModal}>OK</Button>}
				icon={<Icon56ErrorTriangleOutline color="red"></Icon56ErrorTriangleOutline>}
			></ModalCard>
		</ModalRoot>
	)

	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel} popout={popout} modal={modal}>
					{user && <Home id='home' setPanel={setPanel} setModal={setModal} user={user} />}
					<RequestsHistory id='requestsHistory' setPanel={setPanel} setModal={setModal} />
					<UserGroups id='userGroups' setPanel={setPanel} setModal={setModal} />
				</View>
			</AppRoot>
		</AdaptivityProvider>
	);
}

export default App;