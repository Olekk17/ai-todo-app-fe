import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Todo } from "../../../types/Todo";
import { TodoItem } from "../TodoItem";
import { TempTodo } from "../TempTodo";

type Props = {
  todos: Todo[];
  onDelete: (todoToDeleteId: number) => void;
  tempTodo: Partial<Todo> | null;
  loadingTodoIds: number[];
  handlePatchTodo: (todoId: number, data: Partial<Todo>) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  loadingTodoIds,
  handlePatchTodo
}) => {
  const isCreating = tempTodo?.id === 0;

  console.log(todos)

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              loadingTodoIds={loadingTodoIds}
              handlePatchTodo={handlePatchTodo}
            />
          </CSSTransition>
        ))}

        {isCreating && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TempTodo title={tempTodo.title || ""} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
