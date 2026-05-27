import React from 'react';

import HasilRecResepView from '@/mvc/hasil-rec-resep/HasilRecResepView';
import { useHasilRecResepController } from '@/mvc/hasil-rec-resep/useHasilRecResepController';

export default function HasilRecResepScreen() {
  const controller = useHasilRecResepController();

  return <HasilRecResepView {...controller} />;
}
