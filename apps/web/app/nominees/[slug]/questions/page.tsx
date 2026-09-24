import * as React from 'react';
import Link from 'next/link';
import { ActBanner, SectionHeading, QuestionCard } from '@vetting-loop/ui';

export default function QuestionsPage({ params }: { params: { slug: string } }) {
  // Mock data for now since API might not be available
  const mockQuestions = [
    { id: '1', body: 'What specific measures did the nominee take to address the 2021 audit report findings on missing funds?', upvotes: 342, status: 'pending' as const, submitterLabel: 'Civil Society' },
    { id: '2', body: 'Why was the road project in Constituency X abandoned during their tenure as PS?', upvotes: 215, status: 'partially_asked' as const, submitterLabel: 'Constituent' },
    { id: '3', body: 'Please explain the conflict of interest regarding company Y.', upvotes: 189, status: 'asked' as const, askedBy: 'Hon. Jane Doe' },
  ];

  return (
    <main className="min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href={`/nominees/${params.slug}`} className="text-sm font-mono text-neutral-500 hover:text-emerald-400 transition-colors">
          ← Back to Dossier
        </Link>
      </div>

      <ActBanner act="before" label="Public Question Queue" />
      
      <SectionHeading label="Top Questions" count={mockQuestions.length} note="Ranked by citizen upvotes" />
      
      <div className="space-y-4 mb-12">
        {mockQuestions.map(q => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>

      <div className="border border-neutral-800 rounded-lg p-6 bg-neutral-900/30 text-center">
        <h3 className="text-lg font-bold mb-2">Submit a Question</h3>
        <p className="text-sm text-neutral-400 mb-6">Must be fact-based. Bare allegations will be rejected by moderators.</p>
        <div className="text-sm font-mono text-neutral-500 mb-4 border-t border-neutral-800 pt-4 max-w-sm mx-auto">
          Please sign in to submit or upvote questions.
        </div>
      </div>
    </main>
  );
}
