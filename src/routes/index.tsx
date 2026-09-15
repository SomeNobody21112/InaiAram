import { Hero } from '../components/sections/Hero';
import { CorePromise } from '../components/sections/CorePromise';
import { InformationAsymmetry } from '../components/sections/InformationAsymmetry';
import { TheAsk } from '../components/sections/TheAsk';
import { HowItWorks } from '../components/sections/HowItWorks';
import { EvidenceThreadSection } from '../components/sections/EvidenceThreadSection';
import { ConsentPrivacy } from '../components/sections/ConsentPrivacy';
import { Limitations } from '../components/sections/Limitations';
import { EightPillars } from '../components/sections/EightPillars';
import { WhyInaiAram } from '../components/sections/WhyInaiAram';
import { MutualTrust } from '../components/sections/MutualTrust';
import { Health } from '../components/sections/Health';
import { Dispute } from '../components/sections/Dispute';
import { Packages } from '../components/sections/Packages';
import { Faq } from '../components/sections/Faq';
import { FinalCta } from '../components/sections/FinalCta';
import { SectionRule } from '../components/ui/SectionRule';

export function LandingPage() {
  return (
    <main id="main-content">
      <Hero />
      <CorePromise />
      <InformationAsymmetry />
      <TheAsk />
      <HowItWorks />
      <EvidenceThreadSection />
      <MutualTrust />
      <div className="bg-bg"><SectionRule label="◆ CERTAINTY LEVELS ◆" className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12" /></div>
      <ConsentPrivacy />
      <Limitations />
      <EightPillars />
      <Health />
      <Dispute />
      <WhyInaiAram />
      <Packages />
      <Faq />
      <FinalCta />
    </main>
  );
}
