"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { DashboardStat } from "../types";

interface MetricsCardProps {
  stat: DashboardStat;
}

export function MetricsCard({ stat }: MetricsCardProps) {
  const IconComponent = stat.icon;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {stat.title}
        </CardTitle>
        <IconComponent className="h-5 w-5 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
        <div className="flex items-center space-x-2 mt-2">
          <Badge
            variant="secondary"
            className={`inline-flex items-center text-xs font-medium ${stat.changeType === 'increase'
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-red-100 text-red-800 border-red-200'
              }`}
          >
            {stat.changeType === 'increase' ?
              <TrendingUp className="h-3 w-3 mr-1" /> :
              <TrendingDown className="h-3 w-3 mr-1" />
            }
            {stat.change}
          </Badge>
          <span className="text-xs text-gray-500">vs mês anterior</span>
        </div>
        <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
      </CardContent>
    </Card>
  );
}

interface QuickStatsCardProps {
  stats: Array<{
    label: string;
    value: number;
    color: string;
  }>;
}

export function QuickStatsCard({ stats }: QuickStatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          📊 Estatísticas Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <span className="text-white font-bold text-lg">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
