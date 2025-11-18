import html2canvas from "html2canvas-pro";
import { useCallback } from "react";

export function useShareCard() {
	const downloadImage = useCallback((blob: Blob) => {
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `who-sings-score-${Date.now()}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}, []);

	const shareCard = useCallback(
		async (element: HTMLDivElement | null) => {
			if (!element) {
				console.error("No element provided");
				return;
			}

			try {
				const cardElement = element.hasAttribute("data-share-card")
					? element
					: (element.querySelector("[data-share-card]") as HTMLElement);

				if (!cardElement) {
					console.error("Card element not found. Element:", element);
					return;
				}

				console.log("Capturing card element:", cardElement);

				// Generate canvas from the card element
				const canvas = await html2canvas(cardElement, {
					backgroundColor: "rgba(0,0,0,0)",
					scale: 2,
					useCORS: true,
					logging: false,
				});

				// Convert canvas to blob
				canvas.toBlob(async (blob) => {
					if (!blob) {
						console.error("Failed to create blob from canvas");
						return;
					}

					const file = new File([blob], "who-sings-score.png", {
						type: "image/png",
					});

					// Try Web Share API first (mobile-friendly)
					if (
						navigator.share &&
						navigator.canShare &&
						navigator.canShare({ files: [file] })
					) {
						try {
							await navigator.share({
								files: [file],
								title: "Check out my Who Sings score!",
								text: "I just completed the Who Sings music quiz! Can you beat my score?",
							});
						} catch (shareError: any) {
							// User cancelled the share dialog
							if (shareError.name === "AbortError") {
								console.log("Share cancelled by user");
								return;
							}
							// Sharing failed, fallback to download
							console.warn("Share failed, downloading instead:", shareError);
							downloadImage(blob);
						}
					} else {
						// Web Share API not supported, download directly
						downloadImage(blob);
					}
				}, "image/png");
			} catch (error) {
				console.error("Error generating share image:", error);

				// Ultimate fallback: try to copy URL to clipboard
				try {
					if (navigator.clipboard) {
						await navigator.clipboard.writeText(window.location.href);
						alert(
							"Unable to generate image. Link copied to clipboard instead!",
						);
					} else {
						alert(
							"Unable to share. Please take a screenshot to share your score!",
						);
					}
				} catch (clipboardError) {
					alert(
						"Unable to share. Please take a screenshot to share your score!",
					);
				}
			}
		},
		[downloadImage],
	);

	return { shareCard };
}
