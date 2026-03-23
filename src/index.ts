import { config } from './config/config';
import app from './app';

// Punto de entrada HTTP de la aplicacion.
const PORT = config.PORT;
app.listen(PORT, () => {
});