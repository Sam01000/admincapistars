import { useState, useEffect } from 'react';
import {
  Search,
  RefreshCw,
  Clock,
  User,
  Building2,
  Briefcase,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
} from 'lucide-react';
import { api, type ActionLog } from '../api';

const actionIcons: Record<string, React.ReactNode> = {
  activate: <CheckCircle className="w-5 h-5 text-green-600" />,
  deactivate: <XCircle className="w-5 h-5 text-amber-600" />,
  delete: <Trash2 className="w-5 h-5 text-red-600" />,
  update: <Edit className="w-5 h-5 text-blue-600" />,
};

const entityIcons: Record<string, React.ReactNode> = {
  salesRep: <Briefcase className="w-4 h-4" />,
  establishment: <Building2 className="w-4 h-4" />,
  client: <User className="w-4 h-4" />,
};

export default function Historique() {
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/trpc/admin.getActionLogs');
      if (response.data?.result?.data) {
        setLogs(response.data.result.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
      // Données de démonstration
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'activate': return 'Activation';
      case 'deactivate': return 'Désactivation';
      case 'delete': return 'Suppression';
      case 'update': return 'Modification';
      default: return action;
    }
  };

  const getEntityLabel = (entityType: string) => {
    switch (entityType) {
      case 'salesRep': return 'Commercial';
      case 'establishment': return 'Établissement';
      case 'client': return 'Client';
      default: return entityType;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = `${log.entityName} ${log.performedBy} ${log.action}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || log.entityType === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historique des Actions</h1>
          <p className="text-gray-500 mt-1">Suivez toutes les actions effectuées sur la plateforme</p>
        </div>
        <button
          onClick={fetchLogs}
          className="btn btn-secondary flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      {/* Filtres */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input w-full sm:w-48"
          >
            <option value="all">Tous les types</option>
            <option value="salesRep">Commerciaux</option>
            <option value="establishment">Établissements</option>
            <option value="client">Clients</option>
          </select>
        </div>
      </div>

      {/* Liste des actions */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune action enregistrée</p>
            <p className="text-sm mt-2">Les actions apparaîtront ici au fur et à mesure</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">
                  {actionIcons[log.action] || <Edit className="w-5 h-5 text-gray-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{getActionLabel(log.action)}</span>
                    <span className="text-gray-400">•</span>
                    <span className="flex items-center gap-1 text-gray-600">
                      {entityIcons[log.entityType]}
                      {getEntityLabel(log.entityType)}
                    </span>
                  </div>
                  <p className="text-gray-900 mt-1">{log.entityName}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {log.performedBy}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDate(log.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
