import React, { useState } from "react";
import { usePlayerLogin } from "../hooks/usePlayerLogin";

interface PlayerAuthProps {
	onAuthComplete?: () => void;
}

export function PlayerAuth({ onAuthComplete }: PlayerAuthProps) {
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { handleLogin } = usePlayerLogin();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim()) return;

		setIsLoading(true);

		try {
			handleLogin(name.trim());
			onAuthComplete?.();
		} catch (error) {
			console.error("Login failed:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<div className="w-full py-10 px-2 flex flex-col items-center justify-center text-center bg-orange-500">
				<h1 className="text-4xl font-bold text-gray-800 mb-2">WHO SINGS?</h1>
				<p className="text-gray-800 font-semibold">Test your music knowledge</p>
			</div>
			<div className="flex-1 flex justify-center p-4">
				<div className="w-full max-w-md">
					<div className="bg-white rounded-3xl shadow-xl p-8 text-center">
						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label
									htmlFor="playerName"
									className="block text-xl font-semibold text-gray-700 mb-6"
								>
									How can we call you?
								</label>
								<input
									id="playerName"
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Enter your name"
									maxLength={20}
									disabled={isLoading}
									className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
								/>
							</div>

							<button
								disabled={!name.trim() || isLoading}
								className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200 text-lg cursor-pointer disabled:cursor-not-allowed"
							>
								{isLoading ? "Starting..." : "Start Playing"}
							</button>
						</form>

						<p className="text-sm text-gray-500 mt-6">
							Your progress will be saved locally
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
