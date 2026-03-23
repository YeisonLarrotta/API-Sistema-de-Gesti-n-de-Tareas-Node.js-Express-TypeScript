import { config } from './config/config';
import app from './app';

// Iniciamos el servidor usando el puerto definido en nuestro Singleton de Configuración
const PORT = config.PORT;
app.listen(PORT, () => {
});