import React, {useState, useEffect} from 'react'
import { Feather as Icon } from '@expo/vector-icons'
import { View, ImageBackground , Image, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios'

import styles from './styles'

interface IBGEUFResponse {
    sigla: string,
}

interface IBGECityResponse {
    nome: string,
}

const Home = () => {
    const navigation = useNavigation();

    const [ufs, setUfs] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])


    const [uf, setUf] = useState('0')
    const [city, setCity] = useState('')

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                const ufInitials = response.data.map(uf  => uf.sigla)
                setUfs(ufInitials)
            })
    }, [])
    
    useEffect(() => {
        if(uf === '0'){
            return ;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city  => city.nome)
                console.log(cityNames);
                setCities(cityNames)
            })
    }, [uf])

    function handleNavigationToPoints(){
        navigation.navigate("Points", {
            uf, 
            city
        })
    }

    function handleChangingUf(selectedUf: string){
        setCity('')
        setUf(selectedUf)
    }

    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'height' : undefined}>
            <ImageBackground 
                style={styles.container} 
                source={require('../../assets/home-background.png')} 
                imageStyle={{width: 274, height: 368}}
            >
                <View style={styles.main}>
                    <View>
                    <Image source={require('../../assets/logo.png')}></Image>
                        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
                    </View>
                </View>

                <View style={styles.footer} >
                    <RNPickerSelect
                        style={{inputIOS: styles.input, inputAndroid: styles.input}}
                        placeholder={{label: "Selecione uma UF", value: '0'}}
                        onValueChange={(selectedUf) => {handleChangingUf(selectedUf)}}
                        items={ ufs.map(uf => ({label: uf, value: uf}) )}
                    />

                    <RNPickerSelect
                        style={{inputIOS: styles.input, inputAndroid: styles.input}}
                        placeholder={{label: "Selecione uma cidade", value: 0}}
                        disabled={uf == '0'}
                        value={city}
                        onValueChange={setCity}
                        items={ cities.map(city => ({label: city, value: city}) )}
                    />
                    <RectButton style={styles.button} onPress={handleNavigationToPoints}>
                        <View style={styles.buttonIcon}>
                            <Text>
                                <Icon name="arrow-right" color="#FFF" size={24}>

                                </Icon>
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>
                            Entrar
                        </Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}

export default Home