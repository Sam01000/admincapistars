import { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  Calendar,
  Euro,
  Clock,
} from 'lucide-react';
import { api, type Stats } from '../api';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

function StatCard({ title, value, icon, trend, color }: StatCardProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend && (
            <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    totalEstablishments: 0,
    totalSalesReps: 0,
    activeClients: 0,
    activeEstablishments: 0,
    activeSalesReps: 0,
    pendingValidation: 0,
    monthlyRevenue: 0,
    totalBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Appeler l'API pour récupérer les statistiques
      const response = await api.get('/api/trpc/admin.getStats');
      if (response.data?.result?.data) {
        setStats(response.data.result.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      // Utiliser des données de démonstration en cas d'erreur
      setStats({
        totalClients: 0,
        totalEstablishments: 0,
        totalSalesReps: 0,
        activeClients: 0,
        activeEstablishments: 0,
        activeSalesReps: 0,
        pendingValidation: 0,
        monthlyRevenue: 0,
        totalBookings: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
        <p className="text-gray-500 mt-1">Vue d'ensemble de votre plateforme CAPISTARS</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Commerciaux"
          value={stats.totalSalesReps}
          icon={<Briefcase className="w-6 h-6 text-purple-600" />}
          color="bg-purple-100"
        />
        <StatCard
          title="Établissements"
          value={stats.totalEstablishments}
          icon={<Building2 className="w-6 h-6 text-blue-600" />}
          color="bg-blue-100"
        />
        <StatCard
          title="Clients"
          value={stats.totalClients}
          icon={<Users className="w-6 h-6 text-green-600" />}
          color="bg-green-100"
        />
        <StatCard
          title="Revenus Mensuels"
          value={`${stats.monthlyRevenue.toFixed(2)} €`}
          icon={<Euro className="w-6 h-6 text-amber-600" />}
          color="bg-amber-100"
        />
      </div>

      {/* Cartes d'état */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center gap-4">
            <Briefcase className="w-10 h-10 opacity-80" />
            <div>
              <p className="text-purple-100">Commerciaux Actifs</p>
              <p className="text-3xl font-bold">{stats.activeSalesReps}</p>
              <p className="text-purple-200 text-sm">sur {stats.totalSalesReps} inscrits</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center gap-4">
            <Building2 className="w-10 h-10 opacity-80" />
            <div>
              <p className="text-blue-100">Établissements Actifs</p>
              <p className="text-3xl font-bold">{stats.activeEstablishments}</p>
              <p className="text-blue-200 text-sm">sur {stats.totalEstablishments} inscrits</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-amber-500 to-orange-500 text-white">
          <div className="flex items-center gap-4">
            <Clock className="w-10 h-10 opacity-80" />
            <div>
              <p className="text-amber-100">En Attente de Validation</p>
              <p className="text-3xl font-bold">{stats.pendingValidation}</p>
              <p className="text-amber-200 text-sm">commerciaux et établissements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Activité Récente</h2>
        </div>
        <p className="text-gray-500 text-sm">
          Les dernières actions sur la plateforme apparaîtront ici.
        </p>
      </div>
    </div>
  );
}
