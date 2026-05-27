import React from 'react';

import BahanTersediaView from '@/mvc/ingredient-availability/BahanTersediaView';
import { useBahanTersediaController } from '@/mvc/ingredient-availability/useBahanTersediaController';

export default function BahanTersediaScreen() {
  const controller = useBahanTersediaController();

  return <BahanTersediaView {...controller} />;
}
