import { useEffect, useState } from "react";

export default function UserRateLimit() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [reset, setReset] = useState<number | null>(null);

  useEffect(() => {
    async function fetchRateLimit() {
      try {
        const res = await fetch("/api/rateLimit");
        const data = await res.json();
        if (res.ok) {
          setRemaining(data.remaining);
          setReset(data.reset);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchRateLimit();
  }, []);

  if (remaining === null) return null;

  const resetDate = reset ? new Date(reset) : null;

  return (
    <div className="p-4 bg-slate-700/20 rounded-xl border border-dashed border-slate-600/50 text-sm text-slate-300">
      <p>
        Remaining Requests: <span className="font-bold">{remaining}</span>
      </p>
      {resetDate && (
        <p className="text-xs text-slate-400">
          Resets at: {resetDate.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
