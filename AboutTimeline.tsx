import React from "react";
import { motion } from "motion/react";
import { 
  GraduationCap, 
  Leaf, 
  Lightbulb, 
  BookOpen, 
  Wallet, 
  Globe,
  Calendar,
  ArrowRight
} from "lucide-react";
import { cn } from "../lib/utils";

interface AboutTimelineProps {
  lang: "en" | "om";
}

interface TimelineEvent {
  year: string;
  icon: React.ComponentType<any>;
  titleEn: string;
  titleOm: string;
  descEn: string;
  descOm: string;
  color: string;
  badgeEn: string;
  badgeOm: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: "2006",
    icon: GraduationCap,
    titleEn: "Academic Foundations & IT BSc",
    titleOm: "Hundeeffama Barnootaa fi IT BSc",
    descEn: "Jemal Fano Haji pursues his passion for computer systems, graduating with an IT BSc degree, laying the vital engineering foundation for systemic digital development in Oromia.",
    descOm: "Jemaal Faanoo Haajii barnoota teeknoolojii odeeffannoo irratti xiyyeeffachuun digrii jalqabaa (BSc) fudhate, kunis hundee ogummaa teeknoolojii Itoophiyaatti uumuuf ta'e.",
    color: "from-blue-500 to-indigo-600",
    badgeEn: "Graduation",
    badgeOm: "Eebba",
  },
  {
    year: "2012",
    icon: Leaf,
    titleEn: "Agri-Tech & Rural Integration",
    titleOm: "Qonna Ammayyaafi Qorannoo Teeknoolojii",
    descEn: "Began researching the integration of automated software tools with traditional crop cycles, focusing on sustainable water management solutions in West Arsi.",
    descOm: "West Arsi, Oromiyaa keessatti marsaa qonna ammayyaa fi teeknoolojii bishaanii walitti makuun qo'annoo fi qorannoo qonna waaraa jalqabe.",
    color: "from-emerald-500 to-teal-600",
    badgeEn: "Research Phase",
    badgeOm: "Qo'annoo Qonnaa",
  },
  {
    year: "2018",
    icon: Lightbulb,
    titleEn: "Dure Boru Platform Inception",
    titleOm: "Giddu-gala Dure Boru Jalqabuu",
    descEn: "Launches the first core concept of Dure Boru, establishing an offline and online digital center to compile agriculture templates and digital research assets.",
    descOm: "Dure Boru yaada bu'uuraatiin jalqabame, kunis giddu-gala dijitaalaa odeeffannoo fi dambalii qonnaa walitti qabu uumuuf kaayyeffate.",
    color: "from-amber-500 to-orange-600",
    badgeEn: "Official Launch",
    badgeOm: "Hundeeffama",
  },
  {
    year: "2021",
    icon: BookOpen,
    titleEn: "Digital Academy Launch",
    titleOm: "Akadaamii Dijitaalaa Banuu",
    descEn: "Introduces premium visual training packages, professional curriculum templates, and software training resources targeting East African youth, farmers, and tech creators.",
    descOm: "Leenjii vidiyoo, dambaliiwwan CV, fi meeshaalee teeknoolojii adda addaa dhaloota haaraa dandeettii dijitaalaa qopheessuuf dhiyeessuu jalqabe.",
    color: "from-purple-500 to-pink-600",
    badgeEn: "Education",
    badgeOm: "Akadaamii Barnootaa",
  },
  {
    year: "2024",
    icon: Wallet,
    titleEn: "Dure Pay Wallet Ecosystem",
    titleOm: "Tajaajila Dure Pay Babal'isuu",
    descEn: "Integrates direct, high-speed digital peer-to-peer simulated transactions supporting Telebirr, CBE Birr, and digital product licensing, securing safe direct-creator revenue.",
    descOm: "Siriis kaffaltii Telebirr fi CBE Birr walitti makuun gurgurtaa meeshaalee dijitaalaa fi daldala riqicha hin qabne dhibbeentaa 100 amansiisaa uume.",
    color: "from-indigo-500 to-blue-600",
    badgeEn: "FinTech Integration",
    badgeOm: "Siriis Kaffaltii",
  },
  {
    year: "2026",
    icon: Globe,
    titleEn: "Global Storefront Expansion",
    titleOm: "Gabaa Addunyaa fi Babal'ina",
    descEn: "Expands into a high-speed, dual-language digital storefront that synchronizes agricultural orders, premium templates, and digital courses in real-time.",
    descOm: "Giddu-gala gabaa afaan lamaan (Afan Oromo & English) qophaa'ee fi odeeffannoo meeshaalee qonnaa gabaa addunyaa waliin wal-qunnamsiisu uume.",
    color: "from-emerald-600 to-emerald-400",
    badgeEn: "Today & Beyond",
    badgeOm: "Boruufi Amma",
  },
];

