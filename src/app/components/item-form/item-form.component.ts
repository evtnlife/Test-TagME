// src/app/components/item-form/item-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '../../models/item.model';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css'],
})
export class ItemFormComponent implements OnInit {
  itemForm: FormGroup;
  isEditMode: boolean = false;
  itemId?: string;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  originalImageUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.itemForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.isEditMode = true;
      this.itemId = this.route.snapshot.params['id'];
      this.loadItem();
    }
  }

  loadItem(): void {
    if (this.itemId) {
      this.itemService.getItem(this.itemId).subscribe(
        (item: Item) => {
          this.itemForm.patchValue({
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
          });
          this.originalImageUrl = item.imageUrl;
        },
        (error) => {
          console.error('Erro ao carregar o item', error);
          alert('Erro ao carregar o item para edição.');
        }
      );
    }
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      const item: Item = this.itemForm.value;

      if (this.isEditMode && this.itemId) {
        item.id = this.itemId;
        this.itemService.updateItem(item).subscribe(
          () => {
            alert('Item atualizado com sucesso!');
            this.router.navigate(['/']);
          },
          (error) => {
            console.error('Erro ao atualizar o item', error);
            alert('Erro ao atualizar o item.');
          }
        );
      } else {
        this.itemService.createItem(item).subscribe(
          () => {
            alert('Item criado com sucesso!');
            this.router.navigate(['/']);
          },
          (error) => {
            console.error('Erro ao criar o item', error);
            alert('Erro ao criar o item.');
          }
        );
      }
    } else {
      this.itemForm.markAllAsTouched();
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
    this.itemForm.patchValue({
      imageUrl: this.croppedImage,
    });
  }
  

  replaceImage(): void {
    this.originalImageUrl = this.croppedImage;
    this.croppedImage = '';
    this.imageChangedEvent = '';
  }
}
