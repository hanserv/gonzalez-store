import {useEffect, useMemo} from 'react';
import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {useMediaQuery} from '@/shop/hooks/useMediaQuery';
import {formatSalesLabel} from '@/province-sales/lib/format';
import type {ProvinceSales} from '@/province-sales/interfaces/province-sales.interface';

interface SalesMapProps {
	provinces: ProvinceSales[];
}

const markerIcon = L.divIcon({
	className: 'province-sales-marker',
	html: `
		<div style="width: 40px; height: 40px; border-radius: 9999px; background: rgba(17,17,17,0.96); box-shadow: 0 10px 24px rgba(0,0,0,0.18); display:flex; align-items:center; justify-content:center; overflow:hidden;">
			<img src="/gonzalez-logo-white.png" alt="Gonzalez Peña" style="width: 28px; height: 28px; object-fit: contain; filter: brightness(1.2);" />
		</div>
	`,
	iconSize: [40, 40],
	iconAnchor: [20, 20],
	popupAnchor: [0, -20],
});

const MapInteractionSync = ({isMobile}: {isMobile: boolean}) => {
	const map = useMap();

	useEffect(() => {
		if (isMobile) {
			map.dragging.disable();
			map.touchZoom.disable();
		} else {
			map.dragging.enable();
			map.touchZoom.enable();
		}
	}, [isMobile, map]);

	return null;
};

export default function SalesMap({provinces}: SalesMapProps) {
	const isMobile = useMediaQuery('(max-width: 767px)');
	const visibleProvinces = useMemo(
		() => provinces.filter((province) => province.totalSales > 0),
		[provinces],
	);

	return (
		<div
			className='relative isolate z-0 overflow-hidden rounded-xl border border-gray-200 bg-gonzalez-bone shadow-xs'
			role='region'
			aria-label='Mapa de ventas por provincia'
		>
			<MapContainer
				center={[18.9, -70.4]}
				zoom={8}
				minZoom={7}
				maxBounds={[
					[17.2, -72.5],
					[20.2, -68.0],
				]}
				maxBoundsViscosity={1.0}
				scrollWheelZoom={false}
				dragging={!isMobile}
				touchZoom={!isMobile}
				className='h-[360px] w-full md:h-[480px]'
			>
				<MapInteractionSync isMobile={isMobile} />
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
				/>
				{visibleProvinces.map((province) => (
					<Marker
						key={province.id}
						position={[province.lat, province.lng]}
						icon={markerIcon}
					>
						<Popup>
							<strong>{province.name}</strong>
							<br />
							{formatSalesLabel(province.totalSales)}
						</Popup>
					</Marker>
				))}
			</MapContainer>
		</div>
	);
}
