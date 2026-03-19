/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  Target, 
  Users, 
  ShieldCheck, 
  Globe, 
  Award, 
  Heart,
  Mail,
  MapPin,
  Phone
} from "lucide-react";

export default function About() {
  const values = [
    {
      icon: <ShieldCheck className="text-emerald-600" size={24} />,
      title: "Transparency",
      description: "We believe in open data and clear processes for every auction listing."
    },
    {
      icon: <Target className="text-blue-600" size={24} />,
      title: "Efficiency",
      description: "Reducing the time and friction in the asset recovery lifecycle."
    },
    {
      icon: <Users className="text-purple-600" size={24} />,
      title: "Inclusivity",
      description: "Making institutional assets accessible to individual buyers across the country."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="py-24 px-4 bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs">Our Mission</span>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mt-6 mb-8 max-w-4xl mx-auto">
              Democratizing Access to <br />
              <span className="text-neutral-400 italic font-serif">Institutional Assets.</span>
            </h1>
            <p className="text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
              Bidzone was founded with a single goal: to create a modern, transparent, 
              and efficient marketplace for financial asset auctions in Nepal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-square bg-neutral-100 rounded-[3rem] overflow-hidden">
              <img 
                src="https://picsum.photos/seed/office/800/800" 
                alt="Our Office" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500 rounded-[2rem] p-10 text-white hidden md:block">
              <Award size={48} className="mb-4" />
              <h4 className="text-2xl font-bold">#1</h4>
              <p className="text-emerald-100 text-sm">Auction Aggregator in Nepal</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-6">The Bidzone Story</h2>
            <div className="space-y-6 text-neutral-600 leading-relaxed">
              <p>
                In 2024, we noticed a significant gap in how financial institutions liquidated recovered assets. 
                The process was fragmented, often manual, and lacked transparency for potential buyers.
              </p>
              <p>
                We built Bidzone to solve this. By aggregating listings from multiple banks and financial 
                institutions into a single, intelligent platform, we've made it easier for buyers to find 
                opportunities and for institutions to recover value quickly.
              </p>
              <p>
                Today, Bidzone is the leading platform for asset auctions, serving thousands of users 
                and partnering with the country's most respected financial organizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-neutral-400">The principles that guide everything we build.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto bg-neutral-50 rounded-[3rem] p-12 md:p-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-neutral-500 mb-10">
                Have questions about our platform or interested in a partnership? 
                Our team is ready to assist you.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-900">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest block">Email</span>
                    <span className="font-bold">contact@bidzone.com.np</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-900">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest block">Phone</span>
                    <span className="font-bold">+977 1-4XXXXXX</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-900">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest block">Office</span>
                    <span className="font-bold">Kathmandu, Nepal</span>
                  </div>
                </div>
              </div>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="Your Name" className="input-field" />
                <input type="email" placeholder="Email Address" className="input-field" />
              </div>
              <input type="text" placeholder="Subject" className="input-field" />
              <textarea placeholder="Your Message" rows={5} className="input-field resize-none"></textarea>
              <button className="btn-primary w-full py-4">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
