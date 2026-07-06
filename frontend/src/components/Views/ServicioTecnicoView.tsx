/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Wrench } from 'lucide-react';
import ServiceCategoryPage from './ServiceCategoryPage';

export default function ServicioTecnicoView() {
  return (
    <ServiceCategoryPage
      category="servicio-tecnico"
      heroIcon={Wrench}
      viewId="servicio-tecnico-view"
    />
  );
}
