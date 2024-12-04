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
import { BarChart } from "@mui/x-charts/BarChart";
import { useDimensions } from "../../hooks/useDimensions";
import { DownloadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const xLabels = [
  "Created",
  "In-progress",
  "In-progress \n for too long",
  "Completed \n in time",
  "Completed \n too late",
];

export const TodosScreen: React.FC = () => {
  const [isCreationModalVisible, setIsCreationModalVisible] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [errorMessage, setErrorMessage] = useState("");
  const [tempTodo, setTempTodo] = useState<Partial<Todo> | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const { width } = useDimensions();

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

  const uData = [
    todos.filter(({ status }) => status === "created").length,
    todos.filter(
      ({ status, inProgressAt, estimatedTime }) =>
        inProgressAt &&
        status === "inProgress" &&
        (Date.now() - new Date(inProgressAt).getTime()) / 1000 / 60 / 60 <=
          estimatedTime
    ).length,
    todos.filter(
      ({ status, inProgressAt, estimatedTime }) =>
        inProgressAt &&
        status === "inProgress" &&
        (Date.now() - new Date(inProgressAt).getTime()) / 1000 / 60 / 60 >
          estimatedTime
    ).length,
    todos.filter(
      ({ status, completedAt, estimatedTime, inProgressAt }) =>
        completedAt &&
        inProgressAt &&
        status === "completed" &&
        (new Date(completedAt).getTime() - new Date(inProgressAt).getTime()) /
          1000 /
          60 /
          60 <=
          estimatedTime
    ).length,
    todos.filter(
      ({ status, completedAt, estimatedTime, inProgressAt }) =>
        completedAt &&
        inProgressAt &&
        status === "completed" &&
        (new Date(completedAt).getTime() - new Date(inProgressAt).getTime()) /
          1000 /
          60 /
          60 >
          estimatedTime
    ).length,
  ];

  const avgTaskDuration = useMemo(() => {
    const completedTodos = todos.filter(({ status }) => status === "completed");

    if (completedTodos.length === 0) {
      return 0;
    }

    const totalDuration = completedTodos.reduce(
      (acc, { inProgressAt, completedAt }) =>
        acc +
        (new Date(completedAt as string | Date).getTime() -
          new Date(inProgressAt as string | Date).getTime()) /
          1000 /
          60 /
          60,
      0
    );

    return (totalDuration / completedTodos.length).toFixed(2);
  }, [todos]);

  const {
    handleAnalysis,
    loading: tipLoading,
    message,
  } = useLastNTodosAnalysis(10);

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

      {!!todos.length && (
        <span>Average task duration: {avgTaskDuration} hours</span>
      )}

      <BarChart
        width={width > 500 ? 600 : 300}
        height={300}
        series={[{ data: uData, label: "Tasks", type: "bar" }]}
        xAxis={[{ scaleType: "band", data: xLabels }]}
      />

      <div
        onClick={() => {
          const element = document.createElement("a");
          const file = new Blob([JSON.stringify(todos, null, 2)], {
            type: "application/json",
          });
          element.href = URL.createObjectURL(file);
          element.download = "todos.json";
          document.body.appendChild(element);
          element.click();
        }}
        style={{ cursor: "pointer" }}
      >
        <span>Export tasks as .json</span> <DownloadOutlined />
      </div>

      <button
        className="black-button"
        type="button"
        onClick={() => {
          localStorage.removeItem("token");
        }}
      >
        <Link to={"/"}>LOG OUT</Link>
      </button>

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
