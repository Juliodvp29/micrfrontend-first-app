import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { storeTodo, ITodo } from '@safety/store';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'form';

  form: FormGroup;


  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: new FormControl(null, Validators.required)
    })

    console.log(storeTodo)
  }

  onSubmit(): void {
    const { title } = this.form.value;

    const todo: ITodo = {
      completed: true,
      id: storeTodo.id,
      text: title
    }

    storeTodo.addTodo(todo);
    this.form.reset()
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Tarea agregada exitosamente',
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        popup: 'swal2-toast'
      }
    });
  }

}
