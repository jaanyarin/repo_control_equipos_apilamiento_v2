import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ActivityIndicator, View } from 'react-native'
import { useAuth } from '../AuthContext'
import LoginScreen from '../LoginScreen'
import HomeScreen from '../screens/HomeScreen'
import EquiposListScreen from '../screens/EquiposListScreen'
import EquipoDetailScreen from '../screens/EquipoDetailScreen'
import RegistrarAveriaScreen from '../screens/RegistrarAveriaScreen'
import AtenderAveriaScreen from '../screens/AtenderAveriaScreen'
import PerfilScreen from '../screens/PerfilScreen'
import { IconButton } from 'react-native-paper'

const AuthStack = createNativeStackNavigator()
const MainStack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1565C0',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e0e0e0', paddingBottom: 4, height: 60 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: 500 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Inicio', tabBarIcon: ({ color, size }) => <IconButton icon="home" size={size} iconColor={color} /> }}
      />
      <Tab.Screen
        name="EquiposList"
        component={EquiposListScreen}
        options={{ tabBarLabel: 'Equipos', tabBarIcon: ({ color, size }) => <IconButton icon="warehouse" size={size} iconColor={color} /> }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ tabBarLabel: 'Perfil', tabBarIcon: ({ color, size }) => <IconButton icon="account" size={size} iconColor={color} /> }}
      />
    </Tab.Navigator>
  )
}

function MainNavigator() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1565C0' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 600 },
      }}
    >
      <MainStack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <MainStack.Screen name="EquipoDetail" component={EquipoDetailScreen} options={{ title: 'Detalle de Equipo' }} />
      <MainStack.Screen name="RegistrarAveria" component={RegistrarAveriaScreen} options={{ title: 'Registrar Avería' }} />
      <MainStack.Screen name="AtenderAveria" component={AtenderAveriaScreen} options={{ title: 'Atender Avería' }} />
    </MainStack.Navigator>
  )
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  )
}

export default function AppNavigator() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color="#1565C0" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}
