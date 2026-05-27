import React from 'react';

import HomeView from '@/mvc/home/HomeView';
import { useHomeController } from '@/mvc/home/useHomeController';

export default function HomeScreen() {
  const controller = useHomeController();

  return <HomeView {...controller} />;
}
