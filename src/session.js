export class Session {
  #redis;
  constructor(redis) {
    this.#redis = redis;
    this.#redis.set("counter", 0);
  }

  async create(userId) {
    const sessionId = await this.#redis.incr("counter");
    await this.#redis.hset("sessions", sessionId, userId);

    return sessionId;
  }

  async getUser(sessionId) {
    return await this.#redis.hget("sessions", sessionId);
  }

  async delete(sessionId) {
    return await this.#redis.hdel("sessions", sessionId);
  }
}
