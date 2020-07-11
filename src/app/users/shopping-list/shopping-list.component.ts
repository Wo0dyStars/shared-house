import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ShoppingList } from './shopping-list.model';
import { Purchase } from './purchase.model';

@Component({
	selector: 'app-shopping-list',
	templateUrl: './shopping-list.component.html',
	styleUrls: [ './shopping-list.component.scss' ]
})
export class ShoppingListComponent implements OnInit {
	shoppingList: { name: string; amount: string }[];
	purchases: Purchase[] = [];

	constructor(private http: HttpClient) {}

	ngOnInit(): void {
		this.getShoppingList();
		this.getPurchases();
	}

	getShoppingList() {
		this.http
			.get<{ shoppingList: ShoppingList }>('http://localhost:3000/users/shopping-list/show')
			.subscribe((response) => {
				this.shoppingList = response.shoppingList.items;
			});
	}

	getPurchases() {
		this.http.get<{ purchases: Purchase[] }>('http://localhost:3000/users/purchase/show').subscribe((response) => {
			this.purchases = response.purchases;
			console.log(this.purchases);
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
				this.onRemove(index);
				this.getShoppingList();
				this.getPurchases();
			});
	}
}
