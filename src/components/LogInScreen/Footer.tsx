type Props = {
  handleSubmit: (type: "login" | "signup") => () => void;
  disabled: boolean;
};

export const Footer: React.FC<Props> = ({ disabled, handleSubmit }) => (
  <footer className="todoapp__footer">
    <button
      type="button"
      className="todoapp__clear-completed"
      disabled={disabled}
      onClick={handleSubmit("signup")}
    >
      SIGN UP
    </button>
    <button
      type="submit"
      className="todoapp__clear-completed"
      disabled={disabled}
      onClick={handleSubmit("login")}
    >
      LOGIN
    </button>
  </footer>
);
