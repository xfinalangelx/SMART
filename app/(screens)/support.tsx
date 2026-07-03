import ModuleHub from '@/components/ModuleHub';
import data from '@/utils/data';

export default function SupportScreen() {
  return <ModuleHub moduleKey="connect" items={data.supportList} showBack />;
}
