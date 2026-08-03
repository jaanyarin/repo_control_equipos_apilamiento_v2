import React from 'react'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { View, ScrollView } from 'react-native'
import { Icon, Text, Button, IconButton } from 'react-native-paper'
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
import CreatePsrScreen from '../screens/CreatePsrScreen'
import CreateEditUserScreen from '../screens/CreateEditUserScreen'
import SelectPsrEquipmentScreen from '../screens/SelectPsrEquipmentScreen'
import EquipmentFormScreen from '../screens/EquipmentFormScreen'
import EquipmentPhotosScreen from '../screens/EquipmentPhotosScreen'
import DevolucionEquipoScreen from '../screens/DevolucionEquipoScreen'
import MotivosPsrScreen from '../screens/MotivosPsrScreen'
import AuditoriaScreen from '../screens/AuditoriaScreen'
import LoadingScreen from '../components/LoadingScreen'
import { theme } from '../theme'
import { hasPsrAdminRole } from '../utils/roles'

function CatalogoTabScreen() {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
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
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background.page }} contentContainerStyle={{ padding: theme.spacing[4], paddingBottom: theme.spacing[8] + insets.bottom + 68 }}>
      <Text variant="titleMedium" style={{ ...theme.typography.title, color: theme.colors.text.primary, marginBottom: theme.spacing[4] }}>Catálogos y Administración</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[3] }}>
        {catalogItems.map(item => (
          <Button
            key={item.screen}
            mode="contained"
            icon={item.icon}
            onPress={() => navigation.navigate(item.screen)}
            style={{ borderRadius: theme.radius.md, marginBottom: theme.spacing[1], minWidth: '45%', flex: 1 }}
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
        sceneStyle: {
          backgroundColor: theme.colors.background.page,
          paddingTop: insets.top,
        },
        tabBarActiveTintColor: theme.colors.action.primary,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.background.paper,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border.subtle,
          height: 68 + insets.bottom,
          paddingTop: theme.spacing[1],
          paddingBottom: Math.max(insets.bottom, theme.spacing[1]),
        },
        tabBarLabelStyle: { ...theme.typography.caption, fontFamily: theme.fontFamily.medium },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Inicio', tabBarIcon: ({ color, size }) => <Icon source="home" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="EquiposList"
        component={EquiposListScreen}
        options={{ tabBarLabel: 'Equipos', tabBarIcon: ({ color, size }) => <Icon source="warehouse" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Catalogo"
        component={CatalogoTabScreen}
        options={{ tabBarLabel: 'Catálogos', tabBarIcon: ({ color, size }) => <Icon source="bookmark" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ tabBarLabel: 'Perfil', tabBarIcon: ({ color, size }) => <Icon source="account" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  )
}

function MainNavigator() {
  const { user } = useAuth()
  const canManagePsr = hasPsrAdminRole(user)

  return (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.action.primary },
        headerTintColor: theme.colors.text.inverse,
        headerTitleStyle: { fontFamily: theme.fontFamily.semiBold, fontWeight: 'normal' },
      }}
    >
      <MainStack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <MainStack.Screen name="EquipoDetail" component={EquipoDetailScreen} options={{ title: 'Detalle de Equipo' }} />
      <MainStack.Screen name="SelectPsrEquipment" component={SelectPsrEquipmentScreen} options={{ title: 'Seleccionar PSR / OSR' }} />
      <MainStack.Screen name="EquipmentForm" component={EquipmentFormScreen} options={({ route }) => ({
        title: route.params?.mode === 'edit' ? 'Editar equipo' : 'Ingreso de equipo',
      })} />
      <MainStack.Screen name="EquipmentPhotos" component={EquipmentPhotosScreen} options={{ title: 'Fotografías de ingreso', headerBackVisible: false }} />
      <MainStack.Screen name="DevolucionEquipo" component={DevolucionEquipoScreen} options={{ title: 'Finalización del Servicio' }} />
      <MainStack.Screen name="PsrOsr" component={PsrOsrScreen} options={({ navigation }) => ({
        title: 'PSR',
        headerRight: canManagePsr ? () => (
          <IconButton
            icon="plus"
            iconColor={theme.colors.text.inverse}
            size={24}
            onPress={() => navigation.navigate('CreatePsr')}
          />
        ) : undefined,
      })} />
      <MainStack.Screen name="CreatePsr" component={CreatePsrScreen} options={({ route }) => ({
        title: route.params?.mode === 'osr'
          ? 'Agregar OSR'
          : route.params?.psr ? 'Editar PSR' : 'Nuevo PSR',
      })} />
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
      <MainStack.Screen name="CreateEditUser" component={CreateEditUserScreen} options={({ route }) => ({ title: route.params?.user ? 'Editar Usuario' : 'Nuevo Usuario' })} />
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
      <LoadingScreen message="Preparando la aplicación" />
    )
  }

  const navigationState = !user
    ? 'login'
    : user.passwordResetRequired
      ? `password-change-${user.sub || 'user'}`
      : `authenticated-${user.sub || 'user'}`

  return (
    <NavigationContainer key={navigationState}>
      {user ? (
        user.passwordResetRequired ? (
          <AuthNavigator key={`password-change-${user.sub || 'user'}`} initialRouteName="PasswordChange" />
        ) : (
          <MainNavigator />
        )
      ) : (
        <AuthNavigator key="login" initialRouteName="Login" />
      )}
    </NavigationContainer>
  )
}
