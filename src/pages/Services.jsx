import React from 'react';
import ServicesHero from '../components/ServicesHero';

const Services = () => {
  const servicesList = [
    { title: "Standard Install", price: "₹999", img: "1542013936693-884638332954", desc: "Expert membrane system setup." },
    { title: "Annual AMC", price: "₹2,499", img: "1518837695005-2083093ee35b", desc: "Full year membrane care." },
    { title: "Membrane Swap", price: "₹1,899", img: "1550757750-4ce187a65014", desc: "Replace old membrane core." },
    { title: "Flow Tuning", price: "₹499", img: "1527018601619-a508a2be00cd", desc: "Optimize water pressure." },
    { title: "Pre-Filter Sync", price: "₹399", img: "1518531933037-91b2f5f229cc", desc: "Swap sediment filter." },
    { title: "Carbon Swap", price: "₹599", img: "1523362628745-0c100150b504", desc: "Renew carbon block." },
    { title: "Smart Setup", price: "₹299", img: "1542013936693-884638332954", desc: "App connectivity sync." },
    { title: "Sanitization", price: "₹799", img: "1518837695005-2083093ee35b", desc: "Deep system cleaning." },
    { title: "Leak Check", price: "₹349", img: "1550757750-4ce187a65014", desc: "Seal and tubing repair." },
    { title: "Diagnostics", price: "₹249", img: "1527018601619-a508a2be00cd", desc: "Membrane health check." },
    { title: "Relocation", price: "₹899", img: "1518531933037-91b2f5f229cc", desc: "Safe system moving." },
    { title: "Part Replace", price: "₹449", img: "1523362628745-0c100150b504", desc: "Genuine spare parts." },
  ];

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24">
      <ServicesHero />

      {/* Reduced horizontal padding on mobile so 3 columns fit better */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 mt-16 md:mt-20">
        
        <div className="text-center mb-10 md:mb-16 px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4">Available Services</h2>
          <p className="text-xs md:text-lg text-slate-600 max-w-2xl mx-auto">
            Book professional maintenance, installation, and repair services for your membrane water purifier.
          </p>
        </div>

        {/* Grid: 3 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
           {servicesList.map((service, i) => (
             <div 
               key={i} 
               // Sharp corners (rounded-none)
               className="bg-white shadow-sm border border-slate-200 flex flex-col h-full rounded-none group hover:shadow-xl transition-all"
             >
               
               {/* Image with sharp corners */}
               <div className="w-full aspect-[4/3] bg-slate-100 overflow-hidden rounded-none">
                 <img 
                   src={`https://images.unsplash.com/photo-${service.img}?q=80&w=400&auto=format&fit=crop`} 
                   alt={service.title} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-none" 
                 />
               </div>
               
               {/* Content with highly responsive text sizes to fit 3 cols on mobile */}
               <div className="p-2 md:p-5 flex flex-col flex-grow">
                 <h3 className="text-[11px] md:text-lg font-bold text-slate-900 mb-1 md:mb-2 line-clamp-1">{service.title}</h3>
                 <p className="text-[9px] md:text-sm text-slate-600 mb-2 md:mb-4 flex-grow line-clamp-2 md:line-clamp-none leading-snug">{service.desc}</p>
                 <div className="mt-auto">
                   <p className="text-[11px] md:text-xl font-bold text-blue-600 mb-1.5 md:mb-4">{service.price}</p>
                   <button 
                     onClick={(e) => {
                       e.preventDefault();
                       window.open(`https://wa.me/919876543210?text=${encodeURIComponent(`Hi, I'm interested in booking the ${service.title} service`)}`, '_blank');
                     }}
                     className="w-full py-1.5 md:py-2.5 px-0.5 bg-[#25D366] hover:bg-[#128C7E] text-white text-[6.5px] min-[375px]:text-[7.5px] sm:text-[9px] md:text-sm font-bold rounded-none transition-colors uppercase flex items-center justify-center gap-1 md:gap-2 tracking-tighter md:tracking-normal"
                   >
                     <svg className="w-2.5 h-2.5 md:w-4 md:h-4 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                     <span className="truncate">Book through WhatsApp</span>
                   </button>
                 </div>
               </div>
               
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
