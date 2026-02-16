import L from 'leaflet';

export const createPropertyIcon = (price: number, status: string, isSmall: boolean = false) => {
  const formattedPrice = price >= 1000000 
    ? (price / 1000000).toFixed(1) + 'M' 
    : (price / 1000).toFixed(0) + 'K';

  const color = status === 'for-rent' ? '#10b981' : '#ff6b00';

  const padding = isSmall ? '4px 8px' : '4px 12px';
  const fontSize = isSmall ? '12px' : '14px';
  const width = isSmall ? 60 : 80;
  const height = isSmall ? 30 : 35;

  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; color: white; padding: ${padding}; border-radius: 20px; font-weight: bold; font-size: ${fontSize}; white-space: nowrap; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
            JOD ${formattedPrice}
           </div>`,
    iconSize: L.point(width, height),
    iconAnchor: [width / 2, height / 2]
  });
};
