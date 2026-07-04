import ModuleHub from '@/components/ModuleHub';
import data from '@/utils/data';

export default function TrackTab() {
  return <ModuleHub moduleKey="track" items={data.analysisList} />;
}
