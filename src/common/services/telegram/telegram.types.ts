export interface ISendUserUpdate {
	name: string;
	email: string;
	password?: string | null;
}
export interface ISendOrdersUpdate {
	email : string;
	phone: string;
	comment: string;
	address: string;
}
