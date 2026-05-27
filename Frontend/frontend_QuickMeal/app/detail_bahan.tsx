import React from 'react';

import DetailBahanView from '@/mvc/detail-bahan/DetailBahanView';
import { useDetailBahanController } from '@/mvc/detail-bahan/useDetailBahanController';

export default function DetailBahan() {
  const controller = useDetailBahanController();

  return <DetailBahanView {...controller} />;
}
