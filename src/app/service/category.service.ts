import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  CollectionReference,
  DocumentData,
  collectionData,
  doc,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';

// Define Category interface
interface Category {
  id?: string;
  category: string;
  colorCode: string;
  todoCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categoriesCollection: CollectionReference<DocumentData>;

  constructor(private afs: Firestore, private toastr: ToastrService) {
    this.categoriesCollection = collection(this.afs, 'categories');
  }

  // Save category
  async saveCategory(data: Category): Promise<void> {
    try {
      await addDoc(this.categoriesCollection, data);
      console.log('Success: Category added');
      this.toastr.success('New Category Saved Successfully');
    } catch (error) {
      console.error('Error adding category: ', error);
    }
  }

  // Load categories with proper typing
  loadCategories(): Observable<Category[]> {
    const categoriesRef = collection(this.afs, 'categories');

    return collectionData(categoriesRef, { idField: 'id' }).pipe(
      map((categories: DocumentData[]) => {
        return categories.map((category) => {
          return {
            id: category['id'],
            category: category['category'],
            colorCode: category['colorCode'],
            todoCount: category['todoCount'],
          } as Category;
        });
      })
    );
  }

  // Update categories
  async updateCategories(
    id: string,
    updatedData: Partial<Category>
  ): Promise<void> {
    try {
      // Get a reference to the document using the doc function
      const categoryDocRef = doc(this.afs, 'categories', id); // Correctly specifying the document reference

      await updateDoc(categoryDocRef, updatedData); // Update the document
      console.log('Category updated successfully');
      this.toastr.success('Category updated successfully');
    } catch (error) {
      console.error('Error updating category: ', error);
      this.toastr.error('Error updating category');
    }
  }

  // Delete categories
  async deleteCategories(id: string): Promise<void> {
    try {
      const categoryDocRef = doc(this.afs, 'categories', id); // Correctly specifying the document reference

      await deleteDoc(categoryDocRef); // Delete the document
      console.log('Category deleted successfully');
      this.toastr.error('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category: ', error);
      this.toastr.error('Error deleting category');
    }
  }
}
