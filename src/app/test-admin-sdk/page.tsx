import AdminSDKTester from "../../components/modules/AdminSDKTester";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            🧪 Página de Pruebas - Firebase Admin SDK
          </h1>

          <AdminSDKTester />

          <div className="mt-8 p-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">📖 Endpoints Disponibles</h2>
            <div className="space-y-2 text-sm">
              <div>
                <strong>GET</strong> <code>/api/admin/firebase-status</code> -
                Ver estado de configuración
              </div>
              <div>
                <strong>POST</strong> <code>/api/admin/firebase-status</code> -
                Probar conexión
              </div>
              <div>
                <strong>GET</strong> <code>/api/admin/update-phone</code> - Ver
                info de la API de actualización
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              💻 Verificación desde el Backend
            </h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              {`// Solo en API routes del servidor (no en componentes frontend)
import AdminAuthService from './lib/admin-auth';

// En /api/admin/firebase-status
if (AdminAuthService.isConfigured()) {
  console.log('✅ Admin SDK listo');
} else {
  console.log('❌ Admin SDK no configurado');
}

// Desde el frontend, usar fetch:
const response = await fetch('/api/admin/firebase-status');
const status = await response.json();
console.log('Admin SDK Status:', status.configured);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
