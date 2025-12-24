
import React, { useRef, useEffect } from 'react';

interface MemeCanvasProps {
  imageUrl: string;
  caption: string;
  author?: string;
  onReady?: (blob: Blob) => void;
  fontFamily?: string;
}

const MemeCanvas: React.FC<MemeCanvasProps> = ({ imageUrl, caption, author, onReady, fontFamily = 'Oswald' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageUrl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      canvas.width = 800;
      canvas.height = 800;
      
      // Draw image
      ctx.drawImage(img, 0, 0, 800, 800);

      // Setup Top Caption
      const fontSize = 48;
      ctx.font = `bold ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 6;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // Multi-line text handling for top caption
      const words = caption.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      const maxWidth = 740;

      words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine !== '') {
          lines.push(currentLine);
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      });
      lines.push(currentLine);

      const startY = 40; 
      lines.forEach((line, index) => {
        const y = startY + index * (fontSize + 10);
        ctx.strokeText(line.trim(), 400, y);
        ctx.fillText(line.trim(), 400, y);
      });

      // Render Author Watermark if exists
      if (author && author.trim()) {
        const authorText = author.startsWith('@') ? author : `@${author}`;
        const authorFontSize = 24;
        ctx.font = `bold ${authorFontSize}px Inter, sans-serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.lineWidth = 4;
        
        const x = 780;
        const y = 780;
        
        ctx.strokeText(authorText, x, y);
        ctx.fillText(authorText, x, y);
      }

      canvas.toBlob((blob) => {
        if (blob && onReady) onReady(blob);
      }, 'image/png');
    };
  }, [imageUrl, caption, author, fontFamily, onReady]);

  return (
    <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-2xl border-4 border-yellow-500 bg-neutral-900">
      <canvas ref={canvasRef} className="w-full h-full object-contain" />
      {!imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-400 italic">
          Đang chờ ý tưởng mặn mòi...
        </div>
      )}
    </div>
  );
};

export default MemeCanvas;
