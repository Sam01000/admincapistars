import { useState, useEffect } from 'react';
import {
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Star,
} from 'lucide-react';
import { api, type Client } from '../api';

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Client>>({});

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/trpc/admin.listClients');
      if (response.data?.result?.data) {
        setClients(response.data.result.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: number, isActive: boolean) => {
    try {
      await api.post('/api/trpc/admin.toggleClient', {
        json: { id, isActive: !isActive },
      });
      setClients(clients.map(client => 
        client.id === id ? { ...client, isActive: !isActive } : client
      ));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const deleteClient = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) return;
    
    try {
      await api.post('/api/trpc/admin.deleteClient', {
        json: { id },
      });
      setClients(clients.filter(client => client.id !== id));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const startEdit = (client: Client) => {
    setEditingId(client.id);
    setEditForm({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      capimilesPoints: client.capimilesPoints,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    
    try {
      await api.post('/api/trpc/admin.updateClient', {
        json: { id: editingId, ...editForm },
      });
      setClients(clients.map(client => 
        client.id === editingId ? { ...client, ...editForm } : client
      ));
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const filteredClients = clients.filter(client =>
    `${client.firstName} ${client.lastName} ${client.email || ''} ${client.phone || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 mt-1">Gérez les clients de la plateforme</p>
        </div>
        <button
          onClick={fetchClients}
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
            placeholder="Rechercher par nom, email, téléphone..."
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
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Aucun client trouvé
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>CAPIMILES</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      {editingId === client.id ? (
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
                        <span className="font-medium">{client.firstName} {client.lastName}</span>
                      )}
                    </td>
                    <td>
                      {editingId === client.id ? (
                        <input
                          type="email"
                          value={editForm.email || ''}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="input w-48"
                        />
                      ) : (
                        client.email || '-'
                      )}
                    </td>
                    <td>
                      {editingId === client.id ? (
                        <input
                          type="tel"
                          value={editForm.phone || ''}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="input w-32"
                        />
                      ) : (
                        client.phone || '-'
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500" />
                        {editingId === client.id ? (
                          <input
                            type="number"
                            value={editForm.capimilesPoints || 0}
                            onChange={(e) => setEditForm({ ...editForm, capimilesPoints: parseInt(e.target.value) || 0 })}
                            className="input w-24"
                          />
                        ) : (
                          <span className="font-medium text-amber-600">{client.capimilesPoints}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {client.isActive ? (
                        <span className="badge badge-success">Actif</span>
                      ) : (
                        <span className="badge badge-danger">Inactif</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {editingId === client.id ? (
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
                              onClick={() => toggleActive(client.id, client.isActive)}
                              className={`p-2 rounded-lg ${
                                client.isActive
                                  ? 'text-amber-600 hover:bg-amber-50'
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={client.isActive ? 'Désactiver' : 'Activer'}
                            >
                              {client.isActive ? (
                                <XCircle className="w-5 h-5" />
                              ) : (
                                <CheckCircle className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => startEdit(client)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Modifier"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => deleteClient(client.id)}
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
