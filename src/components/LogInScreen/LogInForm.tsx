import { useState } from "react";
import { Footer } from "./Footer";
import { notification } from "antd";
import { signIn, signUp } from "../../api/user";
import { useNavigate } from "react-router-dom";

export const LogInForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);

  const handleFormSubmit = (type: "login" | "signup") => async () => {
    try {
      if (type === "signup") {
        setSignUpLoading(true);
        await signUp(email, password);
      } else {
        setSignInLoading(true);
      }
      await signIn(email, password, () => navigate("/todos"));
    } catch (e: any) {
      notification.error({
        message: e.message,
      });
    } finally {
      setSignUpLoading(false);
      setSignInLoading(false);
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
      <Footer
        signUpLoading={signUpLoading}
        signInLoading={signInLoading}
        handleSubmit={handleFormSubmit}
      />
    </form>
  );
};
