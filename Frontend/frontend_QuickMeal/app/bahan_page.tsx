import React from 'react';

import BahanPageView from '@/mvc/ingredient-page/BahanPageView';
import { useBahanPageController } from '@/mvc/ingredient-page/useBahanPageController';

export default function BahanPage() {
  const controller = useBahanPageController();

  return <BahanPageView {...controller} />;
}