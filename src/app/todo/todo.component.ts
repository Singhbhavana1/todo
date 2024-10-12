import { Component } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TodoService } from '../service/todo.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent {
  todoName: string = '';
  catId: string = '';
  todoValue = ''; // This stores the value entered in the input
  todoId: string = ''; // This will hold the ID of the todo being edited
  dataStatus: any = 'Add'; // This controls whether we are adding or editing
  todos: any[] = []; // List of todos

  constructor(
    private todoService: TodoService,
    private route: ActivatedRoute
  ) {}

  // Handles both adding and editing todos
  onSubmit(f: NgForm) {
    if (this.dataStatus === 'Add') {
      let todo = {
        todo: f.value.todoValue,
        isCompleted: false,
      };

      this.todoService.saveTodo(this.catId, todo);
      f.resetForm();
    } else if (this.dataStatus === 'Edit') {
      this.todoService.updateTodo(this.catId, this.todoId, f.value.todoValue);
      f.resetForm();
      this.dataStatus = 'Add'; // Switch back to 'Add' mode after editing
    }
  }

  // Fills the form with the todo to edit
  onEdit(todoText: string, todoId: string) {
    this.todoValue = todoText; // Populate the input field with the todo text
    this.dataStatus = 'Edit'; // Switch to 'Edit' mode
    this.todoId = todoId;
  }

  onDelete(todoId: string) {
    // Ensure you pass the correct category ID and the todo ID
    this.todoService.deleteTodo(this.catId, todoId);
    console.log('Deleting todo:', todoId, 'from category:', this.catId);
  }

  completeTodo(todoId: string) {
    this.todoService.markCompelted(this.catId, todoId);
  }
  uncompleteTodo(todoId: string) {
    this.todoService.markunCompelted(this.catId, todoId);
  }

  ngOnInit(): void {
    this.catId = this.route.snapshot.paramMap.get('id') || '';
    this.todoService.loadTodos(this.catId).subscribe((res) => {
      this.todos = res;
    });
  }
}
