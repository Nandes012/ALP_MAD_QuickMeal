import React from 'react';

import ExploreView from '@/mvc/explore/ExploreView';
import { useExploreController } from '@/mvc/explore/useExploreController';

export default function ExploreScreen() {
  const controller = useExploreController();

  return <ExploreView {...controller} />;
}
