import { useState, useEffect } from 'react';
import { Avatar, Button, Tag } from '@sap-ui/fx-components';
import { ChevronDown, ChevronUp, Check, Loader2 } from 'lucide-react';

// Steps:
//  1 = solution card collapsed (chevron ↓ on Reassign)
//  2 = chevron clicked, expanding team members (brief intermediate)
//  3 = scrolled / investigating — team members prominent, header "Investigating"
//  4 = "Assign" clicked — success

export function WorkflowJoulePane() {
  const [step, setStep] = useState(1);
  const [selectedMember, setSelectedMember] = useState<'arjun' | 'maria' | 'maya'>('arjun');

  // Auto-advance from step 2 to step 3 (simulate scroll / Joule investigating)
  useEffect(() => {
    if (step === 2) {
      const t = setTimeout(() => setStep(3), 700);
      return () => clearTimeout(t);
    }
  }, [step]);

  if (step === 4) return <SuccessState />;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-3 flex-1">
        {/* Outer purple-tinted solution card */}
        <div className="rounded-[20px] overflow-hidden" style={{ background: '#f3f0ff', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>

          {/* Sticky header */}
          <div className="flex items-center gap-[12px] px-[24px] py-[14px] sticky top-0 z-10" style={{ background: '#f3f0ff' }}>
            <Avatar size="XS" shape="Circle" initials="SD" colorScheme="Accent5" />
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] font-semibold leading-[18px]" style={{ color: 'var(--text-primary, #0b0c0f)' }}>
                Promotion approval resolution
              </span>
              <span className="text-[12px] leading-[16px]" style={{ color: 'var(--text-secondary, #353c4a)' }}>
                Recommended Solution
              </span>
            </div>
          </div>

          {/* White body */}
          <div className="bg-white overflow-hidden">

            {/* Section 1 — Reassign Approval to Delegate (always expanded) */}
            <div className="flex flex-col gap-[16px] px-[24px] py-[24px]" style={{ borderBottom: '1px solid #e6e7ea' }}>
              {/* Tags */}
              <div className="flex flex-wrap gap-[6px]">
                <Tag design="Information">Employee Central</Tag>
                <Tag design="Draft">Org Chart</Tag>
                <Tag design="Active">Delegation Policy Engine</Tag>
              </div>

              {/* Title + chevron */}
              <div className="flex items-center justify-between gap-[8px]">
                <span className="text-[20px] font-bold leading-[28px]" style={{ color: 'var(--text-primary, #0b0c0f)' }}>
                  Reassign Approval to Delegate
                </span>
                <button
                  onClick={() => step === 1 ? setStep(2) : undefined}
                  className="p-[6px] rounded-[8px] hover:bg-[#e8e0ff] transition-colors shrink-0"
                  style={{ color: '#5d36ff' }}
                >
                  {step >= 2 ? <ChevronUp className="h-[20px] w-[20px]" /> : <ChevronDown className="h-[20px] w-[20px]" />}
                </button>
              </div>

              {/* Description */}
              <p className="text-[14px] leading-[20px]" style={{ color: 'var(--text-secondary, #353c4a)' }}>
                Meera Iyer (VP approver) has been on medical leave since 14 Aug with no delegation
                configured. Reassigning to a qualified delegate at the same authority level unblocks
                Rajesh Kumar's promotion and ensures payroll compliance before the 52h deadline.
              </p>

              {/* Confidence */}
              <div className="flex flex-col gap-[8px]">
                <div className="flex items-center justify-between">
                  <span className="text-[12px]" style={{ color: 'var(--text-tertiary, #636d83)' }}>Confidence</span>
                  <span className="text-[14px] font-semibold" style={{ color: '#5d36ff' }}>95%</span>
                </div>
                <div className="h-[8px] rounded-[100px] overflow-hidden" style={{ background: '#e8e0ff' }}>
                  <div
                    className="h-full rounded-[100px]"
                    style={{
                      width: '95%',
                      background: 'linear-gradient(90deg, #8b5cf6 0%, #5d36ff 50%, #4f46e5 100%)',
                    }}
                  />
                </div>
              </div>

              {/* Pros / Cons */}
              <div className="grid grid-cols-2 gap-[16px]">
                <div className="flex flex-col gap-[6px]">
                  <span className="text-[12px] font-semibold" style={{ color: '#238240' }}>Pros</span>
                  {['Same authority level', 'Payroll-safe timeline', 'Audit trail preserved', 'No policy violation'].map((p) => (
                    <div key={p} className="flex items-start gap-[6px]">
                      <span className="mt-[4px] w-[6px] h-[6px] rounded-full shrink-0" style={{ background: '#238240' }} />
                      <span className="text-[13px] leading-[18px]" style={{ color: 'var(--text-secondary, #353c4a)' }}>{p}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-[6px]">
                  <span className="text-[12px] font-semibold" style={{ color: '#ad2220' }}>Cons</span>
                  {['Delegate needs context hand-off', 'Meera notified on return'].map((c) => (
                    <div key={c} className="flex items-start gap-[6px]">
                      <span className="mt-[4px] w-[6px] h-[6px] rounded-full shrink-0" style={{ background: '#ad2220' }} />
                      <span className="text-[13px] leading-[18px]" style={{ color: 'var(--text-secondary, #353c4a)' }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team members — visible in steps 2, 3 */}
              {step >= 2 && (
                <div className="flex flex-col gap-[12px]">
                  <span className="text-[14px] font-semibold" style={{ color: 'var(--text-primary, #0b0c0f)' }}>
                    Recommended Team members
                  </span>
                  <TeamMemberList selected={selectedMember} onSelect={setSelectedMember} />
                  {/* Action buttons */}
                  <div className="flex items-center justify-end gap-[8px] pt-[4px]">
                    <Button design="Tertiary">Assign manually</Button>
                    <Button design="Tertiary" icon={<Check className="h-[14px] w-[14px]" />} onClick={() => setStep(4)}>
                      Assign
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2 — Remind Meera (collapsed) */}
            <CollapsedSection
              title="Remind Meera"
              tags={['Integration Flow', 'SAP Integration Suite']}
              desc="Deterministic integration flow to send a delegation reminder to Meera Iyer via preferred channel with policy context attached."
            />

            {/* Section 3 — Handle it myself (collapsed) */}
            <CollapsedSection
              title="Handle it myself"
              tags={['Third-Party Solution']}
              desc="Pre-configured workflows allow the admin to manually reassign or approve using delegated authority tools."
              noBorder
            />
          </div>
        </div>

        {/* Joule investigating indicator — step 3 only */}
        {step === 3 && (
          <div className="flex items-center gap-[8px] mt-[12px] px-[4px]">
            <Loader2 className="h-[14px] w-[14px] animate-spin" style={{ color: '#5d36ff' }} />
            <span className="text-[13px]" style={{ color: 'var(--text-tertiary, #636d83)' }}>
              Joule · Investigating delegation chain…
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Team member list ────────────────────────────────────────────────────────

type MemberId = 'arjun' | 'maria' | 'maya';

const MEMBERS: Array<{ id: MemberId; name: string; role: string; initials: string; note?: string }> = [
  { id: 'arjun', name: 'Arjun Reddy', role: 'VP Engineering', initials: 'AR', note: 'Same authority level · Same engineering org · 3 open approvals (within capacity) · Delegation policy compliant' },
  { id: 'maria', name: 'Maria Santos', role: 'VP Product APAC', initials: 'MS' },
  { id: 'maya', name: 'Maya Chen', role: 'VP Engineering Global', initials: 'MC' },
];

function TeamMemberList({ selected, onSelect }: { selected: MemberId; onSelect: (id: MemberId) => void }) {
  return (
    <div className="flex flex-col gap-[4px] rounded-[16px] p-[8px]" style={{ background: '#f5f6f7' }}>
      {MEMBERS.map((m) => {
        const isSelected = selected === m.id;
        return (
          <div
            key={m.id}
            onClick={() => onSelect(m.id)}
            className="cursor-pointer rounded-[12px] overflow-hidden"
            style={isSelected ? { background: '#5f38ff', border: '2px solid #5d36ff' } : { border: '2px solid transparent' }}
          >
            {/* Main row */}
            <div
              className="flex items-center gap-[12px] p-[12px] rounded-[10px]"
              style={isSelected ? { background: 'white', borderRadius: '10px', margin: '0' } : { background: 'white', borderRadius: '10px' }}
            >
              {/* Radio */}
              <div
                className="w-[18px] h-[18px] rounded-full border-2 shrink-0 flex items-center justify-center"
                style={isSelected ? { borderColor: '#5d36ff', background: '#5d36ff' } : { borderColor: '#b0b9cc', background: 'white' }}
              >
                {isSelected && <div className="w-[7px] h-[7px] rounded-full bg-white" />}
              </div>

              <Avatar size="XS" shape="Circle" initials={m.initials} colorScheme={isSelected ? 'Accent5' : 'Accent6'} />

              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold leading-[18px]" style={{ color: isSelected ? '#5d36ff' : 'var(--text-primary, #0b0c0f)' }}>
                  {m.name}
                </div>
                <div className="text-[13px] leading-[16px]" style={{ color: 'var(--text-secondary, #353c4a)' }}>
                  {m.role}
                </div>
              </div>

              {m.id === 'arjun' && (
                <div className="flex items-center gap-[4px] shrink-0">
                  <span className="text-[11px] font-semibold" style={{ color: '#5d36ff' }}>Recommended by Joule</span>
                </div>
              )}
            </div>

            {/* Joule reasoning below for selected Arjun */}
            {isSelected && m.note && (
              <div className="px-[12px] pb-[10px] pt-[2px]">
                <p className="text-[13px] leading-[18px] text-white">{m.note}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Collapsed section card ───────────────────────────────────────────────────

function CollapsedSection({
  title,
  tags,
  desc,
  noBorder,
}: {
  title: string;
  tags: string[];
  desc: string;
  noBorder?: boolean;
}) {
  return (
    <div
      className="mx-[16px] my-[12px] rounded-[16px] px-[24px] pt-[4px] pb-[20px] flex flex-col gap-[10px]"
      style={{ background: '#f5f6f7', border: noBorder ? undefined : undefined }}
    >
      <div className="flex items-center justify-between pt-[12px]">
        <span className="text-[16px] font-bold leading-[22px]" style={{ color: 'var(--text-primary, #0b0c0f)' }}>
          {title}
        </span>
        <button className="p-[4px] rounded-[6px] hover:bg-[#e6e7ea]" style={{ color: '#636d83' }}>
          <ChevronDown className="h-[18px] w-[18px]" />
        </button>
      </div>
      <div className="flex flex-wrap gap-[6px]">
        {tags.map((t, i) => (
          <Tag key={t} design={i === 0 ? 'Information' : 'None'}>{t}</Tag>
        ))}
      </div>
      <p className="text-[13px] leading-[18px]" style={{ color: 'var(--text-secondary, #353c4a)' }}>
        {desc}
      </p>
    </div>
  );
}

// ─── Step 4 — Success state ───────────────────────────────────────────────────

function SuccessState() {
  return (
    <div className="flex flex-col gap-[16px] p-3 overflow-y-auto h-full">
      {/* User bubble */}
      <div className="flex justify-end">
        <div
          className="px-[16px] py-[8px] text-[14px] leading-[20px] max-w-[80%]"
          style={{
            background: 'var(--brand-toggled-background, #d6e1f0)',
            borderRadius: '16px 16px 2px 16px',
            color: 'var(--text-primary, #0b0c0f)',
          }}
        >
          Delegate
        </div>
      </div>

      {/* Joule confirmation text */}
      <div className="flex items-start gap-[8px]">
        <Avatar size="XS" shape="Circle" initials="J" colorScheme="Accent5" />
        <div
          className="flex-1 px-[14px] py-[10px] text-[14px] leading-[20px] rounded-[16px] rounded-tl-[4px]"
          style={{ background: '#f5f6f7', color: 'var(--text-primary, #0b0c0f)' }}
        >
          Approval delegated to <strong>Arjun Reddy</strong> (VP Engineering). Policy HR-PROMO-002, Sec 4.2 applied. Meera Iyer will be notified on her return.
        </div>
      </div>

      {/* Success illustrated card */}
      <div className="bg-white rounded-[16px] overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
        <div className="flex flex-col items-center gap-[12px] px-[24px] py-[28px] text-center">
          {/* Illustration */}
          <div className="w-[96px] h-[96px] flex items-center justify-center">
            <SuccessIllustration />
          </div>
          <span className="text-[20px] font-semibold leading-[28px]" style={{ color: 'var(--text-primary, #0b0c0f)' }}>
            Task Successfully Delegated!
          </span>
          <p className="text-[14px] leading-[20px]" style={{ color: 'var(--text-secondary, #353c4a)' }}>
            Rajesh Kumar's promotion approval is now with Arjun Reddy. Expected resolution before payroll deadline.
          </p>
          <button
            className="mt-[4px] px-[20px] py-[8px] text-[14px] font-semibold text-white rounded-[8px]"
            style={{ background: '#0070f2' }}
          >
            View Audit Trails
          </button>
        </div>
      </div>

      {/* Follow-up Joule text */}
      <div className="flex items-start gap-[8px]">
        <Avatar size="XS" shape="Circle" initials="J" colorScheme="Accent5" />
        <div
          className="flex-1 px-[14px] py-[10px] text-[14px] leading-[20px] rounded-[16px] rounded-tl-[4px]"
          style={{ background: '#f5f6f7', color: 'var(--text-secondary, #353c4a)' }}
        >
          I noticed this happened because Meera Iyer had no delegation configured. <strong>2 similar cases</strong> exist in your org. Want me to set up auto-delegation for future absences &gt;2 days? Also, 2 routine items remain — both within auto-approval threshold.
        </div>
      </div>

      {/* Quick replies */}
      <div className="flex flex-wrap gap-[8px] pl-[36px]">
        <Button design="SecondaryJoule">Set up auto-delegation</Button>
        <Button design="SecondaryJoule">Handle routine ones</Button>
        <Button design="SecondaryJoule">I'm done</Button>
      </div>
    </div>
  );
}

// ─── Success illustration SVG ─────────────────────────────────────────────────

function SuccessIllustration() {
  return (
    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" width="96" height="96">
      <circle cx="48" cy="48" r="44" fill="#edfcf0" />
      <circle cx="48" cy="48" r="32" fill="#d1fae5" />
      <path
        d="M34 48l10 10 18-20"
        stroke="#238240"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* sparkles */}
      <circle cx="16" cy="20" r="3" fill="#5d36ff" opacity="0.6" />
      <circle cx="80" cy="24" r="2" fill="#0070f2" opacity="0.5" />
      <circle cx="76" cy="76" r="3" fill="#5d36ff" opacity="0.4" />
      <circle cx="20" cy="74" r="2" fill="#0070f2" opacity="0.5" />
      <path d="M10 48l4-4m0 4l-4-4" stroke="#5d36ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M86 48l4-4m0 4l-4-4" stroke="#0070f2" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}
