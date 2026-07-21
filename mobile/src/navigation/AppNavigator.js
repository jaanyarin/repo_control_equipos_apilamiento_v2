import React from 'react'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ActivityIndicator, View, ScrollView } from 'react-native'
import { IconButton, Text, Button } from 'react-native-paper'
import { useAuth } from '../AuthContext'
import LoginScreen from '../LoginScreen'
import PasswordChangeScreen from '../screens/PasswordChangeScreen'
import HomeScreen from '../screens/HomeScreen'
import EquiposListScreen from '../screens/EquiposListScreen'
import EquipoDetailScreen from '../screens/EquipoDetailScreen'
import RegistrarAveriaScreen from '../screens/RegistrarAveriaScreen'
import AtenderAveriaScreen from '../screens/AtenderAveriaScreen'
import PerfilScreen from '../screens/PerfilScreen'
import MarcasScreen from '../screens/MarcasScreen'
import ProveedoresScreen from '../screens/ProveedoresScreen'
import TiposEquipoScreen from '../screens/TiposEquipoScreen'
import SedesScreen from '../screens/SedesScreen'
import CampanasScreen from '../screens/CampanasScreen'
import SettingsScreen from '../screens/SettingsScreen'
import RolesScreen from '../screens/RolesScreen'
import UsuariosScreen from '../screens/UsuariosScreen'
import PsrOsrScreen from '../screens/PsrOsrScreen'
import MotivosPsrScreen from '../screens/MotivosPsrScreen'
import AuditoriaScreen from '../screens/AuditoriaScreen'

function CatalogoTabScreen() {
  const navigation = useNavigation()
  const catalogItems = [
    { label: 'Marcas', icon: 'trademark', screen: 'Marcas' },
    { label: 'Proveedores', icon: 'truck', screen: 'Proveedores' },
    { label: 'Tipos Equipo', icon: 'cog', screen: 'TiposEquipo' },
    { label: 'Sedes', icon: 'map-marker', screen: 'Sedes' },
    { label: 'Campañas', icon: 'calendar', screen: 'Campanas' },
    { label: 'Roles', icon: 'shield-account', screen: 'Roles' },
    { label: 'Usuarios', icon: 'account-group', screen: 'Usuarios' },
    { label: 'Auditoría', icon: 'history', screen: 'Auditoria' },
    { label: 'Motivos PSR', icon: 'clipboard-list', screen: 'MotivosPsr' },
    { label: 'Configuración', icon: 'cog-outline', screen: 'Settings' },
  ]
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }} contentContainerStyle={{ padding: 16 }}>
      <Text variant="titleMedium" style={{ fontWeight: 700, marginBottom: 16 }}>Catálogos y Administración</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {catalogItems.map(item => (
          <Button
            key={item.screen}
            mode="contained"
            icon={item.icon}
            onPress={() => navigation.navigate(item.screen)}
            style={{ borderRadius: 12, marginBottom: 4, minWidth: '45%', flex: 1 }}
            contentStyle={{ height: 56 }}
            labelStyle={{ fontSize: 13, fontWeight: 600 }}
          >
            {item.label}
          </Button>
        ))}
      </View>
    </ScrollView>
  )
}

const AuthStack = createNativeStackNavigator()
const MainStack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function MainTabs() {
  const insets = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1565C0',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 60 + insets.bottom,
          paddingTop: 4,
          paddingBottom: Math.max(insets.bottom, 4),
        },
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
        name="Catalogo"
        component={CatalogoTabScreen}
        options={{ tabBarLabel: 'Catálogos', tabBarIcon: ({ color, size }) => <IconButton icon="bookmark" size={size} iconColor={color} /> }}
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
      <MainStack.Screen name="PsrOsr" component={PsrOsrScreen} options={{ title: 'PSR' }} />
      <MainStack.Screen name="MotivosPsr" component={MotivosPsrScreen} options={{ title: 'Motivos PSR' }} />
      <MainStack.Screen name="RegistrarAveria" component={RegistrarAveriaScreen} options={{ title: 'Registrar Avería' }} />
      <MainStack.Screen name="AtenderAveria" component={AtenderAveriaScreen} options={{ title: 'Atender Avería' }} />
      <MainStack.Screen name="Marcas" component={MarcasScreen} options={{ title: 'Marcas' }} />
      <MainStack.Screen name="Proveedores" component={ProveedoresScreen} options={{ title: 'Proveedores' }} />
      <MainStack.Screen name="TiposEquipo" component={TiposEquipoScreen} options={{ title: 'Tipos de Equipo' }} />
      <MainStack.Screen name="Sedes" component={SedesScreen} options={{ title: 'Sedes' }} />
      <MainStack.Screen name="Campanas" component={CampanasScreen} options={{ title: 'Campañas' }} />
      <MainStack.Screen name="Roles" component={RolesScreen} options={{ title: 'Roles' }} />
      <MainStack.Screen name="Usuarios" component={UsuariosScreen} options={{ title: 'Usuarios' }} />
      <MainStack.Screen name="Auditoria" component={AuditoriaScreen} options={{ title: 'Auditoría' }} />
      <MainStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configuración' }} />
    </MainStack.Navigator>
  )
}

function AuthNavigator({ initialRouteName }) {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="PasswordChange" component={PasswordChangeScreen} />
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
      {user ? (
        user.passwordResetRequired ? (
          <AuthNavigator initialRouteName="PasswordChange" />
        ) : (
          <MainNavigator />
        )
      ) : (
        <AuthNavigator initialRouteName="Login" />
      )}
    </NavigationContainer>
  )
}
