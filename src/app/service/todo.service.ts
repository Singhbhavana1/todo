import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  collectionData,
  deleteDoc, // Import deleteDoc for deleting documents
} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { increment } from 'firebase/firestore'; // Import increment directly
import { map, Observable } from 'rxjs';

// Define Todo interface
interface Todo {
  id?: string;
  isCompleted: boolean;
  todo: string;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(private afs: Firestore, private toastr: ToastrService) {}

  // Save a new todo item
  async saveTodo(categoryId: string, data: Todo): Promise<void> {
    try {
      const categoryDocRef = doc(this.afs, `categories/${categoryId}`);
      await addDoc(collection(categoryDocRef, 'todos'), data);

      // Increment the todo count
      await updateDoc(categoryDocRef, {
        todoCount: increment(1),
      });

      this.toastr.success('New Todo Added');
    } catch (error) {
      console.error('Error adding todo: ', error);
      this.toastr.error('Error adding todo');
    }
  }

  // Load todos for a specific category
  loadTodos(categoryId: string): Observable<Todo[]> {
    const todosCollection = collection(
      this.afs,
      `categories/${categoryId}/todos`
    );

    return collectionData<Todo>(todosCollection, { idField: 'id' }).pipe(
      map((todos: Todo[]) =>
        todos.map((todo: Todo) => ({
          id: todo.id, // Document ID
          ...todo, // Document data
        }))
      )
    );
  }

  // Update a specific todo item
  async updateTodo(
    catId: string,
    todoId: string,
    updatedData: string
  ): Promise<void> {
    try {
      const todoDocRef = doc(this.afs, `categories/${catId}/todos/${todoId}`);
      await updateDoc(todoDocRef, { todo: updatedData });

      this.toastr.success('Todo Updated Successfully');
    } catch (error) {
      console.error('Error updating todo: ', error);
      this.toastr.error('Error updating todo');
    }
  }

  // Delete a todo item
  async deleteTodo(catId: string, todoId: string): Promise<void> {
    try {
      const todoDocRef = doc(this.afs, `categories/${catId}/todos/${todoId}`);

      await deleteDoc(todoDocRef);

      await updateDoc(doc(this.afs, `categories/${catId}`), {
        todoCount: increment(-1), // Use increment correctly
      });

      this.toastr.error('Todo Deleted Successfully');
    } catch (error) {
      console.error('Error deleting todo: ', error);
      this.toastr.error('Error deleting todo');
    }
  }

  async markCompelted(catId: string, todoId: string) {
    try {
      const todoDocRef = doc(this.afs, `categories/${catId}/todos/${todoId}`);
      await updateDoc(todoDocRef, { isCompleted: true });

      this.toastr.info('Todo Marked Completed');
    } catch (error) {
      console.error('Error updating todo: ', error);
      this.toastr.error('Error updating todo');
    }
  }

  async markunCompelted(catId: string, todoId: string) {
    try {
      const todoDocRef = doc(this.afs, `categories/${catId}/todos/${todoId}`);
      await updateDoc(todoDocRef, { isCompleted: false });

      this.toastr.warning('Todo Marked unCompleted');
    } catch (error) {
      console.error('Error updating todo: ', error);
      this.toastr.error('Error updating todo');
    }
  }
}
