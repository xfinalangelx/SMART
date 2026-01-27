import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="knowledge" />
      <Stack.Screen name="analysis" />
      <Stack.Screen name="checklist" />
      <Stack.Screen name="support" />
      
      {/* Knowledge section */}
      <Stack.Screen name="trivia" />
      <Stack.Screen name="video" />
      <Stack.Screen name="medication" />
      <Stack.Screen name="med-category" />
      <Stack.Screen name="medicine-detail" />
      
      {/* Analysis section */}
      <Stack.Screen name="cd4-graph" />
      <Stack.Screen name="blood-sugar-graph" />
      <Stack.Screen name="renal-graph" />
      <Stack.Screen name="lipid-graph" />
      
      {/* Checklist section */}
      <Stack.Screen name="all-checklist" />
      <Stack.Screen name="vaccination" />
      <Stack.Screen name="blood-test" />
      <Stack.Screen name="appointments" />
      <Stack.Screen name="journal" />
      
      {/* Support section */}
      <Stack.Screen name="hospitals" />
      <Stack.Screen name="clinics" />
      <Stack.Screen name="organizations" />
      <Stack.Screen name="websites" />
      <Stack.Screen name="apps" />
    </Stack>
  );
}
