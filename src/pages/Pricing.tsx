/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Check, Info, ArrowRight } from "lucide-react";

export default function Pricing() {
  const buyerPlans = [
    {
      name: "Standard Buyer",
      price: "Free",
      description: "Perfect for individual buyers and small investors.",
      features: [
        "Browse all verified auctions",
        "Real-time bidding access",
        "Email & Push notifications",
        "Basic asset documentation",
        "AI Assistant support"
      ],
      cta: "Get Started",
      highlight: false
    },
    {
      name: "Premium Investor",
      price: "Rs. 4,999",
      period: "/year",
      description: "Advanced tools for serious asset acquirers.",
      features: [
        "Everything in Standard",
        "Early access to new listings",
        "Detailed inspection reports",
        "Priority customer support",
        "Advanced map search tools",
        "Bid history analytics"
      ],
      cta: "Go Premium",
      highlight: true
    }
  ];

  const institutionalPlans = [
    {
      name: "Starter",
      price: "Rs. 24,999",
      period: "/month",
      features: [
        "Up to 10 active listings",
        "Basic auction management",
        "Standard reporting",
        "Email support"
      ]
    },
    {
      name: "Professional",
      price: "Rs. 59,999",
      period: "/month",
      features: [
        "Unlimited active listings",
        "Advanced analytics dashboard",
        "Automated closing tools",
        "Dedicated account manager",
        "API access for integration"
      ],
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: [
        "Multi-branch management",
        "Custom legal workflows",
        "White-label options",
        "On-site training & support",
        "Custom API development"
      ]
    }
  ];

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Header */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Simple, Transparent Pricing</h1>
          <p className="text-lg text-neutral-500 leading-relaxed">
            Whether you're an individual buyer or a large financial institution, 
            we have a plan tailored to your needs.
          </p>
        </div>
      </section>

      {/* Buyer Plans */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest">For Bidders</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {buyerPlans.map((plan, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-10 rounded-[2.5rem] border ${
                  plan.highlight 
                    ? "bg-neutral-900 text-white border-neutral-800 shadow-2xl" 
                    : "bg-white text-neutral-900 border-neutral-200 shadow-sm"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-neutral-900 text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className={`text-sm mb-8 ${plan.highlight ? "text-neutral-400" : "text-neutral-500"}`}>
                  {plan.description}
                </p>
                
                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className={plan.highlight ? "text-neutral-400" : "text-neutral-500"}>{plan.period}</span>}
                </div>

                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        plan.highlight ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600"
                      }`}>
                        <Check size={12} />
                      </div>
                      <span className={plan.highlight ? "text-neutral-300" : "text-neutral-600"}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 rounded-2xl font-bold transition-all ${
                  plan.highlight 
                    ? "bg-emerald-500 text-neutral-900 hover:bg-emerald-400" 
                    : "bg-neutral-900 text-white hover:bg-neutral-800"
                }`}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Plans */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest">For Institutions</span>
            <h2 className="text-3xl font-bold tracking-tight mt-6">Enterprise-Grade Solutions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {institutionalPlans.map((plan, index) => (
              <div 
                key={index}
                className={`p-8 rounded-[2rem] border ${
                  plan.highlight 
                    ? "bg-neutral-50 border-neutral-200 shadow-lg scale-105 z-10" 
                    : "bg-white border-neutral-100"
                }`}
              >
                <h3 className="text-xl font-bold mb-6">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-neutral-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-neutral-600">
                      <Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                  plan.highlight 
                    ? "bg-neutral-900 text-white hover:bg-neutral-800" 
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}>
                  Contact Sales
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Box */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto bg-blue-50 border border-blue-100 rounded-[2rem] p-10 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
            <Info size={32} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-bold text-blue-900 mb-2">Custom Requirements?</h4>
            <p className="text-blue-700 text-sm leading-relaxed">
              We understand that every institution has unique workflows. Our team can build custom 
              integrations and legal compliance modules specifically for your organization.
            </p>
          </div>
          <button className="btn-primary bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
            Schedule a Demo
          </button>
        </div>
      </section>
    </div>
  );
}
