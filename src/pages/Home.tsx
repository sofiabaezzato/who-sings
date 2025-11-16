import { Link } from "react-router";

export default function Home() {
	return (
		<div className="min-h-screen flex items-center">
			<div className="text-center text-neutral-800 w-full mx-10 my-auto px-8 py-12 rounded-lg bg-orange-100">
				<h1 className="text-6xl font-bold mb-4">Who Sings?</h1>
				<p className="text-xl mb-8">Test your music knowledge</p>
				<button className="bg-orange-500 rounded-md text-lg font-semibold px-10 py-4">
					<Link to="/quiz">Start Quiz</Link>
				</button>
			</div>
		</div>
	);
}
