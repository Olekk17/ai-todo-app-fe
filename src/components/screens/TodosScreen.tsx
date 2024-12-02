import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Todo } from "../../types/Todo";
import { FilterBy } from "../../enums/FilterBy";
import { deleteTodo, getTodos, updateTodo } from "../../api/todos";
import { TodoList } from "../TodoScreen/TodoList";
import { Footer } from "../TodoScreen/Footer";
import { ErrorMessage } from "../ErrorMessage";
import { TodoForm } from "../TodoScreen/TodoForm";
import { Modal, notification, Spin } from "antd";
import { useLastNTodosAnalysis } from "../../hooks/useLastNTodosAnalysis";

export const TodosScreen: React.FC = () => {
  const [isCreationModalVisible, setIsCreationModalVisible] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [errorMessage, setErrorMessage] = useState("");
  const [tempTodo, setTempTodo] = useState<Partial<Todo> | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const activeTodosNumber = todos.filter(
    ({ status }) => status !== "completed"
  ).length;

  const findTodoIndexById = (todoId: number) => {
    return todos.findIndex(({ id }) => id === todoId);
  };

  const createTodo = (newTodo: Todo) => {
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const deleteErrorMessage = useCallback(() => {
    setErrorMessage("");
  }, []);

  const addLoadingTodoId = (todoId: number) => {
    setLoadingTodoIds((prevIds) => [...prevIds, todoId]);
  };

  const removeLoadingTodoId = (todoId: number) => {
    setLoadingTodoIds((prevIds) => prevIds.filter((id) => id !== todoId));
  };

  const loadData = useCallback(async () => {
    try {
      const todosFromServer = await getTodos();

      setTodos(todosFromServer);
    } catch {
      setErrorMessage("Failed to load data");
    }
  }, []);

  const handleTodoDelete = useCallback(async (todoToDeleteId: number) => {
    deleteErrorMessage();

    try {
      addLoadingTodoId(todoToDeleteId);
      await deleteTodo(todoToDeleteId);
      setTodos((prevTodos) =>
        prevTodos.filter(({ id }) => todoToDeleteId !== id)
      );
    } catch {
      setErrorMessage("Unable to delete a todo");
    } finally {
      removeLoadingTodoId(todoToDeleteId);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filterBy) {
      case FilterBy.Created:
        return todos.filter(({ status }) => status === "created");

      case FilterBy.Active:
        return todos.filter(({ status }) => status === "inProgress");

      case FilterBy.Completed:
        return todos.filter(({ status }) => status === "completed");

      default:
        return todos;
    }
  }, [todos, filterBy]);

  const onCreated = useCallback(() => {
    setIsCreationModalVisible(false);
  }, []);

  const handlePatchTodo = useCallback(
    async (todoId: number, data: Partial<Todo>) => {
      if (data.status !== "created") {
        if (!data.inProgressAt) {
          notification.error({
            message: "Please provide a start date and time",
          });
          return false;
        }

        if (data.status === "completed" && !data.completedAt) {
          notification.error({
            message: "Please provide a completion date and time",
          });
          return false;
        }

        if (
          data.completedAt &&
          data.inProgressAt &&
          data.inProgressAt > data.completedAt
        ) {
          notification.error({
            message:
              "Completion date and time should be greater than the start date and time",
          });
          return false;
        }

        if (data.completedAt && data.completedAt > new Date()) {
          notification.error({
            message:
              "Completion date and time should be less than the current date and time",
          });
          return false;
        }

        if (data.inProgressAt && data.inProgressAt > new Date()) {
          notification.error({
            message:
              "Start date and time should be less than the current date and time",
          });
          return false;
        }
      }
      deleteErrorMessage();

      try {
        addLoadingTodoId(todoId);
        const newTodo = await updateTodo(todoId, data);

        setTodos((prevTodos) => {
          const todosCopy = [...prevTodos];
          const indexToDelete = findTodoIndexById(newTodo.id);

          todosCopy.splice(indexToDelete, 1, newTodo);

          return todosCopy;
        });
      } catch {
        setErrorMessage("Unable to update a todo");
        return false;
      } finally {
        removeLoadingTodoId(todoId);
        return true;
      }
    },
    [todos]
  );

  const { handleAnalysis, loading: tipLoading, message } = useLastNTodosAnalysis(10);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoList
          todos={filteredTodos}
          onDelete={handleTodoDelete}
          tempTodo={tempTodo}
          loadingTodoIds={loadingTodoIds}
          handlePatchTodo={handlePatchTodo}
        />

        {todos && (
          <Footer
            filter={filterBy}
            onChange={setFilterBy}
            activeTodosNumber={activeTodosNumber}
          />
        )}
      </div>

      <button
        type="button"
        onClick={() => setIsCreationModalVisible(true)}
        className="black-button"
      >
        CREATE NEW
      </button>

      <button
        type="button"
        onClick={handleAnalysis}
        className="black-button"
        disabled={todos.length === 0 || tipLoading}
      >
        {tipLoading ? <Spin /> : "AI ANALYZE"}
      </button>

      <p>{message}</p>

      <ErrorMessage message={errorMessage} onDelete={deleteErrorMessage} />
      <Modal
        title="Create a new todo"
        open={isCreationModalVisible}
        onCancel={() => setIsCreationModalVisible(false)}
        footer={null}
        centered
      >
        <TodoForm
          onError={setErrorMessage}
          onChange={setTempTodo}
          onCreate={createTodo}
          onCreated={onCreated}
        />
      </Modal>
    </div>
  );
};
