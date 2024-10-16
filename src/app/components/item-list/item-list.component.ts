// src/app/components/item-list/item-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
})
export class ItemListComponent implements OnInit {
  items: Item[] = [];
  filteredItems: Item[] = [];
  searchTerm: string = '';

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.itemService.getItems().subscribe(
      (data) => {
        this.items = data;
        this.applyFilter();
      },
      (error) => {
        console.error('Error fetching items', error);
      }
    );
  }

  deleteItem(id: string): void {
    if (confirm('Tem certeza de que deseja remover este item?')) {
      this.itemService.deleteItem(id).subscribe(
        () => {
          this.loadItems();
        },
        (error) => {
          console.error('Error deleting item', error);
        }
      );
    }
  }

  applyFilter(): void {
    if (this.searchTerm) {
      const lowerTerm = this.searchTerm.toLowerCase();
      this.filteredItems = this.items.filter((item) =>
        item.title.toLowerCase().includes(lowerTerm)
      );
    } else {
      this.filteredItems = this.items;
    }
  }
}
