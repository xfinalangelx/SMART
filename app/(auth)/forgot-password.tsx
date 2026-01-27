import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  
  const [loaded] = useFonts({
    MontserratSemiBold: require('../../assets/fonts/Montserrat-SemiBold.ttf'),
    MontserratMedium: require('../../assets/fonts/Montserrat-Medium.ttf'),
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8F00FF" />
      </View>
    );
  }

  async function sendPasswordResetMail() {
    if (!email) {
      console.log('❌ Forgot Password Error: No email provided');
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    console.log('🔄 Forgot Password: Attempting to send reset email to:', email.trim());
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: 'smart://reset-password',
      });
      
      setLoading(false);

      if (error) {
        console.error('❌ Forgot Password Error:', {
          message: error.message,
          status: error.status,
          name: error.name,
          email: email.trim(),
          timestamp: new Date().toISOString(),
        });
        Alert.alert('Error', error.message);
      } else {
        console.log('✅ Forgot Password Success:', {
          email: email.trim(),
          data: data,
          timestamp: new Date().toISOString(),
        });
        Alert.alert(
          'Success',
          'Password reset email sent successfully! Please check your inbox.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (err) {
      setLoading(false);
      console.error('❌ Forgot Password Unexpected Error:', {
        error: err,
        email: email.trim(),
        errorType: typeof err,
        errorMessage: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
      });
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingTop: insets.top,
        width: '100%',
      }}
    >
      <View
        style={{
          display: 'flex',
          marginTop: 21,
          marginLeft: 11,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={40} color="#232323" />
        </TouchableOpacity>
      </View>
      
      <Text
        style={{
          fontSize: 18,
          fontFamily: 'MontserratSemiBold',
          marginLeft: 17,
          marginTop: 21,
        }}
      >
        Forgot Password?
      </Text>
      
      <Text
        style={{
          paddingVertical: 20,
          fontSize: 12,
          fontFamily: 'MontserratMedium',
          paddingHorizontal: 20,
        }}
      >
        Please enter your email associated with account registration. Upon
        submission, a password reset email will be sent. You may check your inbox
        afterwards to reset your password.
      </Text>
      
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          flex: 1,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 20,
          }}
        >
          <TextInput
            style={{
              width: '100%',
              height: 52,
              backgroundColor: '#e5e5e5',
              paddingLeft: 20,
              paddingRight: 20,
              fontSize: 16,
              borderRadius: 40,
              color: '#333',
              fontFamily: 'MontserratMedium',
            }}
            placeholderTextColor="#8f8f8f"
            placeholder="Enter email here"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            onSubmitEditing={sendPasswordResetMail}
          />
          
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={sendPasswordResetMail}
            disabled={loading}
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
                  Send Reset Email
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
