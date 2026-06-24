interface SectionTitleProps {
    title: string;
    subtitle: string;
    alignment?: "left" | "center";
  }
  
  export default function SectionTitle({ title, subtitle, alignment = "center" }: SectionTitleProps) {
    return (
      <div className={`mb-12 ${alignment === "center" ? "text-center" : "text-left"}`}>
        <span className="text-turquoise font-bold tracking-widest uppercase text-sm mb-2 block">
          {subtitle}
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-navy tracking-tight">
          {title}
        </h2>
        <div className={`h-1 w-20 bg-gold mt-6 rounded-full ${alignment === "center" ? "mx-auto" : ""}`} />
      </div>
    );
  }