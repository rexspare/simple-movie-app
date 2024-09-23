import { View, Text, Image, TouchableOpacity, Platform, Dimensions, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import { HeartIcon } from 'react-native-heroicons/solid'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import MovieList from '../components/movieList';
import { fallbackPersonImage, fetchPersonDetails, fetchPersonMovies, image185, image342, image500 } from '../api/moviedb';
import Loading from '../components/loading';
import { styles } from '../theme';

const ios = Platform.OS == 'ios';
const verticalMargin = ios ? '' : ' my-3';
var { width, height } = Dimensions.get('window');

export default function PersonScreen() {
    const { params: item } = useRoute();
    const [isFavourite, toggleFavourite] = useState(false);
    const navigation = useNavigation();
    const [person, setPerson] = useState({});
    const [personMovies, setPersonMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getPersonDetails(item.id);
        getPersonMovies(item.id);
    }, [item]);

    const getPersonDetails = async id => {
        const data = await fetchPersonDetails(id);
        console.log('got person details');
        setLoading(false);
        if (data) {
            setPerson(data);
        }
    }
    const getPersonMovies = async id => {
        const data = await fetchPersonMovies(id);
        console.log('got person movies')
        if (data && data.cast) {
            setPersonMovies(data.cast);
        }

    }

    return (
        <ScrollView
            style={localStyles.main}
            contentContainerStyle={{ paddingBottom: 20 }}>
            {/* back button */}
            <SafeAreaView
                style={localStyles.mainRow}>
                <TouchableOpacity style={[styles.background, localStyles.backBtn]} onPress={() => navigation.goBack()}>
                    <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => toggleFavourite(!isFavourite)}>
                    <HeartIcon size="35" color={isFavourite ? 'red' : 'white'} />
                </TouchableOpacity>
            </SafeAreaView>

            {/* person details */}
            {
                loading ? (
                    <Loading />
                ) : (
                    <View>
                        <View
                            style={localStyles.imgContainer}
                        >
                            <View
                                style={localStyles.img}>
                                <Image
                                    // source={require('../assets/images/castImage2.png')} 
                                    source={{ uri: image342(person?.profile_path) || fallbackPersonImage }}
                                    style={{ height: height * 0.43, width: height * 0.43, }}
                                />
                            </View>
                        </View>

                        <View style={{ marginTop: 10 }}>
                            <Text style={localStyles.name}>
                                {/* Keanu Reeves */}
                                {person?.name}
                            </Text>
                            <Text style={localStyles.birthPlace}>
                                {person?.place_of_birth}
                                {/* Beirut, Lebanon */}
                            </Text>
                        </View>

                        <View style={localStyles.context}>
                            <View style={localStyles.contextItem}>
                                <Text style={localStyles.contextTitle}>Gender</Text>
                                <Text style={localStyles.contextVal}>
                                    {/* Male */}
                                    {
                                        person?.gender == 1 ? 'Female' : 'Male'
                                    }
                                </Text>
                            </View>
                            <View style={localStyles.contextItem}>
                                <Text style={localStyles.contextTitle}>Birthday</Text>
                                <Text style={localStyles.contextVal}>
                                    {/* 1964-09-02 */}
                                    {person?.birthday}
                                </Text>
                            </View>
                            <View style={localStyles.contextItem}>
                                <Text style={localStyles.contextTitle}>known for</Text>
                                <Text style={localStyles.contextVal}>
                                    {/* Acting */}
                                    {person?.known_for_department}
                                </Text>
                            </View>
                            <View style={localStyles.contextNoBd}>
                                <Text style={localStyles.contextTitle}>Popularity</Text>
                                <Text style={localStyles.contextVal}>
                                    {/* 84.23 % */}
                                    {person?.popularity?.toFixed(2)} %
                                </Text>
                            </View>

                        </View>
                        <View style={localStyles.bioContainer}>
                            <Text style={localStyles.bioTitle}>Biography</Text>
                            <Text style={localStyles.bio}>
                                {
                                    person?.biography ? person.biography : 'N/A'
                                }
                            </Text>
                        </View>

                        {/* person movies */}
                        {person?.id && personMovies.length > 0 && <MovieList title="Movies" hideSeeAll={true} data={personMovies} />}

                    </View>
                )
            }



        </ScrollView>

    )
}

const localStyles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "#333333"
    },
    mainRow: {
        flexDirection: 'row',   
        justifyContent: 'space-between',
        alignItems: 'center',    
        marginHorizontal: 16,     
        zIndex: 10,
        marginTop: Platform.OS === 'ios' ? 0 : 12
    },
    backBtn: {
        borderRadius: 8,
        padding: 4,
    },
    imgContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'gray',
        shadowRadius: 40,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1,
        elevation:10
    },
    img: {
        alignItems: 'center',
        borderRadius: 50,
        overflow: 'hidden',
        height: 288,
        width: 288,
        borderWidth: 2,
        borderColor: '#A0AEC0',
        justifyContent: 'center',
    },
    name: {
        color: 'white',    
        fontSize: 24,         
        fontWeight: 'bold',   
        textAlign: 'center',
    },
    birthPlace: {
        color: '#A0AEC0',     
        fontSize: 16,          
        textAlign: 'center',
    },
    context: {
        marginHorizontal: 12,  
        padding: 16,           
        marginTop: 24,         
        flexDirection: 'row',  
        justifyContent: 'space-between', 
        alignItems: 'center',  
        backgroundColor: '#4A5568',
        borderRadius: 50,
    },
    contextItem: {
        borderRightWidth: 2,          
        borderRightColor: '#C4B5B0',   
        paddingHorizontal: 8,           
        alignItems: 'center',
    },
    contextTitle: {
        color: 'white',          
        fontWeight: '600',
    },
    contextVal: {
        color: '#D1D5DB',      
        fontSize: 14,
    },
    contextNoBd: {
        paddingHorizontal: 8,   
        alignItems: 'center',
    },
    bioContainer: {
        marginVertical: 24,    
        marginHorizontal: 16,
    },
    bioTitle:{
        color: 'white',       
        fontSize: 18, 
    },
    bio:{
        color: '#A0AEC0',      
        letterSpacing: 1,
        marginTop:10
    }

})