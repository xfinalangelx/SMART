import ModuleHub from '@/components/ModuleHub';
import data from '@/utils/data';

export default function AnalysisScreen() {
  return <ModuleHub moduleKey="track" items={data.analysisList} showBack />;
}
