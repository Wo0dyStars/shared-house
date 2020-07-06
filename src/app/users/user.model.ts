export interface User {
	email: string;
	password: string;
	isVerified: boolean;
	forename: string;
	surname: string;
	age: number;
	occupation: string;
	phone: string;
	avatar: string;
	movedIn: Date;
	lastUpdated: Date;
}
