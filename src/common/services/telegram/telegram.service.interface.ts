import { ISendUserUpdate, ISendOrdersUpdate } from "./telegram.types";
export interface ITelegramService {
	sendUsersUpdate: (data: ISendUserUpdate) => Promise<void>;
	sendOrdersUpdate: (data: ISendOrdersUpdate) => Promise<void>;
}
