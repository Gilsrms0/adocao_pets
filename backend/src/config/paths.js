// src/config/paths.js

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // /backend/src/config

// Subimos dois níveis de /src/config para /backend/
export const ROOT_DIR = path.join(__dirname, '..', '..');

// O diretório de UPLOADS no backend/
export const UPLOADS_PATH = path.join(ROOT_DIR, 'uploads');