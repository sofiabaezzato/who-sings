import { Share2 } from "lucide-react";
import { forwardRef } from "react";

interface TestCardProps {
  playerName: string;
  totalScore: number;
  onShare: () => void;
}

export const TestCard = forwardRef<HTMLDivElement, TestCardProps>(
  ({ playerName, totalScore, onShare }, ref) => {
    return (
      <div className="flex flex-col items-center gap-6">
        {/* Simple test card with only basic styles */}
        <div
          ref={ref}
          data-share-card
          style={{
            width: '320px',
            height: '568px',
            backgroundColor: '#f97316',
            color: '#ffffff',
            padding: '32px',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}
        >
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
            WHO SINGS?
          </h1>
          
          <p style={{ fontSize: '18px', marginBottom: '32px', opacity: '0.8' }}>
            {playerName}
          </p>
          
          <div style={{ 
            fontSize: '72px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: '24px',
            borderRadius: '16px',
            minWidth: '200px'
          }}>
            {totalScore}
          </div>
          
          <p style={{ fontSize: '20px', fontWeight: '600' }}>
            POINTS
          </p>
        </div>

        {/* Share Button */}
        <button
          onClick={onShare}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 text-lg cursor-pointer flex items-center gap-2"
        >
          <Share2 />
          Share Test
        </button>
      </div>
    );
  }
);

TestCard.displayName = "TestCard";