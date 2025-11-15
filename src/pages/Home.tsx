import { Link } from "react-router";

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-tr from-white via-pink-500 to-orange-500 flex items-center justify-center">
			<div className="text-center text-white">
				<h1 className="text-6xl font-bold mb-4">Who Sings?</h1>
				<p className="text-xl mb-8">Test your music knowledge</p>
				<Link
					to="/quiz"
					className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
				>
					Start Quiz
				</Link>
			</div>
		</div>
	);
}
