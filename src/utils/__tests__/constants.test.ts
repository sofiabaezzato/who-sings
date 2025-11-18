import { API_CONFIG, GAME_CONFIG } from "../constants";

describe("Constants", () => {
	it("should have correct game configuration", () => {
		expect(GAME_CONFIG.QUESTIONS_PER_GAME).toBe(10);
		expect(GAME_CONFIG.TIME_PER_QUESTION_S).toBe(20);
		expect(GAME_CONFIG.BASE_POINTS).toBe(100);
		expect(GAME_CONFIG.TIME_BONUS_MULTIPLIER).toBe(0.5);
	});

	it("should have API configuration", () => {
		expect(API_CONFIG.BASE_URL).toBeDefined();
		expect(API_CONFIG.DEFAULT_COUNTRY).toBe("it");
		expect(API_CONFIG.RATE_LIMIT_DELAY_MS).toBe(200);
	});
});
