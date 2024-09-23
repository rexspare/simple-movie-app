import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback, Dimensions, StyleSheet, Platform } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { XMarkIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'
import { fallbackMoviePoster, image185, searchMovies } from '../api/moviedb'
import { debounce } from 'lodash'
import Loading from '../components/loading'

const { width, height } = Dimensions.get('window');


export default function SearchScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([])

    const handleSearch = search => {
        if (search && search.length > 2) {
            setLoading(true);
            searchMovies({
                query: search,
                include_adult: false,
                language: 'en-US',
                page: '1'
            }).then(data => {
                console.log('got search results');
                setLoading(false);
                if (data && data.results) setResults(data.results);
            })
        } else {
            setLoading(false);
            setResults([])
        }
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

    return (
        <SafeAreaView style={localStyles.main}>

            {/* search input */}
            <View
                style={localStyles.container} >
                <TextInput
                    onChangeText={handleTextDebounce}
                    placeholder="Search Movie"
                    placeholderTextColor={'lightgray'}
                    style={localStyles.input}
                />
                <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                    style={localStyles.btn}
                >
                    <XMarkIcon size="25" color="white" />

                </TouchableOpacity>
            </View>

            {/* search results */}
            {
                loading ? (
                    <Loading />
                ) :
                    results.length > 0 ? (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 15 }}
                            className="space-y-3"
                        >
                            <Text style={localStyles.resultTxt}>Results ({results.length})</Text>
                            <View style={localStyles.resultContainer}>
                                {
                                    results.map((item, index) => {
                                        return (
                                            <TouchableWithoutFeedback
                                                key={index}
                                                onPress={() => navigation.push('Movie', item)}>
                                                <View style={{ marginBottom: 16, }}>
                                                    <Image
                                                        source={{ uri: image185(item.poster_path) || fallbackMoviePoster }}
                                                        // source={require('../assets/images/moviePoster2.png')}
                                                        style={{ width: width * 0.44, height: height * 0.3, borderRadius: 24 }}
                                                    />
                                                    <Text style={localStyles.itemTxt}>
                                                        {
                                                            item.title.length > 22 ? item.title.slice(0, 22) + '...' : item.title
                                                        }
                                                    </Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </View>

                        </ScrollView>
                    ) : (
                        <View style={localStyles.emptyContainer}>
                            <Image
                                source={require('../assets/images/movieTime.png')}
                                style={localStyles.emptyImg}
                            />
                        </View>
                    )
            }
        </SafeAreaView>
    )
}

const localStyles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "#333333"
    },
    container: {
        marginHorizontal: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#A0AEC0',
        borderRadius: 50,
        paddingLeft: '5%'
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        height: 50
    },
    btn: {
        borderRadius: 50,
        padding: 12,
        backgroundColor: '#4A5568',
    },
    resultTxt: {
        color: 'white',           // Equivalent to text-white
        fontWeight: '600',       // Equivalent to font-semibold
        marginLeft: 4,
    },
    resultContainer: {
        flexDirection: 'row',           // Equivalent to flex-row
        justifyContent: 'space-between', // Equivalent to justify-between
        flexWrap: 'wrap',
    },
    itemTxt: {
        color: '#D1D5DB',          // Equivalent to text-gray-300
        marginLeft: 4,
        marginTop: 5
    },
    emptyContainer: {
        flexDirection: 'row',          // Equivalent to flex-row
        justifyContent: 'center'
    },
    emptyImg: {
        height: 384,                  // Equivalent to h-96 (96 * 4px)
        maxWidth: 384,
        width: Dimensions.get('screen').width * 0.95,
        resizeMode: 'contain'
    }
})
