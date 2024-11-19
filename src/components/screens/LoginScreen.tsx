import React from "react";
import { LogInForm } from "../LogInScreen/LogInForm";

export const LoginScreen: React.FC = () => (
  <div className="todoapp">
    <h1 className="todoapp__title">log in</h1>

    <div className="todoapp__content">
      <header className="todoapp__header">
        <LogInForm />
      </header>
    </div>
  </div>
);
