import { Component } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../service/category.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  providers: [],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent {
  categories: any = [];
  dataStatus: any = 'Add';
  categoryName = '';
  catId: any;

  color: any = [
    '#2596be',
    '#ff0066',
    '#00ffcc',
    '#6600cc',
    '#0000ff',
    '#ff5500',
    '#ffff00',
    '#ff0000',
    '#990033',
    '#0066ff',
    '#cc0099',
    '#cc99ff',
    '#666699',
    '#339966',
    '#33cc33',
  ];

  constructor(private service: CategoryService) {}

  onSubmit(f: NgForm) {
    if (this.dataStatus === 'Add') {
      let randomNumber = Math.floor(Math.random() * this.color.length);
      let todoCategory = {
        category: f.value.categoryName,
        colorCode: this.color[randomNumber],
        todoCount: 0,
      };
      this.service.saveCategory(todoCategory).then(() => this.resetForm());
      f.resetForm();
    } else if (this.dataStatus === 'Edit') {
      const updatedData = { category: f.value.categoryName };
      this.service.updateCategories(this.catId, updatedData).then(() => {
        this.resetForm();
        f.resetForm();
      });
    }
  }

  resetForm() {
    this.categoryName = '';
    this.dataStatus = 'Add';
    this.catId = null;
  }

  onEdit(category: string, id: string) {
    this.categoryName = category;
    this.dataStatus = 'Edit';
    this.catId = id;
  }

  onDelete(id: string) {
    this.service.deleteCategories(id);
  }

  ngOnInit(): void {
    this.service.loadCategories().subscribe((res) => {
      console.log(res);
      this.categories = res;
    });
  }
}
