import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native";

import { AuthContext } from "../contexts/auth";
import { AppContext } from "../contexts/app";

import AuthRoutes from "./auth.routes";
import AppRoutes from "./app.routes";
import AdminRoutes from "./admin.routes";

export default function Routes() {
  const { signed, loading, isRecoveringPassword } = useContext(AuthContext);
  const { userIsAdmin, loadingProfile } = useContext(AppContext);

  if (loading || loadingProfile) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F0F1FF",
        }}
      >
        <ActivityIndicator size="large" color="#131313" />
      </View>
    );
  }

  if (!signed) {
    return <AuthRoutes />;
  }

  if (isRecoveringPassword) {
    return <AuthRoutes />;
  }

 // if (userIsAdmin) {
 //   return 
  //  <AppRoutes />
    //<AdminRoutes />;
 // }

  return <AppRoutes />;
}
