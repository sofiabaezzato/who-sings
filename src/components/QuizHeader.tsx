export default function QuizHeader() {
	return (
		<div className="w-full px-6 py-4 bg-orange-100">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center">
				{/* Image Section - Left */}
				<div className="flex justify-center lg:justify-end">
					<img
						src="/image2.webp"
						alt="Music illustration"
						className="w-full max-w-[160px] lg:max-w-[260px] h-auto"
					/>
				</div>

				{/* Content Section - Right */}
				<div className="text-center lg:text-left text-neutral-800">
					<h1 className="text-4xl lg:text-6xl font-bold mb-4">Who Sings?</h1>
					<p className="text-lg lg:text-xl mb-8">Test your music knowledge</p>
				</div>
			</div>
		</div>
	);
}
