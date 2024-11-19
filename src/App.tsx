import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { LoginScreen } from "./components/screens/LoginScreen";
import { TodosScreen } from "./components/screens/TodosScreen";


export const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path={"/"} component={LoginScreen}/>
        <Route exact path={"/todos"} component={TodosScreen}/>
      </Switch>
    </Router>
  );
};
