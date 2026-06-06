import { useState, useEffect } from 'react';
import { getPerformanceReviews } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Star, TrendingUp } from 'lucide-react';

const Performance = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getPerformanceReviews({}).then(r => setReviews(r.data)).finally(() => setLoading(false)); }, []);

  const RatingStars = ({ rating }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={14} className={i <= rating ? 'text-warning-400 fill-warning-400' : 'text-dark-600'} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Performance Reviews</h1><p className="text-dark-400 mt-1">Track and manage performance</p></div>

      {loading ? <div className="flex justify-center py-12"><div className="spinner" /></div> :
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {reviews.map(r => (
            <div key={r._id} className="glass rounded-2xl p-5 card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-semibold">{r.user?.name?.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-medium text-white">{r.user?.name}</p>
                    <p className="text-xs text-dark-400">{r.user?.designation} · {r.period}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={16} className="text-warning-400 fill-warning-400" />
                  <span className="text-lg font-bold text-white">{r.overallRating}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {Object.entries(r.ratings || {}).map(([key, val]) => (
                  <div key={key} className="bg-dark-800/40 rounded-lg p-2.5">
                    <p className="text-xs text-dark-400 capitalize mb-1">{key}</p>
                    <RatingStars rating={val} />
                  </div>
                ))}
              </div>

              {r.goals?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-dark-400 mb-2">Goals</p>
                  <div className="space-y-1.5">
                    {r.goals.map((g, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${g.status === 'completed' ? 'bg-success-400' : g.status === 'in_progress' ? 'bg-warning-400' : 'bg-dark-500'}`} />
                        <span className="text-dark-300">{g.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-dark-700/50 text-xs text-dark-400">
                <span>Reviewed by: {r.reviewer?.name}</span>
                <span className={`badge ${r.status === 'submitted' ? 'bg-success-500/20 text-success-400' : 'bg-dark-600/50 text-dark-300'}`}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
};

export default Performance;
