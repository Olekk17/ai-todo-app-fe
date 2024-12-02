import { client } from "../utils/fetchClient";

export const getTodoTipById = (id: number) =>
  client.get<string>(`/todos/tip/${id}`);

export const analyzeLastNTodos = (n: number) =>
  client.get<string>(`/user/anylyzeTodos?n=${n}`);
