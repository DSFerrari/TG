import { View,ActivityIndicator } from "react-native";

import { AuthContext } from "../contexts/auth";

import AuthRoutes from "./auth.routes"

import AppRoutes from "./app.routes"

import { useContext } from "react";

export default function Routes(){
const {signed,loading, isRecoveringPassword} = useContext(AuthContext);

if(loading){
     return(
        <View
        style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F0F1FF'
        }}>
            <ActivityIndicator size="large" color="#131313"/>

        </View>
    )
}

return(
    signed && !isRecoveringPassword? <AppRoutes/> : <AuthRoutes/>
)
}