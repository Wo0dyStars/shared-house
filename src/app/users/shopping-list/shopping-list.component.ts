import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ShoppingList } from './shopping-list.model';

@Component({
	selector: 'app-shopping-list',
	templateUrl: './shopping-list.component.html',
	styleUrls: [ './shopping-list.component.scss' ]
})
export class ShoppingListComponent implements OnInit {
	shoppingList: { name: string; amount: string }[];

	constructor(private http: HttpClient) {}

	ngOnInit(): void {
		this.getShoppingList();
	}

	getShoppingList() {
		this.http
			.get<{ shoppingList: ShoppingList }>('http://localhost:3000/users/shopping-list/show')
			.subscribe((response) => {
				this.shoppingList = response.shoppingList.items;
			});
	}

	onSubmit(form: NgForm) {
		this.http.post('http://localhost:3000/users/shopping-list/add', form.value).subscribe((response) => {
			this.getShoppingList();
		});
	}

	onRemove(index: number) {
		this.http
			.post('http://localhost:3000/users/shopping-list/remove', { item: this.shoppingList[index] })
			.subscribe((response) => {
				this.getShoppingList();
			});
	}

	onBuy(index: number) {
		this.http
			.post('http://localhost:3000/users/purchase/new', { item: this.shoppingList[index] })
			.subscribe((response) => {
				console.log(response);
				this.onRemove(index);
				this.getShoppingList();
			});
	}
}
