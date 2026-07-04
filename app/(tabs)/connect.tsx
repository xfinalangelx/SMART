import ModuleHub from '@/components/ModuleHub';
import data from '@/utils/data';

export default function ConnectTab() {
  return <ModuleHub moduleKey="connect" items={data.supportList} />;
}
