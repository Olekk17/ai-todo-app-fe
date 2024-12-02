import { FilterBy } from "../../../enums/FilterBy";
import { TodoFilter } from "../TodoFilter";

type Props = {
  filter: FilterBy;
  onChange: (newFilter: FilterBy) => void;
  activeTodosNumber: number;
};

export const Footer: React.FC<Props> = ({
  filter,
  onChange,
  activeTodosNumber,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">{`${activeTodosNumber} items left`}</span>

    <TodoFilter filter={filter} onChange={onChange} />
  </footer>
);
