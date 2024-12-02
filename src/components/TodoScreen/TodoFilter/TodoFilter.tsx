import { memo } from "react";
import cn from "classnames";
import { FilterBy } from "../../../enums/FilterBy";

type Props = {
  filter: FilterBy;
  onChange: (newFilter: FilterBy) => void;
};

export const TodoFilter: React.FC<Props> = memo(({ filter, onChange }) => (
  <nav className="filter">
    <a
      className={cn("filter__link", {
        selected: filter === FilterBy.All,
      })}
      onClick={() => onChange(FilterBy.All)}
    >
      All
    </a>

    <a
      className={cn("filter__link", {
        selected: filter === FilterBy.Created,
      })}
      onClick={() => onChange(FilterBy.Created)}
    >
      Created
    </a>

    <a
      className={cn("filter__link", {
        selected: filter === FilterBy.Active,
      })}
      onClick={() => onChange(FilterBy.Active)}
    >
      Active
    </a>

    <a
      className={cn("filter__link", {
        selected: filter === FilterBy.Completed,
      })}
      onClick={() => onChange(FilterBy.Completed)}
    >
      Completed
    </a>
  </nav>
));
