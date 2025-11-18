import { Link } from "react-router";

export default function Home() {
	return (
		<div className="min-h-screen flex justify-center">
			<div className="w-full max-w-6xl mt-8 mx-8 mb-auto px-6 py-10 rounded-lg bg-orange-100">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
					{/* Image Section - Left */}
					<div className="flex justify-center lg:justify-start">
						<img
							src="/image1.webp"
							alt="Music illustration"
							className="w-full max-w-md h-auto"
						/>
					</div>

					{/* Content Section - Right */}
					<div className="text-center lg:text-left text-neutral-800">
						<h1 className="text-4xl lg:text-6xl font-bold mb-4">Who Sings?</h1>
						<p className="text-lg lg:text-xl mb-8">Test your music knowledge</p>
						<Link
							to="/quiz"
							className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200 text-lg cursor-pointer"
						>
							Start Quiz
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
