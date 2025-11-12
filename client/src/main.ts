import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import clickAway from './directives/v-click-away'

import { Amplify } from 'aws-amplify';
import { cognitoConfig } from './cognito-config';

Amplify.configure({ Auth: { Cognito: cognitoConfig } });

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.directive('click-away', clickAway);

app.mount('#app')
