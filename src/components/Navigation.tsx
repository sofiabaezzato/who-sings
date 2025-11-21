import { Menu, PlayCircle, Trophy, User, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function Navigation() {
	const location = useLocation();
	const { player, isLoggedIn, logout } = useAuth();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const mobileMenuRef = useRef<HTMLDivElement>(null);
	const mobileButtonRef = useRef<HTMLDivElement>(null);

	const navigationLinks = useMemo(
		() => [
			{ to: "/quiz", label: "Quiz", icon: PlayCircle },
			{ to: "/leaderboard", label: "Leaderboard", icon: Trophy },
		],
		[],
	);

	// Close mobile menu when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			const target = event.target as Node;
			const isInsideMenu = mobileMenuRef.current?.contains(target);
			const isInsideButton = mobileButtonRef.current?.contains(target);

			if (!isInsideMenu && !isInsideButton) {
				setIsMobileMenuOpen(false);
			}
		}

		if (isMobileMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}
	}, [isMobileMenuOpen]);

	return (
		<nav className="relative bg-white border-b border-gray-200 px-4 py-4">
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				{/* Logo - Left */}
				<Link to="/" className="flex items-center space-x-2">
					<img
						src="/logo.png"
						alt="Musixmatch"
						className="h-10 w-auto flex-shrink-0"
					/>
				</Link>

				{/* Desktop Navigation - Center */}
				<div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-1">
					{navigationLinks.map((link) => {
						const Icon = link.icon;
						const isActive = location.pathname === link.to;
						return (
							<Link
								key={link.to}
								to={link.to}
								className={cn(
									"flex items-center space-x-2 px-5 py-3 rounded-full text-md font-semibold transition-colors",
									isActive
										? "text-orange-600 bg-orange-50"
										: "text-gray-800 hover:text-gray-900 hover:bg-neutral-100",
								)}
							>
								<Icon className="w-6 h-6" />
								<span>{link.label}</span>
							</Link>
						);
					})}
				</div>

				{/* Desktop Profile Menu - Right */}
				<div className="hidden md:flex items-center">
					{isLoggedIn && (
						<div className="relative group">
							<button className="flex items-center space-x-2 px-5 py-3 rounded-full transition-colors text-md font-semibold text-gray-800 hover:text-gray-900 hover:bg-neutral-100 cursor-pointer">
								<User className="w-6 h-6" />
								<span>{player?.name}</span>
							</button>
							<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
								<div className="py-1">
									<Link
										to="/profile"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
									>
										Profile
									</Link>
									<button
										onClick={logout}
										className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
									>
										Logout
									</button>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Mobile Menu Button */}
				<div ref={mobileButtonRef} className="md:hidden">
					<button
						type="button"
						className="rounded-full h-10 w-10 inline-flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					>
						{isMobileMenuOpen ? (
							<X className="w-8 h-8" />
						) : (
							<Menu className="w-8 h-8" />
						)}
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div
					ref={mobileMenuRef}
					className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
				>
					<div className="p-4 space-y-2">
						{navigationLinks.map((link) => {
							const Icon = link.icon;
							const isActive = location.pathname === link.to;
							return (
								<Link
									key={link.to}
									to={link.to}
									className={cn(
										"flex items-center space-x-3 px-4 py-3 text-base font-semibold rounded-full transition-colors",
										isActive
											? "text-orange-600 bg-orange-50"
											: "text-gray-800 hover:text-gray-900 hover:bg-neutral-100",
									)}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									<Icon className="w-5 h-5" />
									<span>{link.label}</span>
								</Link>
							);
						})}
						{isLoggedIn && (
							<>
								<hr className="my-2" />
								<Link
									to="/profile"
									className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Profile ({player?.name})
								</Link>
								<button
									onClick={() => {
										logout();
										setIsMobileMenuOpen(false);
									}}
									className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md"
								>
									Logout
								</button>
							</>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}
