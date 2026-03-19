/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  Search, 
  ShieldCheck, 
  Gavel, 
  CheckCircle2, 
  Building2, 
  BarChart3, 
  ArrowRight,
  UserPlus
} from "lucide-react";

export default function HowItWorks() {
  const buyerSteps = [
    {
      icon: <Search className="text-blue-600" size={24} />,
      title: "Browse Assets",
      description: "Explore a wide range of verified assets from top financial institutions across Nepal."
    },
    {
      icon: <ShieldCheck className="text-emerald-600" size={24} />,
      title: "Verify Details",
      description: "Review comprehensive documentation, inspection reports, and legal status before bidding."
    },
    {
      icon: <Gavel className="text-purple-600" size={24} />,
      title: "Place Your Bid",
      description: "Participate in real-time auctions. Set your maximum bid and let our system handle the rest."
    },
    {
      icon: <CheckCircle2 className="text-orange-600" size={24} />,
      title: "Win & Secure",
      description: "Once you win, our escrow service ensures a safe and transparent transfer of ownership."
    }
  ];

  const institutionSteps = [
    {
      icon: <Building2 className="text-neutral-900" size={24} />,
      title: "List Assets",
      description: "Easily upload asset details, images, and legal documents through our institutional portal."
    },
    {
      icon: <BarChart3 className="text-neutral-900" size={24} />,
      title: "Manage Auctions",
      description: "Monitor bidding activity in real-time with advanced analytics and reporting tools."
    },
    {
      icon: <CheckCircle2 className="text-neutral-900" size={24} />,
      title: "Close Fast",
      description: "Accelerate the recovery process with our automated closing and documentation workflows."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-neutral-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Transparent Auctions, <br />
              <span className="text-emerald-400">Simplified.</span>
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed">
              Bidzone bridges the gap between financial institutions and buyers, 
              creating a secure ecosystem for asset recovery and acquisition.
            </p>
          </motion.div>
        </div>
      </section>

      {/* For Bidders */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs">For Bidders</span>
            <h2 className="text-4xl font-bold tracking-tight mt-2">How to Buy on Bidzone</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {buyerSteps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-neutral-50 rounded-[2rem] border border-neutral-100 hover:border-neutral-200 transition-all"
              >
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Institutions */}
      <section className="py-24 px-4 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs">For Institutions</span>
              <h2 className="text-4xl font-bold tracking-tight mt-2 mb-6">Streamline Your Asset Recovery</h2>
              <p className="text-neutral-400 mb-10 leading-relaxed">
                Our platform provides financial institutions with the tools needed to manage 
                and liquidate assets efficiently, reducing recovery time and maximizing value.
              </p>
              
              <div className="space-y-8">
                {institutionSteps.map((step, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{step.title}</h4>
                      <p className="text-neutral-400 text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-12 btn-primary bg-emerald-500 text-neutral-900 hover:bg-emerald-400 px-8 py-4 flex items-center gap-2">
                Partner With Us <ArrowRight size={20} />
              </button>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-[3rem] border border-white/10 p-8">
                <div className="w-full h-full bg-neutral-800 rounded-[2rem] shadow-2xl overflow-hidden border border-white/5">
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500/50 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500/50 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500/50 rounded-full"></div>
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">Institutional Dashboard</div>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="h-8 w-1/2 bg-white/5 rounded-lg"></div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-24 bg-white/5 rounded-xl"></div>
                      <div className="h-24 bg-white/5 rounded-xl"></div>
                      <div className="h-24 bg-white/5 rounded-xl"></div>
                    </div>
                    <div className="h-40 w-full bg-white/5 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Still have questions?</h2>
          <p className="text-neutral-500 mb-10">
            Our support team and AI assistant are here to help you navigate the platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn-primary px-8 py-4">Read Full FAQ</button>
            <button className="btn-secondary px-8 py-4">Contact Support</button>
          </div>
        </div>
      </section>
    </div>
  );
}
