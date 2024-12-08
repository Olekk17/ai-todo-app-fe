import { memo, useState } from "react";
import cn from "classnames";
import { Todo } from "../../../types/Todo";
import { Modal, notification } from "antd";
import { AiTip } from "./AiTip/AiTip";
import { EditOutlined } from "@ant-design/icons";

type Props = {
  todo: Todo;
  onDelete: (todoToDeleteId: number) => void;
  loadingTodoIds: number[];
  handlePatchTodo: (todoId: number, data: Partial<Todo>) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = memo(
  ({ todo, onDelete = () => {}, loadingTodoIds, handlePatchTodo }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [description, setDescription] = useState("");
    const [estimatedTime, setEstimatedTime] = useState(0.5);
    const [startAt, setStartAt] = useState(
      todo.inProgressAt ? new Date(todo.inProgressAt) : undefined
    );
    const [completedAt, setCompletedAt] = useState(
      todo.completedAt ? new Date(todo.completedAt) : undefined
    );
    const [status, setStatus] = useState(todo.status);
    const isLoading = loadingTodoIds.includes(todo.id);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleEdit = (oldTitle: string) => {
      setIsEditing(true);
      setNewTitle(oldTitle);
      setDescription(todo.description);
      setEstimatedTime(todo.estimatedTime);
      setStartAt(todo.inProgressAt ? new Date(todo.inProgressAt) : undefined);
      setCompletedAt(todo.completedAt ? new Date(todo.completedAt) : undefined);
    };

    const handleSave = async () => {
      try {
        const isUpdated = await handlePatchTodo(todo.id, {
          title: newTitle,
          description,
          estimatedTime,
          inProgressAt: startAt,
          completedAt,
          status,
        });
        if (!isUpdated) {
          throw new Error("Unable to save a todo");
        }
        notification.success({
          message: "Todo has been saved",
        });
      } catch (e) {
        notification.error({
          message: "Unable to save a todo",
        });
      } finally {
        setIsEditing(false);
      }
    };

    return (
      <div
        className={cn("todo", {
          completed: status === "completed",
          inProgress: status === "inProgress",
        })}
      >
        <label className="todo__status-label">
          <div className="todo__status" />
        </label>

        <span
          className="todo__title"
          onDoubleClick={() => handleEdit(todo.title)}
        >
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__edit"
          onClick={() => handleEdit(todo.title)}
          disabled={isLoading}
        >
          <EditOutlined size={18}/>
        </button>

        <button
          type="button"
          className="todo__remove"
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={isLoading}
        >
          x
        </button>

        <div
          className={cn("modal overlay", {
            "is-active": isLoading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
        {isEditing && (
          <Modal
            centered
            open={isEditing}
            onCancel={() => setIsEditing(false)}
            footer={
              <div className="modal-footer">
                <button
                  type="button"
                  className="black-button"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  SAVE
                </button>
              </div>
            }
          >
            <div className="modal-content">
              <input
                type="text"
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                disabled={isLoading}
              />
              <textarea
                className="todoapp__new-todo"
                placeholder="More details (optional)"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                disabled={isLoading}
              />
              <div>
                <label htmlFor="estimated-time">Estimated time: </label>
                <input
                  id="estimated-time"
                  type="number"
                  value={estimatedTime}
                  onChange={(event) =>
                    setEstimatedTime(Number(event.target.value))
                  }
                  step={0.5}
                  style={{ width: "45px" }}
                  disabled={isLoading}
                />
                <span> hours</span>
              </div>
              <div>
                <label>STATUS: </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as typeof status)}
                >
                  <option value="created">Not started</option>
                  <option value="inProgress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              {status !== "created" && (
                <>
                  <div>
                    <label htmlFor="start-at">Start at (UTC): </label>
                    <input
                      id="start-at"
                      type="datetime-local"
                      //@ts-ignore
                      value={startAt?.toISOString()?.slice(0, 16)}
                      onChange={(event) =>
                        setStartAt(new Date(event.target.value))
                      }
                      disabled={isLoading}
                    />
                  </div>
                  {status === "completed" && (
                    <div>
                      <label htmlFor="completed-at">Completed at (UTC): </label>
                      <input
                        id="completed-at"
                        type="datetime-local"
                        //@ts-ignore
                        value={completedAt?.toISOString()?.slice(0, 16)}
                        onChange={(event) =>
                          setCompletedAt(new Date(event.target.value))
                        }
                        disabled={isLoading}
                      />
                    </div>
                  )}
                </>
              )}
              <AiTip id={todo.id}/>
            </div>
          </Modal>
        )}
        {isDeleteModalOpen && (
          <Modal
            centered
            open={isDeleteModalOpen}
            onCancel={() => setIsDeleteModalOpen(false)}
            footer={
              <div className="modal-footer">
                <button
                  type="button"
                  className="black-button"
                  onClick={() => onDelete(todo.id)}
                  disabled={isLoading}
                >
                  DELETE
                </button>
              </div>
            }
          >
            <div className="modal-content">
              <h2>Are you sure you want to delete this todo?</h2>
            </div>
          </Modal>
        )}
      </div>
    );
  }
);
