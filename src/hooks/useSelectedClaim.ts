import { createContext, useContext } from 'react';
import type { ClaimRecord } from '../data/sampleCase';

interface SelectedClaimContextType {
  selectedClaimId: string | null;
  setSelectedClaimId: (id: string | null) => void;
  selectedClaim: ClaimRecord | null;
}

const SelectedClaimContext = createContext<SelectedClaimContextType>({
  selectedClaimId: null,
  setSelectedClaimId: () => {},
  selectedClaim: null,
});

export function useSelectedClaim() {
  return useContext(SelectedClaimContext);
}

export { SelectedClaimContext };
