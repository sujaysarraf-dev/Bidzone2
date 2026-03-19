/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { store } from "../store";
import { 
  Plus, 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  MoreVertical,
  Search,
  LogOut,
  Upload,
  AlertCircle,
  BarChart3,
  MessageSquare,
  ShieldCheck,
  Trash2,
  Edit2,
  Download,
  Filter
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { AuctionListing, AuctionStatus, UserRole } from "../types";
import { clsx } from "clsx";
import { toast } from "react-hot-toast";

export default function InstitutionDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [auctions, setAuctions] = useState<AuctionListing[]>([]);
  const [loading, setLoading] = useState(true);
  const user = store.getUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      try {
        const data = await store.getAuctions();
        setAuctions(data);
      } catch (error) {
        console.error("Failed to fetch auctions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();

    // Listen for store updates
    const handleUpdate = () => fetchAuctions();
    window.addEventListener('store-updated', handleUpdate);
    return () => window.removeEventListener('store-updated', handleUpdate);
  }, []);
  
  // Mock verification status
  const isVerified = user?.isVerified ?? true;

  const myAuctions = auctions.filter(a => a.institutionName === user?.displayName);

  const stats = [
    { label: "Active Auctions", value: myAuctions.filter(a => a.status === AuctionStatus.ACTIVE).length.toString(), icon: <Clock size={20} />, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Recovery", value: "Rs. 4.2M", icon: <TrendingUp size={20} />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Bidders", value: "156", icon: <Users size={20} />, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Success Rate", value: "84%", icon: <CheckCircle2 size={20} />, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const chartData = [
    { name: 'Mon', bids: 12, recovery: 400 },
    { name: 'Tue', bids: 19, recovery: 300 },
    { name: 'Wed', bids: 15, recovery: 600 },
    { name: 'Thu', bids: 22, recovery: 800 },
    { name: 'Fri', bids: 30, recovery: 500 },
    { name: 'Sat', bids: 25, recovery: 900 },
    { name: 'Sun', bids: 18, recovery: 700 },
  ];

  const handleSignOut = async () => {
    await store.logout();
    navigate("/login");
  };

  const handleDeleteAuction = async (id: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      try {
        await store.deleteAuction(id);
        toast.success("Listing deleted successfully");
      } catch (error) {
        toast.error("Failed to delete listing");
      }
    }
  };

  const handleBulkImport = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`Processing ${file.name}...`);
      // Mock processing
      setTimeout(() => {
        toast.success("Bulk import successful! 5 new listings added.");
      }, 2000);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-neutral-100">
          <h2 className="text-xl font-bold tracking-tight">Institution Hub</h2>
          <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mt-1">NICA Asia Bank</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "listings", label: "My Listings", icon: FileText },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
            { id: "inquiries", label: "Inquiries", icon: MessageSquare },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={clsx(
                "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeTab === item.id 
                  ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/20" 
                  : "text-neutral-500 hover:bg-neutral-100"
              )}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-100">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl text-sm font-bold transition-all"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12">
        {!isVerified && (
          <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center gap-4 text-orange-800">
            <AlertCircle className="flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold">Account Verification Pending</p>
              <p className="text-sm">Your institution is currently being verified. You will be able to post auctions once approved.</p>
            </div>
          </div>
        )}

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight capitalize">{activeTab} Overview</h1>
            <p className="text-neutral-500 mt-1 flex items-center gap-2">
              Welcome back, {user?.displayName} Team.
              <button 
                onClick={async () => {
                  await store.login(user?.email || "demo@bidzone.com", UserRole.BUYER);
                  window.location.reload();
                }}
                className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full hover:bg-emerald-100 transition-colors"
              >
                Demo: Switch to Buyer View
              </button>
            </p>
          </div>
          <div className="flex gap-3">
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleBulkImport}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-white border border-neutral-200 rounded-2xl text-sm font-bold hover:border-neutral-900 transition-all flex items-center gap-2"
            >
              <Upload size={18} /> Bulk Import
            </button>
            <button 
              onClick={() => navigate("/create-auction")}
              disabled={!isVerified}
              className={clsx(
                "btn-primary flex items-center gap-2 py-3 px-6 shadow-xl shadow-emerald-500/20",
                !isVerified && "opacity-50 cursor-not-allowed"
              )}
            >
              <Plus size={20} /> Create New Listing
            </button>
          </div>
        </header>

        {activeTab === "dashboard" && (
          <>
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
                    {stat.icon}
                  </div>
                  <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest block mb-1">{stat.label}</span>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </motion.div>
              ))}
            </div>

            {/* Recent Listings */}
            <div className="bg-white border border-neutral-200 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="p-8 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-bold">Recent Listings</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search listings..." 
                    className="bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all"
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-neutral-50 text-[10px] text-neutral-400 uppercase font-bold tracking-widest">
                      <th className="px-8 py-4">Asset Details</th>
                      <th className="px-8 py-4">Current Bid</th>
                      <th className="px-8 py-4">Bids</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {myAuctions.slice(0, 5).map((auction) => (
                      <tr key={auction.id} className="hover:bg-neutral-50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                              <img src={auction.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm">{auction.title}</h4>
                              <p className="text-xs text-neutral-400">{auction.assetType}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="font-bold text-sm">Rs. {auction.currentBid.toLocaleString()}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-sm font-medium">{auction.bidCount}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className={clsx(
                            "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full",
                            auction.status === AuctionStatus.ACTIVE ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-500"
                          )}>
                            {auction.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-6 bg-neutral-50 border-t border-neutral-100 text-center">
                <button 
                  onClick={() => setActiveTab("listings")}
                  className="text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  View All Listings
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "listings" && (
          <div className="bg-white border border-neutral-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-neutral-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">My Auction Listings</h2>
              <div className="flex gap-2">
                <button className="p-2 border border-neutral-200 rounded-xl hover:border-neutral-900 transition-all">
                  <Filter size={18} />
                </button>
                <button className="p-2 border border-neutral-200 rounded-xl hover:border-neutral-900 transition-all">
                  <Download size={18} />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neutral-50 text-[10px] text-neutral-400 uppercase font-bold tracking-widest">
                    <th className="px-8 py-4">Asset</th>
                    <th className="px-8 py-4">Base Price</th>
                    <th className="px-8 py-4">Current Bid</th>
                    <th className="px-8 py-4">Ends</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {myAuctions.map((auction) => (
                    <tr key={auction.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={auction.images[0]} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                          <span className="font-bold text-sm">{auction.title}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm">Rs. {auction.basePrice.toLocaleString()}</td>
                      <td className="px-8 py-6 font-bold text-sm">Rs. {auction.currentBid.toLocaleString()}</td>
                      <td className="px-8 py-6 text-sm">{new Date(auction.endTime).toLocaleDateString()}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteAuction(auction.id)}
                            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
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

        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-200 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Bidding Activity</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorBids" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="bids" stroke="#10b981" fillOpacity={1} fill="url(#colorBids)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-200 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Recovery Trends (NPR '000)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="recovery" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "inquiries" && (
          <div className="bg-white border border-neutral-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-neutral-100">
              <h2 className="text-xl font-bold">Bidder Inquiries</h2>
            </div>
            <div className="divide-y divide-neutral-100">
              {[
                { id: 1, user: "Sujan K.", subject: "Valuation Report Query", time: "2h ago", status: "New" },
                { id: 2, user: "Anita M.", subject: "Site Visit Request", time: "5h ago", status: "Pending" },
                { id: 3, user: "Ramesh P.", subject: "Payment Terms", time: "1d ago", status: "Resolved" },
              ].map((item) => (
                <div key={item.id} className="p-6 hover:bg-neutral-50 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-500">
                      {item.user[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{item.subject}</p>
                      <p className="text-xs text-neutral-400">From {item.user} • {item.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={clsx(
                      "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full",
                      item.status === "New" ? "bg-blue-50 text-blue-600" : 
                      item.status === "Pending" ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-600"
                    )}>
                      {item.status}
                    </span>
                    <button className="p-2 text-neutral-300 group-hover:text-neutral-900 transition-all">
                      <MessageSquare size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-2xl bg-white p-8 rounded-[2.5rem] border border-neutral-200 shadow-sm">
            <h2 className="text-xl font-bold mb-8">Institution Settings</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-emerald-600" />
                  <div>
                    <p className="font-bold text-sm text-emerald-900">Verified Institution</p>
                    <p className="text-xs text-emerald-700">Your account is fully verified and active.</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">ID: INST-9928</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Institution Name</label>
                  <input type="text" defaultValue={user?.displayName} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Contact Email</label>
                  <input type="email" defaultValue={user?.email} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm" />
                </div>
                <div className="pt-4">
                  <button className="btn-primary w-full py-3">Update Profile</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
