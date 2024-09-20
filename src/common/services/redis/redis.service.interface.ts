export interface IRedisService {
	set: (key: string, value: string, expireTime: number) => Promise<void>;
	get: (key: string) => Promise<string | null>;
}
