import { BrowserRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Router from './router/Router';

const App = observer(() => {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
});

export default App;
