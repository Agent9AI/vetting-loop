import * as React from 'react';
import Link from 'next/link';
import { ActBanner, HearingRow } from '@vetting-loop/ui';

export default function HearingPage({ params }: { params: { slug: string } }) {
  const mockExchanges = [
    { id: '1', topic: 'Audit 2021', askedBy: 'Hon. John Smith', questionText: 'Can you explain the missing 2.5B in the 2021 audit?', responseText: 'I was not the accounting officer at the time. The transition was ongoing and I cannot speak to those specific numbers.', addressesCitizenQuestion: true, status: 'asked' as const },
    { id: '2', topic: 'Roads', askedBy: 'Hon. Jane Doe', questionText: 'When will you complete the abandoned roads in my constituency?', responseText: 'Pending exchequer releases.', addressesCitizenQuestion: false, status: 'asked' as const },
  ];

  const citizenQSubmitted = 14;
  const citizenQIgnored = 11;

  return (
    <main className="min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href={`/nominees/${params.slug}`} className="text-sm font-mono text-neutral-500 hover:text-emerald-400 transition-colors">
          ← Back to Dossier
        </Link>
      </div>

      <ActBanner act="during" label="Hearing Record" />

      {/* Summary Stat Bar */}
      <div className="mb-10 p-6 border border-neutral-800 bg-neutral-900/30 rounded-lg text-center">
        <p className="text-2xl font-bold">
          <span className="text-neutral-200">{citizenQSubmitted} citizen questions submitted</span>
          <span className="text-neutral-500 mx-3">—</span>
          <span className="text-red-400">{citizenQIgnored} ignored</span>
        </p>
      </div>

      {/* The Silence Map */}
      <div className="mb-12">
        <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-4">The Silence Map</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-neutral-800 rounded-lg p-4">
            <h3 className="text-xs font-mono text-neutral-400 mb-3 border-b border-neutral-800 pb-2">Questions Raised by Citizens</h3>
            <ul className="text-sm space-y-2 text-neutral-300">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Audit 2021 discrepancies
              </li>
              <li className="flex items-center gap-2 line-through text-neutral-600">
                <span className="w-2 h-2 rounded-full bg-neutral-800"></span>
                Conflict of interest (Company Y)
              </li>
              <li className="flex items-center gap-2 line-through text-neutral-600">
                <span className="w-2 h-2 rounded-full bg-neutral-800"></span>
                Unexplained wealth growth
              </li>
            </ul>
          </div>
          <div className="border border-neutral-800 rounded-lg p-4">
            <h3 className="text-xs font-mono text-neutral-400 mb-3 border-b border-neutral-800 pb-2">Questions Asked by Committee</h3>
            <ul className="text-sm space-y-2 text-neutral-300">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Audit 2021 discrepancies
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neutral-500"></span>
                Constituency road projects
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neutral-500"></span>
                General experience
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hearing Exchanges */}
      <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-4">Hearing Transcript Excerpts</h2>
      <div className="border border-neutral-800 rounded-lg p-6 bg-neutral-950">
        {mockExchanges.map(ex => (
          <HearingRow key={ex.id} exchange={ex} />
        ))}
      </div>
    </main>
  );
}
