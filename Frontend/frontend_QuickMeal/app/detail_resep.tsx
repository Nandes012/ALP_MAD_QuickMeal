import React from 'react';

import DetailResepView from '@/mvc/detail-resep/DetailResepView';
import { useDetailResepController } from '@/mvc/detail-resep/useDetailResepController';

export default function DetailResepScreen() {
  const controller = useDetailResepController();

  return <DetailResepView {...controller} />;
}