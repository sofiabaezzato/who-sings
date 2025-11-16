import { Link } from "react-router";

export default function Home() {
	return (
		<div className="min-h-screen flex items-center">
			<div className="text-center text-neutral-800 w-full mx-10 px-8 py-8 h-3/4 rounded-lg bg-orange-100">
				<h1 className="text-6xl font-bold mb-4">Who Sings?</h1>
				<p className="text-xl mb-8">Test your music knowledge</p>
					<Link
						to="/quiz"
						className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200 text-lg cursor-pointer"
					>
						Start Quiz
					</Link>
			</div>
		</div>
	);
}
