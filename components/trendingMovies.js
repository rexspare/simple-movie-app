import { View, Text, Image, TouchableWithoutFeedback, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import Carousel from 'react-native-snap-carousel';
import { useNavigation } from '@react-navigation/native';
import { image500 } from '../api/moviedb';

var { width, height } = Dimensions.get('window');

export default function TrendingMovies({ data }) {
    const navigation = useNavigation();

    const handleClick = item => {
        navigation.navigate('Movie', item);
    }
    return (
        <View style={{
            marginBottom: 32
        }}>

            <Text style={localStyles.title}>Trending</Text>
            <Carousel
                data={data}
                renderItem={({ item }) => <MovieCard handleClick={handleClick} item={item} />}
                firstItem={1}
                // loop={true}
                // inactiveSlideScale={0.86}
                inactiveSlideOpacity={0.60}
                sliderWidth={width}
                itemWidth={width * 0.62}
                slideStyle={{ display: 'flex', alignItems: 'center' }}
            />
        </View>
    )
}

const MovieCard = ({ item, handleClick }) => {

    return (
        <TouchableWithoutFeedback onPress={() => handleClick(item)}>
            <Image
                // source={require('../assets/images/moviePoster1.png')} 
                source={{ uri: image500(item.poster_path) }}
                style={localStyles.image}

            />
        </TouchableWithoutFeedback>
    )
}

const localStyles = StyleSheet.create({
    title: {
        color: "#FFFFFF",
        marginBottom: 10,
        fontSize: 18,
        marginHorizontal: 10,
        fontWeight: 'bold'
    },
    image: {
        borderRadius: 24,
        width: width * 0.6,
        height: height * 0.4
    }
})