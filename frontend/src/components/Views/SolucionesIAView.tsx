/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Brain } from 'lucide-react';
import { ActivePage } from '../../types';
import ServiceCategoryPage from './ServiceCategoryPage';

interface SolucionesIAViewProps {
  onPageChange: (page: ActivePage) => void;
}

export default function SolucionesIAView(_props: SolucionesIAViewProps) {
  return (
    <ServiceCategoryPage
      category="soluciones-ia"
      heroIcon={Brain}
      viewId="soluciones-ia-view"
    />
  );
}
