import { HashRouter, Route, Routes } from "react-router-dom";
import { LoginScreen } from "./components/screens/LoginScreen";
import { TodosScreen } from "./components/screens/TodosScreen";

export const App: React.FC = () => (
  <HashRouter>
    <Routes>
      <Route path={"/"} element={<LoginScreen />} />
      <Route path={"/todos"} element={<TodosScreen />} />
    </Routes>
  </HashRouter>
);
