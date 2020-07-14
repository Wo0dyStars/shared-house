import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ShoppingList } from './shopping-list.model';
import { Purchase } from './purchase.model';
import { AuthorizationService } from 'src/app/authorization/authorization.service';
import { environment } from 'src/environments/environment';

const URL = environment.URL + '/users/';

@Component({
	selector: 'app-shopping-list',
	templateUrl: './shopping-list.component.html',
	styleUrls: [ './shopping-list.component.scss' ]
})
export class ShoppingListComponent implements OnInit {
	shoppingList: { name: string; amount: string }[];
	purchases: Purchase[] = [];
	isLoading = false;
	message: string = '';

	constructor(private http: HttpClient, private authorizationService: AuthorizationService) {}

	ngOnInit(): void {
		this.message = '';
		this.isLoading = true;
		this.getShoppingList();
		this.getPurchases();
	}

	getShoppingList() {
		this.http.get<{ shoppingList: ShoppingList }>(URL + 'shopping-list/show').subscribe((response) => {
			this.shoppingList = response.shoppingList.items;
		});
	}

	getPurchases() {
		this.isLoading = true;
		this.http.get<{ purchases: Purchase[] }>(URL + 'purchase/show').subscribe((response) => {
			this.purchases = response.purchases;
			this.isLoading = false;
		});
	}

	onSubmit(form: NgForm) {
		this.http.post<{ message: string }>(URL + 'shopping-list/add', form.value).subscribe((response) => {
			this.message = response.message;
			this.getShoppingList();
		});
	}

	onRemove(index: number) {
		this.http
			.post<{ message: string }>(URL + 'shopping-list/remove', {
				item: this.shoppingList[index]
			})
			.subscribe((response) => {
				this.message = response.message;
				this.getShoppingList();
			});
	}

	onBuy(index: number) {
		this.http
			.post<{ message: string }>(URL + 'purchase/new', { item: this.shoppingList[index] })
			.subscribe((response) => {
				this.message = response.message;
				this.onRemove(index);
				this.getShoppingList();
				this.getPurchases();
				this.authorizationService.calculateScores();
			});
	}
}
