import { useState, useEffect } from 'react';
import {
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { api, type SalesRep } from '../api';

export default function Commerciaux() {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<SalesRep>>({});

  useEffect(() => {
    fetchSalesReps();
  }, []);

  const fetchSalesReps = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/trpc/salesReps.list');
      if (response.data?.result?.data) {
        setSalesReps(response.data.result.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: number, isActive: boolean) => {
    try {
      await api.post('/api/trpc/salesReps.toggleActive', {
        json: { id, isActive: !isActive },
      });
      setSalesReps(salesReps.map(rep => 
        rep.id === id ? { ...rep, isActive: !isActive } : rep
      ));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const deleteSalesRep = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce commercial ?')) return;
    
    try {
      await api.post('/api/trpc/salesReps.delete', {
        json: { id },
      });
      setSalesReps(salesReps.filter(rep => rep.id !== id));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const startEdit = (rep: SalesRep) => {
    setEditingId(rep.id);
    setEditForm({
      firstName: rep.firstName,
      lastName: rep.lastName,
      email: rep.email,
      phone: rep.phone,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    
    try {
      await api.post('/api/trpc/salesReps.update', {
        json: { id: editingId, ...editForm },
      });
      setSalesReps(salesReps.map(rep => 
        rep.id === editingId ? { ...rep, ...editForm } : rep
      ));
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const filteredReps = salesReps.filter(rep =>
    `${rep.firstName} ${rep.lastName} ${rep.email} ${rep.code}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commerciaux</h1>
          <p className="text-gray-500 mt-1">Gérez les commerciaux de la plateforme</p>
        </div>
        <button
          onClick={fetchSalesReps}
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
            placeholder="Rechercher par nom, email ou code..."
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
        ) : filteredReps.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Aucun commercial trouvé
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Territoires</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReps.map((rep) => (
                  <tr key={rep.id}>
                    <td>
                      <span className="font-mono font-bold text-blue-600">{rep.code}</span>
                    </td>
                    <td>
                      {editingId === rep.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editForm.firstName || ''}
                            onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                            className="input w-24"
                            placeholder="Prénom"
                          />
                          <input
                            type="text"
                            value={editForm.lastName || ''}
                            onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                            className="input w-24"
                            placeholder="Nom"
                          />
                        </div>
                      ) : (
                        <span className="font-medium">{rep.firstName} {rep.lastName}</span>
                      )}
                    </td>
                    <td>
                      {editingId === rep.id ? (
                        <input
                          type="email"
                          value={editForm.email || ''}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="input w-48"
                        />
                      ) : (
                        rep.email
                      )}
                    </td>
                    <td>
                      {editingId === rep.id ? (
                        <input
                          type="tel"
                          value={editForm.phone || ''}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="input w-32"
                        />
                      ) : (
                        rep.phone
                      )}
                    </td>
                    <td>
                      <span className="text-sm text-gray-600">
                        {(() => {
                          try {
                            const territories = JSON.parse(rep.territories);
                            return Array.isArray(territories) ? territories.join(', ') : rep.territories;
                          } catch {
                            return rep.territories;
                          }
                        })()}
                      </span>
                    </td>
                    <td>
                      {rep.isActive ? (
                        <span className="badge badge-success">Actif</span>
                      ) : (
                        <span className="badge badge-warning">En attente</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {editingId === rep.id ? (
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
                              onClick={() => toggleActive(rep.id, rep.isActive)}
                              className={`p-2 rounded-lg ${
                                rep.isActive
                                  ? 'text-amber-600 hover:bg-amber-50'
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={rep.isActive ? 'Désactiver' : 'Activer'}
                            >
                              {rep.isActive ? (
                                <XCircle className="w-5 h-5" />
                              ) : (
                                <CheckCircle className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => startEdit(rep)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Modifier"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => deleteSalesRep(rep.id)}
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
