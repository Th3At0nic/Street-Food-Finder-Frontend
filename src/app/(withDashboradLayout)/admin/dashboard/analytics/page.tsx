// app/admin/analytics/page.tsx
'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Users, Utensils, Star, DollarSign, TrendingUp, TrendingDown } from "lucide-react";



const monthlyUserData = [
  { month: 'Jan', users: 400 },
  { month: 'Feb', users: 700 },
  { month: 'Mar', users: 300 },
  { month: 'Apr', users: 900 },
  { month: 'May', users: 600 },
  { month: 'Jun', users: 800 },
];

const categoryDistributionData = [
  { name: 'Snacks', value: 45 },
  { name: 'Meals', value: 30 },
  { name: 'Sweets', value: 25 },
];

const COLORS = ['#FF6B35', '#2D3047', '#1B998B'];

const stats = [
  { 
    title: "Total Users", 
    value: "2,458", 
    icon: Users,
    change: +15.2,
    changeType: 'positive'
  },
  { 
    title: "Premium Posts", 
    value: "156", 
    icon: Star,
    change: +8.4,
    changeType: 'positive'
  },
  { 
    title: "Total Posts", 
    value: "1,234", 
    icon: Utensils,
    change: -3.1,
    changeType: 'negative'
  },
  { 
    title: "Revenue", 
    value: "$4,567", 
    icon: DollarSign,
    change: +22.6,
    changeType: 'positive'
  }
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">System Analytics</h2>
        <p className="text-sm text-gray-500">Key metrics and platform statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs mt-1">
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}% (30d)
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyUserData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="users" 
                  fill="#FF6B35"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryDistributionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  formatter={(value, entry, index) => (
                    <span className="text-sm">
                      {categoryDistributionData[index].name}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <span className="text-2xl font-bold">143</span>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <span className="text-2xl font-bold">4.6</span>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">New Signups</CardTitle>
            <span className="text-2xl font-bold">84</span>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}