export const AboutTimeline: React.FC<AboutTimelineProps> = ({ lang }) => {
  return (
    <div className="space-y-16 animate-none py-4">
      {/* Section Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-black uppercase tracking-widest border border-amber-100">
          <Calendar size={14} />
          {lang === "en" ? "Platform Evolution" : "Siriis Guddinna Keenyaa"}
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 leading-tight">
          {lang === "en" ? "Our Journey & Career Milestones" : "Seenaa fi Riqicha Guddinna Keenyaa"}
        </h2>
        <p className="text-slate-500 font-medium text-base">
          {lang === "en" 
            ? "Follow the key turning points in Jemal Fano Haji's professional career and the systematic rise of Dure Boru." 
            : "Adeemsa milkaa'ina Jemaal Faanoo Haajii fi guddina giddu-gala dijitaalaa Dure Boru gaggabaabaatti dhiyaate."}
        </p>
      </div>

      {/* Vertical Timeline Desktop / Stacked Mobile */}
      <div className="relative max-w-5xl mx-auto px-4 md:px-0">
        {/* Central Vertical Line (hidden on tiny mobile, visible md+) */}
        <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-blue-500 via-amber-400 to-emerald-500 -translate-x-1/2 rounded-full hidden sm:block opacity-30" />

        <div className="space-y-12 relative">
          {timelineEvents.map((event, index) => {
            const Icon = event.icon;
            const isEven = index % 2 === 0;

            return (
              <div 
                key={event.year}
                className={cn(
                  "flex flex-col sm:flex-row items-stretch w-full relative",
                  isEven ? "sm:flex-row-reverse" : ""
                )}
              >
                {/* Visual Dot on Central Line */}
                <div className="absolute left-8 md:left-1/2 top-6 -translate-x-1/2 z-20 hidden sm:flex items-center justify-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full bg-white border-4 flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-125",
                    isEven ? "border-blue-500" : "border-emerald-500"
                  )}>
                    <div className={cn("w-3 h-3 rounded-full bg-slate-900")} />
                  </div>
                </div>

                {/* Left side spacer / Card Wrapper */}
                <div className="w-full sm:w-1/2 sm:px-8 md:px-12">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Event Year Header Badge */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className={cn(
                        "text-3xl font-black tracking-tight bg-gradient-to-r bg-clip-text text-transparent",
                        event.color
                      )}>
                        {event.year}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                        {lang === "en" ? event.badgeEn : event.badgeOm}
                      </span>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br",
                          event.color
                        )}>
                          <Icon size={18} />
                        </div>
                        <h3 className="text-lg font-black tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {lang === "en" ? event.titleEn : event.titleOm}
                        </h3>
                      </div>
                      
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">
                        {lang === "en" ? event.descEn : event.descOm}
                      </p>
                    </div>

                    {/* Subtle design element */}
                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-slate-50 rounded-tl-full -z-10 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
                  </motion.div>
                </div>

                {/* Right side spacer to keep timeline balanced */}
                <div className="w-full sm:w-1/2 hidden sm:block" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
