import { t } from 'ttag';

import { showOptionDialog } from '@components/nav/helper';

export function showScenarioDialog(
  scenarios: string[],
  scenarioChanged: (scenario: string) => void
) {
  showOptionDialog(
    t`Scenario`,
    scenarios,
    (index: number) => {
      scenarioChanged(scenarios[index]);
    }
  );
}
