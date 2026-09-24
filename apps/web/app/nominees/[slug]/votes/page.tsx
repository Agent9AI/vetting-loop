import * as React from 'react';
import Link from 'next/link';
import { ActBanner, VoteTable } from '@vetting-loop/ui';

export default function VotesPage({ params }: { params: { slug: string } }) {
  const mockVotes = [
    { id: '1', mpName: 'Hon. John Smith', constituency: 'Nairobi Central', party: 'UDA', choice: 'aye' as const, source: { url: '#', publisher: 'Hansard' } },
    { id: '2', mpName: 'Hon. Jane Doe', constituency: 'Kisumu Town', party: 'ODM', choice: 'nay' as const, source: { url: '#', publisher: 'Hansard' } },
    { id: '3', mpName: 'Hon. Peter Parker', constituency: 'Mombasa', party: 'WIPER', choice: 'abstain' as const, source: { url: '#', publisher: 'Hansard' } },
    { id: '4', mpName: 'Hon. Bruce Wayne', constituency: 'Nakuru', party: 'JUBILEE', choice: 'absent' as const, source: { url: '#', publisher: 'Hansard' } },
  ];

  return (
    <main className="min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href={`/nominees/${params.slug}`} className="text-sm font-mono text-neutral-500 hover:text-emerald-400 transition-colors">
          ← Back to Dossier
        </Link>
      </div>

      <ActBanner act="after" label="Vote Trail" />

      {/* Summary Stats */}
      <div className="mb-10 flex gap-6">
        <div className="flex-1 p-6 border border-neutral-800 rounded-lg text-center bg-red-950/20">
          <div className="text-4xl font-bold text-red-400 mb-1">142</div>
          <div className="text-xs font-mono uppercase text-red-500/80">Ayes</div>
        </div>
        <div className="flex-1 p-6 border border-neutral-800 rounded-lg text-center bg-emerald-950/20">
          <div className="text-4xl font-bold text-emerald-400 mb-1">98</div>
          <div className="text-xs font-mono uppercase text-emerald-500/80">Nays</div>
        </div>
        <div className="flex-1 p-6 border border-neutral-800 rounded-lg text-center bg-neutral-900/50">
          <div className="text-4xl font-bold text-neutral-400 mb-1">15</div>
          <div className="text-xs font-mono uppercase text-neutral-500">Abstentions / Absent</div>
        </div>
      </div>

      {/* Vote Table */}
      <div className="mb-8">
        <VoteTable votes={mockVotes} />
      </div>

      <div className="text-center">
        <p className="text-xs text-neutral-500 font-mono">
          Data sourced from the official Parliamentary Hansard. <br/>
          Errors or omissions? <a href="mailto:corrections@vettingloop.ke" className="text-emerald-500 hover:underline">Report an issue</a>.
        </p>
      </div>
    </main>
  );
}
