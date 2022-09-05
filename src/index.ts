import './components/init/init';
import 'materialize-css/dist/js/materialize';
import './scss/global.scss';

import { AppController } from './components/controller/AppController';

const app = new AppController();
app.start();
