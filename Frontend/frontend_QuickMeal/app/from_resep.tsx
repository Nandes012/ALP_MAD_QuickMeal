import React from 'react';

import FromResepView from '@/mvc/from-resep/FromResepView';
import { useFromResepController } from '@/mvc/from-resep/useFromResepController';

export default function FromResepScreen() {
  const controller = useFromResepController();

  return <FromResepView {...controller} />;
}
