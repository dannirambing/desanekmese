import { getPublishedCollaborators } from "@/lib/queries";
import SectionTitle from "./SectionTitle";

export default async function CollaboratorsSection() {
  const collaborators = await getPublishedCollaborators();

  if (collaborators.length === 0) return null;

  return (
    <section className="py-24 bg-stone-50/50 border-t border-stone-200/50 relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-slate-100/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-turquoise/5 blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <SectionTitle
            subtitle="Kemitraan Strategis"
            title="Berkolaborasi Bersama"
            alignment="center"
          />
          <p className="mt-4 text-slate-500 font-medium text-sm md:text-base leading-relaxed">
            Untuk memperkuat pembangunan berkelanjutan, pelayanan publik, dan kesejahteraan masyarakat Desa Nekmese, kami bekerja sama dengan berbagai lembaga pemerintah, organisasi non-pemerintah (NGO), akademisi, dan mitra lokal.
          </p>
        </div>

        {/* Collaborators Grid */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 lg:gap-14 max-w-5xl mx-auto">
          {collaborators.map((collab) => (
            <div key={collab.id} className="flex flex-col items-center gap-3 group">
              <div className="relative w-[76px] h-[76px] md:w-[96px] md:h-[96px] lg:w-[108px] lg:h-[108px] bg-white rounded-2xl p-4 border border-stone-200/60 shadow-sm flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-turquoise/40">
                <img
                  src={collab.logoUrl}
                  alt={collab.name}
                  className="w-full h-full object-contain filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
              </div>
              <p className="text-xs md:text-sm text-center text-slate-500 font-bold max-w-[85px] md:max-w-[110px] lg:max-w-[125px] transition-colors duration-300 group-hover:text-navy">
                {collab.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
