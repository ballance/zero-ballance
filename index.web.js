import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './App';

// Register the app
AppRegistry.registerComponent(appName, () => App);

// Run the app
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('react-root'),
});