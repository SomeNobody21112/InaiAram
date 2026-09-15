/**
 * REPORTS — a real destination, not a redirect.
 * Lists the available report(s) for the workspace. A report exists only once
 * its verification has completed; otherwise an honest not-ready state is shown.
 * No downloadable files exist — the report is an on-screen artifact.
 */
import { Link } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { EmptyState, PageHeader } from '../../ui/primitives';
import { StatusPill } from '../domain';
import { useCase, PROTO_NOW } from '../../../store/app';

export function ReportsScreen() {
  const c = useCase();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="REPORTS"
        title="Reports"
        description="The evidence document for each completed verification — findings, coverage, limitations, and what could not be established. Reports are on-screen artifacts; this prototype generates no files."
      />

      {!c ? (
        <EmptyState title="No reports yet" body="A report becomes available once a verification completes." action={<Link to="/app/new-verification"><Button>Start a verification</Button></Link>} />
      ) : c.simPhase < 5 ? (
        <EmptyState
          title="No report available yet"
          body={`Verification ${c.id} is still in progress (stage ${Math.max(c.simPhase, 0)} of 5). The report is prepared only after every check and human review is complete.`}
          action={<Link to={`/app/verifications/${c.id}`}><Button variant="secondary">Open verification</Button></Link>}
        />
      ) : (
        <div className="space-y-2.5">
          <Link
            to={`/app/reports/${c.id}`}
            className="block rounded-xl border border-line bg-surface p-5 hover:border-line-strong hover:bg-surface-raised transition-colors"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-base font-semibold text-ink">Verification report · {c.subjectName}</p>
              <StatusPill status={c.status} />
            </div>
            <p className="meta-mono text-ink-3">{c.id} · Prepared {new Date(PROTO_NOW).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="text-xs text-ink-2 mt-2">{c.scope.length} categories · Findings carry source, coverage and expiry · Illustrative sample — not a real person</p>
          </Link>
        </div>
      )}
    </div>
  );
}