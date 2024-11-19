import { useState } from "react";
import { Footer } from "./Footer";
import { notification } from "antd";
import { signIn, signUp } from "../../api/user";
import { useHistory } from "react-router-dom";

export const LogInForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (type: "login" | "signup") => async() => {
    try {
      setLoading(true);
      if (type === "login") {
        await signIn(email, password, () => history.push("/todos"));
      } else {
        await signUp(email, password);
        notification.success({
          message: "User created, try to login",
        })
      }
    } catch(e: any) {
      notification.error({
        message: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          className="todoapp__new-todo"
          placeholder="Password"

          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Footer disabled={loading} handleSubmit={handleFormSubmit}/>
      </form>
  )
}