import { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { supabase } from "../../../services/supabase";
import { AppContext } from "../../../contexts/app";
import theme from "../../../theme";

export default function UsersAdmin() {
  const { makeUserAdmin, banUser, unbanUser, user } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("profiles").select("*").order("full_name");
      if (error) throw error;
      setUsers(data);
    } catch (err) {
      Alert.alert("Erro", err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleMakeAdmin(id, isAdmin) {
    await makeUserAdmin(id, isAdmin);
    fetchUsers();
  }

  async function handleBan(id) {
    await banUser(id);
    fetchUsers();
  }

  async function handleUnban(id) {
    await unbanUser(id);
    fetchUsers();
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.COLORS.BLUE1} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.COLORS.WHITE1 }}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              margin: 10,
              padding: 15,
              backgroundColor: "#fff",
              borderRadius: 10,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Text style={{ fontWeight: "600", color: theme.COLORS.BLUE1 }}>
              {item.full_name || "Usuário sem nome"}
            </Text>
            <Text>Status: {item.status || "ativo"}</Text>
            <Text>Admin: {item.is_admin ? "✅" : "❌"}</Text>
            <Text>Email: {item.email  || ""}</Text>

            {item.id !== user?.id && (
              <View style={{ flexDirection: "row", marginTop: 10, gap: 10 }}>
                <TouchableOpacity
                  onPress={() => handleMakeAdmin(item.id, !item.is_admin)}
                  style={{
                    backgroundColor: item.is_admin ? theme.COLORS.GRAY2 : theme.COLORS.BLUE1,
                    padding: 8,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: theme.COLORS.WHITE1 }}>
                    {item.is_admin ? "Remover admin" : "Tornar admin"}
                  </Text>
                </TouchableOpacity>

                {item.status === "banido" ? (
                  <TouchableOpacity
                    onPress={() => handleUnban(item.id)}
                    style={{
                      backgroundColor: "#28a745",
                      padding: 8,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: "#fff" }}>Reativar</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleBan(item.id)}
                    style={{
                      backgroundColor: "#dc3545",
                      padding: 8,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: "#fff" }}>Banir</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}