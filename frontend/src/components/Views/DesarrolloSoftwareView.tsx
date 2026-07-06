/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Code } from 'lucide-react';
import { ActivePage } from '../../types';
import ServiceCategoryPage from './ServiceCategoryPage';

interface DesarrolloSoftwareViewProps {
  onPageChange: (page: ActivePage) => void;
}

export default function DesarrolloSoftwareView(_props: DesarrolloSoftwareViewProps) {
  return (
    <ServiceCategoryPage
      category="desarrollo-software"
      heroIcon={Code}
      viewId="desarrollo-software-view"
    />
  );
}
