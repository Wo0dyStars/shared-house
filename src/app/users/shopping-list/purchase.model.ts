export interface Purchase {
	userID: string;
	items: [
		{
			name: string;
			amount: string;
			date: string;
		}
	];
}
