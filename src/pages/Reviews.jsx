import React from 'react';
import { Star } from 'lucide-react';

const Reviews = () => {
  const reviews = [
    { name: "Sarah Jenkins", role: "Homeowner", text: "The water tastes incredible. We used to buy bottled water every week, but the Aqua Safe Water Technologies system has completely replaced that. The installation was seamless.", rating: 5 },
    { name: "Michael Chen", role: "Cafe Owner", text: "I installed this in my small cafe to ensure our coffee tastes consistent. The advanced membrane filtration really makes a difference in the brew quality.", rating: 5 },
    { name: "Amanda Richards", role: "Mother of two", text: "Knowing that 99.9% of bacteria and heavy metals are removed gives me so much peace of mind when giving water to my kids. Best investment we've made.", rating: 5 },
    { name: "David Thompson", role: "Homeowner", text: "Solid build quality and looks great under the sink. The flow rate is impressive compared to my old filter system.", rating: 4 },
  ];

  return (
    <div className="w-full bg-slate-50 min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Customer Reviews</h1>
          <p className="text-xl text-slate-600 mb-4">See what our customers are saying about Aqua Safe Water Technologies</p>
          <div className="flex items-center justify-center space-x-1">
             {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />)}
             <span className="ml-2 font-bold text-slate-700 text-lg">4.9 / 5.0 (2,000+ Reviews)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {reviews.map((review, i) => (
             <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex space-x-1 mb-4">
                  {[...Array(review.rating)].map((_, idx) => <Star key={idx} className="w-5 h-5 text-yellow-400 fill-current" />)}
                </div>
                <p className="text-slate-600 italic mb-6 leading-relaxed">"{review.text}"</p>
                <div>
                  <h4 className="font-bold text-slate-900">{review.name}</h4>
                  <p className="text-sm text-slate-500">{review.role}</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
