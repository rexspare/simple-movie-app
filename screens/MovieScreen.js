import { View, Text, Image, Dimensions, TouchableOpacity, ScrollView, Platform, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { ArrowLeftIcon, ChevronLeftIcon } from 'react-native-heroicons/outline';
import { HeartIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import Cast from '../components/cast';
import MovieList from '../components/movieList';
import { fallbackMoviePoster, fetchMovieCredits, fetchMovieDetails, fetchSimilarMovies, image500 } from '../api/moviedb';
import { styles, theme } from '../theme';
import Loading from '../components/loading';

const ios = Platform.OS == 'ios';
const topMargin = ios ? '' : ' mt-3';
var { width, height } = Dimensions.get('window');

export default function MovieScreen() {
    const { params: item } = useRoute();
    const navigation = useNavigation();
    const [movie, setMovie] = useState({});
    const [cast, setCast] = useState([])
    const [similarMovies, setSimilarMovies] = useState([])
    const [isFavourite, toggleFavourite] = useState(false);
    const [loading, setLoading] = useState(false);



    useEffect(() => {
        setLoading(true);
        getMovieDetials(item.id);
        getMovieCredits(item.id);
        getSimilarMovies(item.id);
    }, [item]);

    const getMovieDetials = async id => {
        const data = await fetchMovieDetails(id);
        console.log('got movie details');
        setLoading(false);
        if (data) {
            setMovie({ ...movie, ...data });
        }
    }
    const getMovieCredits = async id => {
        const data = await fetchMovieCredits(id);
        console.log('got movie credits')
        if (data && data.cast) {
            setCast(data.cast);
        }

    }
    const getSimilarMovies = async id => {
        const data = await fetchSimilarMovies(id);
        console.log('got similar movies');
        if (data && data.results) {
            setSimilarMovies(data.results);
        }

    }
    return (
        <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            style={localStyles.main}>

            {/* back button and movie poster */}
            <View style={{ width: '100%' }}>
                <SafeAreaView style={localStyles.container}>
                    <TouchableOpacity style={[styles.background, localStyles.backBtn]} onPress={() => navigation.goBack()}>
                        <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => toggleFavourite(!isFavourite)}>
                        <HeartIcon size="35" color={isFavourite ? theme.background : 'white'} />
                    </TouchableOpacity>
                </SafeAreaView>
                {
                    loading ? (
                        <Loading />
                    ) : (
                        <View>
                            <Image
                                // source={require('../assets/images/moviePoster2.png')} 
                                source={{ uri: image500(movie.poster_path) || fallbackMoviePoster }}
                                style={{ width, height: height * 0.55 }}
                            />
                            <LinearGradient
                                colors={['transparent', 'rgba(23, 23, 23, 0.8)', 'rgba(23, 23, 23, 1)']}
                                style={localStyles.gradient}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                            />
                        </View>
                    )
                }



            </View>

            {/* movie details */}

            <View style={{ marginTop: -(height * 0.09), paddingVertical: 12 }} >
                {/* title */}
                <Text style={localStyles.title}>
                    {
                        movie?.title
                    }
                </Text>

                {/* status, release year, runtime */}
                {
                    movie?.id ? (
                        <Text style={localStyles.meta}>
                            {movie?.status} • {movie?.release_date?.split('-')[0] || 'N/A'} • {movie?.runtime} min
                        </Text>
                    ) : null
                }



                {/* genres  */}
                <View style={localStyles.rowContainer}>
                    {
                        movie?.genres?.map((genre, index) => {
                            let showDot = index + 1 != movie.genres.length;
                            return (
                                <Text key={index} style={localStyles.genres}>
                                    {genre?.name} {showDot ? "• " : null}
                                </Text>
                            )
                        })
                    }
                </View>

                {/* description */}
                <Text style={localStyles.desc}>
                    {
                        movie?.overview
                    }
                </Text>

            </View>


            {/* cast */}
            {
                movie?.id && cast.length > 0 && <Cast navigation={navigation} cast={cast} />
            }

            {/* similar movies section */}
            {
                movie?.id && similarMovies.length > 0 && <MovieList title={'Similar Movies'} hideSeeAll={true} data={similarMovies} />
            }

        </ScrollView>
    )
}

const localStyles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "#333333"
    },
    container: {
        position: 'absolute',
        zIndex: 20,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: Platform.OS === 'ios' ? 60 : 12
    },
    backBtn: {
        borderRadius: 8,
        padding: 4,
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        width: width,
        height: height * 0.40
    },
    title: {
        color: 'white',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    meta: {
        color: '#A0AEC0',
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 16,
    },
    genres: {
        color: '#A0AEC0',
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'center',
    },
    desc: {
        color: '#ffffff',
        letterSpacing: 1.5,
        width: '90%',
        alignSelf: 'center',
        marginVertical: 10
    }
})
