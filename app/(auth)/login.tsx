import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTogglePasswordVisibility } from '@/hooks/useTogglePasswordVisibility';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [loaded] = useFonts({
    MontserratMedium: require('../../assets/fonts/Montserrat-Medium.ttf'),
    MontserratSemiBold: require('../../assets/fonts/Montserrat-SemiBold.ttf'),
  });

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/(tabs)');
      }
    });
  }, []);

  async function signInWithEmail() {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      Alert.alert('Login Error', error.message);
      setLoading(false);
    } else {
      // Ensure profile row exists in database
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(
            { 
              id: data.user.id, 
              email: data.user.email,
              data: null // Will be populated when user first saves data
            },
            { onConflict: 'id' }
          );

        if (profileError) {
          console.error('Error creating profile:', profileError);
        } else {
          console.log('✅ Profile ensured for user:', data.user.id);
        }
      }

      setEmail('');
      setPassword('');
      setLoading(false);
      router.replace('/(tabs)');
    }
  }

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8F00FF" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
      }}
    >
      <Image
        source={require('../../assets/img/Logo.png')}
        style={{ height: 205, marginBottom: 41 }}
        resizeMode="contain"
      />
      
      <TextInput
        style={{
          width: '100%',
          maxWidth: 284,
          height: 52,
          backgroundColor: '#e5e5e5',
          borderRadius: 40,
          paddingLeft: 20,
          paddingRight: 20,
          fontSize: 16,
          color: '#333',
          marginBottom: 30,
          fontFamily: 'MontserratMedium',
        }}
        placeholderTextColor="#8f8f8f"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
      />
      
      <View
        style={{
          backgroundColor: '#e5e5e5',
          width: '100%',
          maxWidth: 284,
          height: 52,
          borderRadius: 40,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TextInput
          style={{
            height: 52,
            paddingRight: 14,
            paddingLeft: 20,
            fontSize: 16,
            width: '85%',
            fontFamily: 'MontserratMedium',
          }}
          placeholder="Enter password"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
          secureTextEntry={passwordVisibility}
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={signInWithEmail}
        />
        <Pressable onPress={handlePasswordVisibility}>
          <MaterialCommunityIcons name={rightIcon} size={22} color="#232323" />
        </Pressable>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={signInWithEmail}
        disabled={loading}
        style={{ marginTop: 46, width: '100%', maxWidth: 284 }}
      >
        <LinearGradient
          colors={['#8F00FF', '#B500B9']}
          start={[0, 0]}
          end={[1, 0]}
          style={{
            width: '100%',
            borderRadius: 25,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#fff',
                fontFamily: 'MontserratSemiBold',
              }}
            >
              Login
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
        <Text
          style={{
            marginTop: 30,
            fontFamily: 'MontserratMedium',
            fontSize: 14,
            color: '#8F00FF',
          }}
        >
          Forgot Password?
        </Text>
      </TouchableOpacity>
    </View>
  );
}
