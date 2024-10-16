// src/app/components/item-detail/item-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css'],
})
export class ItemDetailComponent implements OnInit {
  item?: Item;

  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const itemId = this.route.snapshot.params['id'];
    this.loadItem(itemId);
  }

  loadItem(id: string): void {
    this.itemService.getItem(id).subscribe(
      (data) => {
        this.item = data;
      },
      (error) => {
        console.error('Erro ao carregar o item', error);
        alert('Erro ao carregar o item.');
      }
    );
  }

  deleteItem(): void {
    if (this.item && confirm('Tem certeza de que deseja remover este item?')) {
      this.itemService.deleteItem(this.item.id!).subscribe(
        () => {
          alert('Item excluído com sucesso!');
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Erro ao excluir o item', error);
          alert('Erro ao excluir o item.');
        }
      );
    }
  }
}
