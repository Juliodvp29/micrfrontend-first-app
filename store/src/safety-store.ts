import { BehaviorSubject, Observable } from "rxjs";

export interface ITodo {
    id: number;
    text: string;
    completed: boolean;
}

class StoreTodo {
    private _storeTodo$: BehaviorSubject<ITodo[]>;
    private _id: number;
    private _key: string;

    constructor() {
        this._id = 0;
        this._key = 'TODOS';
        this._storeTodo$ = new BehaviorSubject(this.getFromLocalStorage())
    }

    get storeTodo$(): Observable<ITodo[]> {
        return this._storeTodo$.asObservable();
    }

    get id(): number {
        return this._id;
    }

    addTodo(todo: ITodo): void {
        this._storeTodo$.next([...this._storeTodo$.value, todo]);
        this._id++;
        this.saveInLocalStorage();
    }

    changeCompleted(id: number): void {
        const todos = this.todos().map((todo): ITodo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
        this._storeTodo$.next([...todos]);
        this.saveInLocalStorage();
    }

    deleteTodo(id: number): void {
        const todos = this.todos().filter((todo) => todo.id !== id);
        this._storeTodo$.next([...todos]);
        this.saveInLocalStorage()
    }

    private todos(): ITodo[] {
        return this._storeTodo$.getValue();
    }

    private saveInLocalStorage(): void {
        localStorage.setItem(this._key, JSON.stringify(this.todos()));
    }

    private getFromLocalStorage(): ITodo[] {
        const todos = localStorage.getItem(this._key);
        if (todos) {
            const todosParsed = JSON.parse(todos) as ITodo[];
            this._id = todosParsed.length > 0 ? todosParsed[todosParsed.length - 1].id + 1 : 0;
            return todosParsed;
        } else {
            return []
        }
    }
}

export const storeTodo = new StoreTodo();

