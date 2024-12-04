import { Spin } from "antd";

type Props = {
  handleSubmit: (type: "login" | "signup") => () => void;
  signUpLoading: boolean;
  signInLoading: boolean;
};

export const Footer: React.FC<Props> = ({
  signUpLoading,
  handleSubmit,
  signInLoading
}) => (
  <footer className="todoapp__footer">
    <button
      type="button"
      className="todoapp__clear-completed"
      disabled={signUpLoading || signInLoading}
      onClick={handleSubmit("signup")}
    >
      {signUpLoading ? <Spin /> : "SIGN UP"}
    </button>
    <button
      type="submit"
      className="todoapp__clear-completed"
      disabled={signUpLoading || signInLoading}
      onClick={handleSubmit("login")}
    >
      {signInLoading ? <Spin /> : "LOG IN"}
    </button>
  </footer>
);
