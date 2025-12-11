import { useState } from 'react';
import {
  Settings,
  Link,
  Save,
  ExternalLink,
} from 'lucide-react';

export default function Parametres() {
  const [apiUrl, setApiUrl] = useState(
    localStorage.getItem('api_url') || 'https://3000-iiird9f9g20znnr8k9xh4-fbdbf5ef.manusvm.computer'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('api_url', apiUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500 mt-1">Configurez votre panneau d'administration</p>
      </div>

      {/* Configuration API */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Link className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Configuration API</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de l'API CAPISTARS
            </label>
            <input
              type="url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="input"
              placeholder="https://..."
            />
            <p className="text-sm text-gray-500 mt-2">
              L'URL de l'API principale de CAPISTARS
            </p>
          </div>

          <button
            onClick={handleSave}
            className="btn btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Enregistré !' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {/* Liens rapides */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <ExternalLink className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Liens Rapides</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="https://capistars.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <ExternalLink className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Site CAPISTARS</p>
              <p className="text-sm text-gray-500">Accéder au site principal</p>
            </div>
          </a>

          <a
            href="https://dashboard.stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <ExternalLink className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium">Stripe Dashboard</p>
              <p className="text-sm text-gray-500">Gérer les paiements</p>
            </div>
          </a>

          <a
            href="https://resend.com/emails"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <ExternalLink className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Resend</p>
              <p className="text-sm text-gray-500">Gérer les emails</p>
            </div>
          </a>

          <a
            href="https://console.cloud.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="p-2 bg-amber-100 rounded-lg">
              <ExternalLink className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium">Google Cloud</p>
              <p className="text-sm text-gray-500">Gérer Google Maps API</p>
            </div>
          </a>
        </div>
      </div>

      {/* Informations */}
      <div className="card mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Informations</h2>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Admin:</strong> admin@capistars.fr</p>
          <p><strong>Dernière mise à jour:</strong> {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    </div>
  );
}
