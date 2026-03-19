/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { store } from "../store";
import { 
  Users, 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Search,
  MoreVertical,
  ArrowUpRight,
  Settings,
  BarChart3,
  Globe,
  Clock,
  DollarSign,
  FileText,
  Trash2,
  Save
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { motion } from "motion/react";
import { clsx } from "clsx";
import { UserStatus, AuctionStatus } from "../types";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, logsData, auctionsData, settingsData] = await Promise.all([
        store.getUsers(),
        store.getAuditLogs(),
        store.getAuctions(),
        store.getSettings()
      ]);
      setUsers(usersData);
      setFilteredUsers(usersData);
      setAuditLogs(logsData);
      setAuctions(auctionsData);
      setSettings(settingsData);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredUsers(users.filter(u => 
        u.displayName.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q) ||
        (u.institutionName && u.institutionName.toLowerCase().includes(q))
      ));
    }
  }, [searchQuery, users]);

  useEffect(() => {
    fetchData();

    // Listen for store updates
    const handleUpdate = () => fetchData();
    window.addEventListener('store-updated', handleUpdate);
    return () => window.removeEventListener('store-updated', handleUpdate);
  }, []);

  const handleUpdateUserStatus = async (uid: string, status: UserStatus) => {
    await store.updateUserStatus(uid, status);
  };

  const handleModerateAuction = async (id: string, status: AuctionStatus) => {
    await store.moderateAuction(id, status);
  };

  const handleUpdateSettings = async (data: any) => {
    await store.updateSettings(data);
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const pendingAuctions = auctions.filter(a => a.status === AuctionStatus.PENDING);

  const stats = [
    { label: "Total Users", value: users.length.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Auctions", value: auctions.filter(a => a.status === AuctionStatus.ACTIVE).length.toString(), icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pending Reviews", value: pendingAuctions.length.toString(), icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "System Status", value: "Healthy", icon: Shield, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];
  
  const assetTypeData = [
    { name: 'Real Estate', value: auctions.filter(a => a.assetType === 'Real Estate').length },
    { name: 'Vehicle', value: auctions.filter(a => a.assetType === 'Vehicle').length },
    { name: 'Machinery', value: auctions.filter(a => a.assetType === 'Machinery').length },
    { name: 'Financial', value: auctions.filter(a => a.assetType === 'Financial Asset').length },
  ];

  const growthData = [
    { name: 'Jan', users: 10, auctions: 5 },
    { name: 'Feb', users: 25, auctions: 12 },
    { name: 'Mar', users: 45, auctions: 28 },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Admin Console</h1>
          <p className="text-neutral-500">Manage platform users, moderate content, and monitor system activity.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-[2rem] border border-neutral-200 shadow-sm"
            >
              <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest block mb-1">{stat.label}</span>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {["overview", "users", "moderation", "audit-logs", "settings", "reports"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                activeTab === tab 
                  ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/20" 
                  : "bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-900"
              )}
            >
              {tab.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white border border-neutral-200 rounded-[2.5rem] shadow-sm overflow-hidden">
          {activeTab === "overview" && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Platform Monitoring</h2>
                <span className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                  System Live
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Recent Activity</h3>
                  <div className="space-y-4">
                    {auditLogs.slice(0, 5).map(log => (
                      <div key={log.id} className="flex items-start gap-4 p-4 bg-neutral-50 rounded-2xl">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-neutral-500 shadow-sm">
                          <Activity size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{log.action}</p>
                          <p className="text-xs text-neutral-500">{log.details}</p>
                          <p className="text-[10px] text-neutral-400 mt-1">{new Date(log.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">System Health</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-neutral-100 rounded-2xl">
                      <p className="text-xs text-neutral-400 font-bold mb-1">CPU Usage</p>
                      <p className="text-xl font-bold">12%</p>
                    </div>
                    <div className="p-4 border border-neutral-100 rounded-2xl">
                      <p className="text-xs text-neutral-400 font-bold mb-1">Memory</p>
                      <p className="text-xl font-bold">2.4GB</p>
                    </div>
                    <div className="p-4 border border-neutral-100 rounded-2xl">
                      <p className="text-xs text-neutral-400 font-bold mb-1">Uptime</p>
                      <p className="text-xl font-bold">99.9%</p>
                    </div>
                    <div className="p-4 border border-neutral-100 rounded-2xl">
                      <p className="text-xs text-neutral-400 font-bold mb-1">API Latency</p>
                      <p className="text-xl font-bold">45ms</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <div className="p-8 border-b border-neutral-100 flex justify-between items-center">
                <h2 className="text-xl font-bold">Account Management</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-neutral-50 text-[10px] text-neutral-400 uppercase font-bold tracking-widest">
                      <th className="px-8 py-4">User</th>
                      <th className="px-8 py-4">Role</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Joined</th>
                      <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.uid} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-neutral-100 overflow-hidden">
                              <img src={u.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                              <p className="font-bold text-sm">{u.displayName}</p>
                              <p className="text-xs text-neutral-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-sm font-medium">{u.role}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className={clsx(
                            "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full",
                            u.status === UserStatus.ACTIVE ? "bg-emerald-50 text-emerald-600" : 
                            u.status === UserStatus.SUSPENDED ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
                          )}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-sm text-neutral-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            {u.status === UserStatus.ACTIVE ? (
                              <button 
                                onClick={() => handleUpdateUserStatus(u.uid, UserStatus.SUSPENDED)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Suspend Account"
                              >
                                <XCircle size={18} />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleUpdateUserStatus(u.uid, UserStatus.ACTIVE)}
                                className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Activate Account"
                              >
                                <CheckCircle2 size={18} />
                              </button>
                            )}
                            <button className="p-2 text-neutral-400 hover:text-neutral-900">
                              <MoreVertical size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "moderation" && (
            <div>
              <div className="p-8 border-b border-neutral-100">
                <h2 className="text-xl font-bold">Content Moderation</h2>
                <p className="text-sm text-neutral-500 mt-1">Review and approve new auction listings before they go live.</p>
              </div>
              <div className="divide-y divide-neutral-100">
                {pendingAuctions.length > 0 ? pendingAuctions.map((auction) => (
                  <div key={auction.id} className="p-8 flex items-start gap-6 hover:bg-neutral-50 transition-colors">
                    <div className="w-32 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-neutral-200">
                      <img src={auction.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-lg">{auction.title}</h4>
                          <p className="text-sm text-neutral-500 line-clamp-1">{auction.description}</p>
                        </div>
                        <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                          Pending Review
                        </span>
                      </div>
                      <div className="flex gap-6 text-xs text-neutral-400 mb-4">
                        <span className="flex items-center gap-1"><Users size={12} /> {auction.institutionName}</span>
                        <span className="flex items-center gap-1"><DollarSign size={12} /> NPR {auction.basePrice.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> Ends {new Date(auction.endTime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleModerateAuction(auction.id, AuctionStatus.ACTIVE)}
                          className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2"
                        >
                          <CheckCircle2 size={14} /> Approve Listing
                        </button>
                        <button 
                          onClick={() => handleModerateAuction(auction.id, AuctionStatus.CANCELLED)}
                          className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-xl hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">All Clear!</h3>
                    <p className="text-neutral-500 max-w-md mx-auto">There are no pending listings that require moderation at this time.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "audit-logs" && (
            <div>
              <div className="p-8 border-b border-neutral-100 flex justify-between items-center">
                <h2 className="text-xl font-bold">Audit Logs & Monitoring</h2>
                <button className="text-xs font-bold text-neutral-400 hover:text-neutral-900 flex items-center gap-1">
                  <FileText size={14} /> Export Logs
                </button>
              </div>
              <div className="divide-y divide-neutral-100">
                {auditLogs.length > 0 ? auditLogs.map((log) => (
                  <div key={log.id} className="p-6 hover:bg-neutral-50 transition-colors flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500 flex-shrink-0">
                      <Activity size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm">{log.action}</h4>
                        <span className="text-xs text-neutral-400">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-neutral-500">{log.details}</p>
                    </div>
                    <button className="text-neutral-400 hover:text-neutral-900">
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                )) : (
                  <div className="p-12 text-center text-neutral-400">
                    No audit logs available.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="p-8">
              <h2 className="text-xl font-bold mb-8">System Configuration</h2>
              
              <div className="space-y-12">
                <section>
                  <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6">Asset Categories</h3>
                  <div className="flex flex-wrap gap-3">
                    {settings.categories.map(cat => (
                      <span key={cat} className="px-4 py-2 bg-neutral-100 rounded-xl text-sm font-medium flex items-center gap-2">
                        {cat}
                        <button className="text-neutral-400 hover:text-red-500"><XCircle size={14} /></button>
                      </span>
                    ))}
                    <button className="px-4 py-2 border border-dashed border-neutral-300 rounded-xl text-sm text-neutral-400 hover:border-neutral-900 hover:text-neutral-900 transition-all">
                      + Add Category
                    </button>
                  </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6">General Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Default Currency</label>
                        <select className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm">
                          {settings.currencies.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">System Timezone</label>
                        <select className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm">
                          {settings.timeZones.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6">Notification Templates</h3>
                    <div className="space-y-4">
                      {Object.entries(settings.notificationTemplates).map(([key, val]) => (
                        <div key={key}>
                          <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">{key}</label>
                          <textarea 
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm h-20 resize-none"
                            defaultValue={val}
                          ></textarea>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <div className="pt-8 border-t border-neutral-100 flex justify-end">
                  <button 
                    onClick={() => handleUpdateSettings(settings)}
                    className="px-8 py-3 bg-neutral-900 text-white font-bold rounded-2xl shadow-lg shadow-neutral-900/20 flex items-center gap-2"
                  >
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Reporting & Insights</h2>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-neutral-100 rounded-xl text-xs font-bold">Last 30 Days</button>
                  <button className="px-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold">Export PDF</button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-neutral-50 p-6 rounded-[2rem]">
                  <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6">Asset Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={assetTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {assetTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {assetTypeData.map((item, idx) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                        <span className="text-xs font-medium">{item.name} ({item.value})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-neutral-50 p-6 rounded-[2rem]">
                  <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6">Platform Growth</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={growthData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="auctions" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-xs font-medium">New Users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-xs font-medium">New Auctions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
