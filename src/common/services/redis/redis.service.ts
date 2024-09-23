import Redis from "ioredis";
import { TYPES } from "../../../types";
import { injectable, inject } from "inversify";
import { IRedisService } from "./redis.service.interface";
import { IConfigService } from "../../config/config.service.interface";

@injectable()
export class RedisService implements IRedisService {
	private client: Redis;
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {
		this.client = new Redis({
			host: this.configService.get("REDIS_HOST") as string,
			port: Number(this.configService.get("REDIS_PORT")) as number,
		});
	}

	async set(key: string, value: string, expireTime: number): Promise<void> {
		await this.client.set(key, value, "EX", expireTime);
	}

	async get(key: string): Promise<string | null> {
		return this.client.get(key);
	}
}

