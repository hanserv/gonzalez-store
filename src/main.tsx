import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import './index.css';
import {GonzalezApp} from './GonzalezApp';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<GonzalezApp />
	</StrictMode>,
);
