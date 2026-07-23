import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  Alert,
} from "react-native";
import { Text, Searchbar } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import api from "../api";
import LoadingScreen from "../components/LoadingScreen";
import EmptyState from "../components/EmptyState";
import ErrorBoundary from "../components/ErrorBoundary";
import AppCard from "../components/AppCard";
import AppIconButton from "../components/AppIconButton";
import StatusChip from "../components/StatusChip";
import ErrorState from "../components/ErrorState";
import { theme } from "../theme";

export default function PsrOsrScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetch = useCallback(async () => {
    try {
      setError(null);
      const { data } = await api.get("/psr");
      const list = data?.data || data || [];
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e.response?.data?.error || e.message || "Error al cargar PSR");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetch();
    }, [fetch]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetch();
  }, [fetch]);

  const handleDelete = (item) => {
    Alert.alert("Eliminar", `¿Eliminar PSR "${item.numeroPsr}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/psr/${item.id}`);
            fetch();
          } catch (e) {
            Alert.alert("Error", e.response?.data?.error || e.message);
          }
        },
      },
    ]);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr + "T00:00:00").toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  const filtered = items.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (item.numeroPsr || "").toLowerCase().includes(q);
  });

  const renderItem = ({ item }) => (
    <AppCard
      style={styles.card}
      accessibilityLabel={`PSR ${item.numeroPsr || "sin número"}`}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <Text variant="titleMedium" style={styles.cardTitle}>
            {item.numeroPsr || "Sin PSR"}
          </Text>
          {item.motivoNombreCorto ? (
            <Text variant="bodySmall" style={styles.cardMeta}>
              Motivo: {item.motivoNombreCorto}
            </Text>
          ) : null}
        </View>
        <StatusChip
          status={item.estadoActivo ? "active" : "cancelled"}
          label={item.estadoActivo ? "ACTIVO" : "INACTIVO"}
        />
      </View>
      <View style={styles.details}>
        <Text variant="bodySmall" style={styles.detailText}>
          Fecha PSR: {formatDate(item.fechaPsr)}
        </Text>
        <Text variant="bodySmall" style={styles.detailText}>
          Inicio uso: {formatDate(item.fechaInicioUso)} - Fin:{" "}
          {formatDate(item.fechaFinUso)}
        </Text>
        <Text variant="bodySmall" style={styles.detailText}>
          Meses: {item.meses || "-"} | Campaña: {item.campanaId} | Sede:{" "}
          {item.sedeId}
        </Text>
      </View>
      {item.observaciones ? (
        <Text variant="bodySmall" style={styles.obsText}>
          {item.observaciones}
        </Text>
      ) : null}
      <View style={styles.actions}>
        <AppIconButton
          icon="delete-outline"
          iconColor={theme.colors.status.error}
          size={20}
          accessibilityLabel={`Eliminar PSR ${item.numeroPsr || ""}`}
          onPress={() => handleDelete(item)}
        />
      </View>
    </AppCard>
  );

  if (loading && items.length === 0) return <LoadingScreen />;

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Searchbar
          placeholder="Buscar por número PSR"
          onChangeText={setSearch}
          value={search}
          style={styles.searchbar}
        />
        {error ? (
          <ErrorState
            title="Error al cargar PSR"
            message={error}
            onRetry={fetch}
          />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.action.primary]}
              />
            }
            ListEmptyComponent={
              <EmptyState
                icon="file-document"
                title={search ? "Sin resultados" : "No hay PSR"}
                subtitle={
                  search
                    ? "Intenta con otro término"
                    : "Aún no se han registrado PSR"
                }
              />
            }
          />
        )}
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.page },
  searchbar: {
    margin: theme.spacing[4],
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background.paper,
  },
  list: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[6],
  },
  card: { marginBottom: theme.spacing[3] },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing[2],
  },
  cardInfo: { flex: 1, marginRight: theme.spacing[2] },
  cardTitle: { ...theme.typography.subtitle, color: theme.colors.text.primary },
  cardMeta: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing[1],
  },
  details: { marginBottom: theme.spacing[1] },
  detailText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[1],
  },
  obsText: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    fontStyle: "italic",
    marginTop: theme.spacing[1],
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: theme.spacing[2],
  },
});
