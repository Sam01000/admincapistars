import { useState, useEffect } from 'react';
import {
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  MapPin,
} from 'lucide-react';
import { api, type Establishment } from '../api';

export default function Etablissements() {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Establishment>>({});

  useEffect(() => {
    fetchEstablishments();
  }, []);

  const fetchEstablishments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/trpc/admin.listEstablishments');
      if (response.data?.result?.data) {
        setEstablishments(response.data.result.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: number, isActive: boolean) => {
    try {
      await api.post('/api/trpc/admin.toggleEstablishment', {
        json: { id, isActive: !isActive },
      });
      setEstablishments(establishments.map(est => 
        est.id === id ? { ...est, isActive: !isActive } : est
      ));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const deleteEstablishment = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet établissement ?')) return;
    
    try {
      await api.post('/api/trpc/admin.deleteEstablishment', {
        json: { id },
      });
      setEstablishments(establishments.filter(est => est.id !== id));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const startEdit = (est: Establishment) => {
    setEditingId(est.id);
    setEditForm({
      name: est.name,
      email: est.email,
      phone: est.phone,
      address: est.address,
      city: est.city,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    
    try {
      await api.post('/api/trpc/admin.updateEstablishment', {
        json: { id: editingId, ...editForm },
      });
      setEstablishments(establishments.map(est => 
        est.id === editingId ? { ...est, ...editForm } : est
      ));
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const filteredEstablishments = establishments.filter(est =>
    `${est.name} ${est.email} ${est.city} ${est.postalCode}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Établissements</h1>
          <p className="text-gray-500 mt-1">Gérez les salons de beauté de la plateforme</p>
        </div>
        <button
          onClick={fetchEstablishments}
          className="btn btn-secondary flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Tableau */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredEstablishments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Aucun établissement trouvé
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Adresse</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEstablishments.map((est) => (
                  <tr key={est.id}>
                    <td>
                      {editingId === est.id ? (
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="input w-48"
                        />
                      ) : (
                        <span className="font-medium">{est.name}</span>
                      )}
                    </td>
                    <td>
                      {editingId === est.id ? (
                        <input
                          type="email"
                          value={editForm.email || ''}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="input w-48"
                        />
                      ) : (
                        est.email
                      )}
                    </td>
                    <td>
                      {editingId === est.id ? (
                        <input
                          type="tel"
                          value={editForm.phone || ''}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="input w-32"
                        />
                      ) : (
                        est.phone
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {editingId === est.id ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editForm.city || ''}
                              onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                              className="input w-32"
                              placeholder="Ville"
                            />
                          </div>
                        ) : (
                          <span>{est.city} ({est.postalCode})</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {est.isActive ? (
                        <span className="badge badge-success">Actif</span>
                      ) : (
                        <span className="badge badge-warning">En attente</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {editingId === est.id ? (
                          <>
                            <button
                              onClick={saveEdit}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Enregistrer"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => { setEditingId(null); setEditForm({}); }}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                              title="Annuler"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => toggleActive(est.id, est.isActive)}
                              className={`p-2 rounded-lg ${
                                est.isActive
                                  ? 'text-amber-600 hover:bg-amber-50'
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={est.isActive ? 'Désactiver' : 'Activer'}
                            >
                              {est.isActive ? (
                                <XCircle className="w-5 h-5" />
                              ) : (
                                <CheckCircle className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => startEdit(est)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Modifier"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => deleteEstablishment(est.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Supprimer"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
