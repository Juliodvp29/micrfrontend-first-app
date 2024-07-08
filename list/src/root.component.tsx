import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { ITodo, storeTodo } from "@safety/store";
import './css/style.css'

export default function Root(props) {
  const [todos, setTodos] = useState<ITodo[]>([])

  useEffect(() => {
    const sub = storeTodo.storeTodo$.subscribe(setTodos)
    return () => {
      sub.unsubscribe();
    }
  }, [])

  const handleDelete = (id: number) => {
    Swal.fire({
      title: '¿Estás seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí!'
    }).then((result) => {
      if (result.isConfirmed) {
        storeTodo.deleteTodo(id)
        Swal.fire(
          'Eliminado!',
          'La tarea ha sido eliminada.',
          'success'
        )
        setTodos(todos.filter(todo => todo.id !== id));
      }
    })
  }


  return (
    <section className="listMenu">
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Completed</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {todos.map(todo => (
            <tr key={todo.id}>
              <td>{todo.text}</td>
              <td>{todo.completed ? 'Terminado' : 'En Proceso'}</td>
              <td>
                <button onClick={() => handleDelete(todo.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
