import { memo, useCallback, useState } from "react";
import { TodoData } from "../../../types/TodoData";
import { addTodo } from "../../../api/todos";
import { Todo } from "../../../types/Todo";
import { notification } from "antd";

type Props = {
  onError: (message: string) => void;
  onChange: (newTodo: Partial<Todo> | null) => void;
  onCreate: (newTodo: Todo) => void;
  onCreated?: () => void;
};

export const TodoForm: React.FC<Props> = memo(
  ({ onError, onChange, onCreate, onCreated }) => {
    const [query, setQuery] = useState("");
    const [estimatedTime, setEstimatedTime] = useState(0.5); // in hours
    const [description, setDescription] = useState("");
    const [isInputDisabled, setIsInputDisabled] = useState(false);

    const handleEstimatedTimeChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const number = +e.target.value;
      if (number <= 0) {
        notification.error({
          message: "Estimated time can't be negative or zero",
        });
        return;
      }
      setEstimatedTime(number);
    };

    const handleFormSubmit = useCallback(
      async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onError("");

        if (!query.trim().length) {
          onError("Title can't be empty");

          return;
        }

        const todoToAdd: TodoData = {
          title: query,
          status: "created",
          description,
          estimatedTime,
        };

        onChange(todoToAdd);

        try {
          setIsInputDisabled(true);
          const newTodo = await addTodo(todoToAdd);

          onCreate(newTodo);
          setQuery("");
        } catch {
          onError("Unable to add a todo");
        } finally {
          onChange(null);
          setIsInputDisabled(false);
        }
        onCreated && onCreated();
      },
      [query, description, estimatedTime]
    );

    return (
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={isInputDisabled}
        />
        <textarea 
          className="todoapp__new-todo"
          placeholder="More details (optional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={isInputDisabled}
        />
        <div>
          <label htmlFor="estimated-time">Estimated time: </label>
          <input
            id="estimated-time"
            type="number"
            value={estimatedTime}
            onChange={handleEstimatedTimeChange}
            step={0.5}
            style={{ width: "45px" }}
            disabled={isInputDisabled}
          />
          <span> hours</span>
        </div>
        <footer className="modal-footer">
          <button
            type="submit"
            className="todoapp__add-todo black-button"
            disabled={isInputDisabled}
          >
            ADD
          </button>
        </footer>
      </form>
    );
  }
);
