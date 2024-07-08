declare module '@safety/store' {
  import { Observable } from "rxjs";
  export interface ITodo {
    id: number;
    text: string;
    completed: boolean;
  }
  class StoreTodo {
    private _storeTodo$;
    private _id;
    private _key;
    constructor();
    get storeTodo$(): Observable<ITodo[]>;
    get id(): number;
    addTodo(todo: ITodo): void;
    changeCompleted(id: number): void;
    deleteTodo(id: number): void;
    private todos;
    private saveInLocalStorage;
    private getFromLocalStorage;
  }
  export const storeTodo: StoreTodo;
}
