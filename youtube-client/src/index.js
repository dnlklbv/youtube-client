import App from './controllers/App';
import Model from './models/Model';
import AppView from './views/AppView';

const app = new App(Model, AppView);

app.start();
